import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import OpenAI from "openai";
import { Session } from "next-auth";

interface GenerateAdsRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { messages, apiKey }: GenerateAdsRequest = await req.json();

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

    // Create conversation summary for ad generation
    const conversationSummary = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `Based on this conversation, generate 2 contextual sci-fi product ads that would be relevant to the user's interests. 

Conversation:
${conversationSummary}

Generate exactly 2 ads in this JSON format:
[
  {
    "title": "Product Name",
    "description": "Brief description of the product benefits",
    "price": "$XX",
    "originalPrice": "$XXX",
    "badge": "CATEGORY",
    "badgeColor": "from-color1-500 to-color2-500",
    "buttonColor": "from-color1-500 to-color2-500",
    "buttonText": "Action Text →"
  }
]

Requirements:
- Make ads relevant to the conversation topics
- Use sci-fi/futuristic themes
- Include realistic pricing
- Use appropriate color gradients
- Keep descriptions concise but compelling
- Make badges 2-4 letters representing the category
- Ensure button text is action-oriented

Return only valid JSON, no other text.`;

    console.log("Generating ads with GPT-4o-mini for conversation:", messages.length, "messages");
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating compelling, contextual advertisements. Generate exactly 2 ads in the specified JSON format based on conversation content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    }, {
      timeout: 30000, // 30 second timeout
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      console.error("No content in OpenAI response for ad generation");
      return NextResponse.json(
        { error: "No response content from OpenAI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    try {
      // Clean the content - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      const ads = JSON.parse(cleanContent);
      console.log("Generated ads:", ads);
      
      return NextResponse.json({
        ads: ads,
        done: true
      });
    } catch (error) {
      console.error("Failed to parse ads JSON:", content);
      console.error("Parse error:", error);
      return NextResponse.json(
        { error: "Invalid ad generation response" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Ad generation error:", error);
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
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 