import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import OpenAI from "openai";
import { ChatRequest } from "@/types/message";
import { Session } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { messages, apiKey }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Use user's API key if provided, otherwise fall back to server's key
    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "No API key provided" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Use O3 with standard chat completions API
    const completion = await openai.chat.completions.create({
      model: "o3",
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      max_completion_tokens: 1000,
    });

    // Extract response content
    const content = completion.choices[0]?.message?.content || "Sorry, I encountered an error. Please try again.";

    return NextResponse.json({
      content: content,
      done: true
    });

  } catch (error) {
    console.error("O3 API error:", error);
    
    // Handle specific API key errors
    if (error instanceof Error) {
      if (error.message.includes("401") || error.message.includes("unauthorized")) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your OpenAI API key." },
          { status: 401 }
        );
      }
      if (error.message.includes("quota") || error.message.includes("billing")) {
        return NextResponse.json(
          { error: "API quota exceeded or billing issue. Please check your OpenAI account." },
          { status: 402 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 