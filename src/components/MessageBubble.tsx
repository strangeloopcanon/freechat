import { Message } from "@/types/message";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white ml-12"
            : "bg-gray-100 text-gray-900 mr-12"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">AI</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Assistant</span>
          </div>
        )}
        
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap break-words m-0">
            {message.content}
          </p>
        </div>
        
        {message.timestamp && (
          <div className={`text-xs mt-1 ${isUser ? "text-blue-100" : "text-gray-400"}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
} 