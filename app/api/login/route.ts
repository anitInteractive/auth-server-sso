import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = "sso-server";
const user = { id: 1, email: "user@example.com", password: "123456" };

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

  headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type";

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const origin = req.headers.get("origin");
  const corsHeaders = getCORSHeaders(origin);

  if (email === user.email && password === user.password) {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const response = NextResponse.json({ token });
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    (await cookies()).set("sso_session", "true", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return response;
  } else {
    const errorResponse = NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
    Object.entries(corsHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    return errorResponse;
  }
}
