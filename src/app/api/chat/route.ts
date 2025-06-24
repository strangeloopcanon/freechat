import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import OpenAI from "openai";
import { ChatRequest } from "@/types/message";
import { Session } from "next-auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { messages }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Use O3 with standard chat completions API
    const completion = await openai.chat.completions.create({
      model: "o3",
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Extract response content
    const content = completion.choices[0]?.message?.content || "Sorry, I encountered an error. Please try again.";

    return NextResponse.json({
      content: content,
      done: true
    });

  } catch (error) {
    console.error("O3 API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 