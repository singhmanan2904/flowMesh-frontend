import { authCookieOptions, extractTokenFromSetCookie } from "@/lib/auth-cookie";
import { TOKEN_KEY } from "@/lib/utils";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "API URL not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const token =
    extractTokenFromSetCookie(response.headers.get("set-cookie")) ??
    (typeof data.token === "string" ? data.token : null);

  const res = NextResponse.json(data);

  if (token) {
    res.cookies.set(TOKEN_KEY, token, authCookieOptions);
  }

  return res;
}
