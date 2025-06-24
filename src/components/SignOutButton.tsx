"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
    >
      Sign Out
    </button>
  );
} 