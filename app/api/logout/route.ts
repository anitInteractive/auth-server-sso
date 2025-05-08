import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

function getCORSHeaders(origin: string | null) {
  const headers: Record<string, string> = {};
  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  return headers;
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = getCORSHeaders(origin);

  headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type";

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCORSHeaders(origin);

  const response = NextResponse.json({ message: "Logged out" });
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  (await cookies()).set("sso_session", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    expires: new Date(0), // expire immediately
  });
  return response;
}
