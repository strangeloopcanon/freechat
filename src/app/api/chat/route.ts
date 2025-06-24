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

    // Convert chat messages to O3 input format
    const conversationHistory = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');

    // Create O3 response using the responses API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (openai as any).responses.create({
      model: "o3",
      input: [
        {
          type: "message",
          role: "user", 
          content: conversationHistory
        }
      ],
      text: {
        format: {
          type: "text"
        }
      },
      reasoning: {
        effort: "medium"
      },
      tools: [],
      store: true
    });

    // Extract the response content
    let content = "Sorry, I encountered an error. Please try again.";
    
    if (response && response.output && response.output.length > 0) {
      const firstOutput = response.output[0];
      if (firstOutput && typeof firstOutput === 'object') {
        // Try different possible response formats
        if ('text' in firstOutput && firstOutput.text) {
          content = firstOutput.text;
        } else if ('content' in firstOutput && firstOutput.content) {
          content = Array.isArray(firstOutput.content) 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? firstOutput.content.map((c: any) => c.text || c.content || '').join('')
            : firstOutput.content;
        } else if ('message' in firstOutput && firstOutput.message) {
          content = firstOutput.message.content || firstOutput.message;
        }
      }
    }

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