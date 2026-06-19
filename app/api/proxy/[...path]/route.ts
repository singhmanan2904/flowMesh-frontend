import { TOKEN_KEY } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "API URL not configured" },
      { status: 500 }
    );
  }

  const { path } = await params;
  const targetUrl = `${API_URL}/${path.join("/")}${request.nextUrl.search}`;
  const token = (await cookies()).get(TOKEN_KEY);

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  if (token) {
    headers.set("Cookie", `${TOKEN_KEY}=${token.value}`);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
