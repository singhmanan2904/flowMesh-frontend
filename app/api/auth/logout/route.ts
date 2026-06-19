import { authCookieOptions } from "@/lib/auth-cookie";
import { TOKEN_KEY } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(TOKEN_KEY, "", { ...authCookieOptions, maxAge: 0 });
  return res;
}
