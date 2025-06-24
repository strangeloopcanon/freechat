"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import SignOutButton from "./SignOutButton";

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">FreeChat</h1>
          <span className="text-sm text-gray-500">AI-Powered Conversations</span>
        </div>
        
        {session?.user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
              )}
              <span className="text-sm text-gray-700">
                {session.user.name || session.user.email}
              </span>
            </div>
            <SignOutButton />
          </div>
        )}
      </div>
    </header>
  );
} 