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

    // Use O3-mini with extended thinking time
    console.log("Making OpenAI API call with model: o3-mini (2min timeout for thinking)");
    console.log("Messages being sent:", JSON.stringify(messages, null, 2));
    
    const completion = await openai.chat.completions.create({
      model: "o3-mini",
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      max_completion_tokens: 500, // Reduced for faster responses
    }, {
      timeout: 60000, // 1 minute timeout - reduced for faster feedback
    });

    // Extract response content
    console.log("OpenAI response:", JSON.stringify(completion, null, 2));
    console.log("Choices:", completion.choices);
    console.log("First choice:", completion.choices[0]);
    console.log("Message content:", completion.choices[0]?.message?.content);
    
    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      console.error("No content in OpenAI response");
      return NextResponse.json(
        { error: "No response content from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: content,
      done: true
    });

  } catch (error) {
    console.error("O3 API error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
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
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Request timed out. Please try again." },
          { status: 408 }
        );
      }
      if (error.message.includes("rate_limit") || error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      if (error.message.includes("model") || error.message.includes("o3")) {
        return NextResponse.json(
          { error: "Model temporarily unavailable. Please try again in a moment." },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 