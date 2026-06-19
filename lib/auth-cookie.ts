import { TOKEN_KEY } from "@/lib/utils";

export function extractTokenFromSetCookie(
  setCookie: string | null
): string | null {
  if (!setCookie) return null;

  const match = setCookie.match(new RegExp(`${TOKEN_KEY}=([^;]+)`));
  return match?.[1] ?? null;
}

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 400,
};
