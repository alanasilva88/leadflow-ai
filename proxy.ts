import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const cookie = "leadflow_session";
async function valid(request: NextRequest) {
  const token = request.cookies.get(cookie)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  try { await jwtVerify(token, new TextEncoder().encode(secret), { issuer: "leadflow-ai", audience: "leadflow-admin" }); return true; } catch { return false; }
}
export async function proxy(request: NextRequest) {
  const authenticated = await valid(request);
  if (request.nextUrl.pathname === "/login") return authenticated ? NextResponse.redirect(new URL("/dashboard", request.url)) : NextResponse.next();
  if (!authenticated) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
