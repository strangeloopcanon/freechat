"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Message } from "@/types/message";
import MessageBubble from "./MessageBubble";
import ApiKeyManager from "./ApiKeyManager";

interface ChatWindowProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export default function ChatWindow({ messages, setMessages }: ChatWindowProps) {
  const { status } = useSession();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    if (status !== "authenticated") {
      setMessages([...messages, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Please log in to use the chat. You can sign in using the button in the top right.",
        timestamp: new Date(),
      }]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 295000); // 295 second timeout for O3 deep thinking
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          apiKey: userApiKey, // Send user's API key if available
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      // Handle O3-mini response (JSON format, not streaming)
      const data = await response.json();
      console.log("API response data:", data);
      
      if (data.content) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        };

        setMessages([...messages, userMessage, assistantMessage]);
      } else {
        console.error("No content in response:", data);
        throw new Error("No content in response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Please make sure you're logged in. Try refreshing the page or signing in again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "The AI is taking too long to respond. Please try again.";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        } else if (error.message.includes("model") || error.message.includes("unavailable")) {
          errorMessage = "The AI model is temporarily unavailable. Please try again in a moment.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages([...messages, userMessage, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* API Key Manager Toggle */}
      <div className="border-b border-gray-200 p-4">
        <button
          onClick={() => setShowApiKeyManager(!showApiKeyManager)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          {showApiKeyManager ? "Hide" : "Show"} API Key Settings
        </button>
      </div>

      {/* API Key Manager */}
      {showApiKeyManager && (
        <div className="border-b border-gray-200 p-4">
          <ApiKeyManager onApiKeyChange={setUserApiKey} />
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-white font-bold">AI</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to FreeChat
            </h2>
            <p className="text-gray-600 max-w-md mb-4">
              Start a conversation with our AI assistant. Ask questions, get help with tasks, or just chat!
            </p>
            {!userApiKey && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Add your own OpenAI API key above to pay for your own usage and avoid rate limits.
                </p>
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg mr-12">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
                <span className="text-sm text-gray-500">O3 is deep thinking... (this may take a few minutes)</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 min-h-[40px] text-gray-900 bg-white"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
} 