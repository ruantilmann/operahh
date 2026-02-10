import { env } from "@operahh/env/web";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiUrl = new URL("/api/auth/get-session", env.NEXT_PUBLIC_SERVER_URL);
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: Object.fromEntries(request.headers.entries()),
      credentials: "include",
    });

    const body = await response.text();
    return new Response(body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return Response.json(
      { authenticated: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
