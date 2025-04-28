import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret";
const user = { id: 1, email: "user@example.com" };
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

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

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCORSHeaders(origin);

  const session = req.cookies.get("sso_session");
  console.log("session.value", session?.value);
  if (session?.value === "true") {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const res = NextResponse.json({ token });

    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });
    return res;
  }

  const res = NextResponse.json(
    { message: "No active session" },
    { status: 401 }
  );
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
  return res;
}
