import { NextRequest } from "next/server";
import { authOptions } from "@/lib/authOptions";

// Import the NextAuth handler
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NextAuth = require("next-auth").default;

const handler = NextAuth(authOptions);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
} 