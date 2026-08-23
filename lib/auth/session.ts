import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import { authConfig, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "./config";

const issuer = "leadflow-ai";
const audience = "leadflow-admin";
const key = (secret: string) => new TextEncoder().encode(secret);

export async function createSessionToken(email: string) {
  const { secret } = authConfig();
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt().setIssuer(issuer).setAudience(audience)
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`).sign(key(secret));
}

export async function readSessionToken(token?: string) {
  if (!token) return null;
  try {
    const { secret, email } = authConfig();
    const result = await jwtVerify(token, key(secret), { issuer, audience });
    return result.payload.role === "admin" && result.payload.email === email
      ? { email, role: "admin" as const, expiresAt: new Date((result.payload.exp ?? 0) * 1000) }
      : null;
  } catch { return null; }
}

export async function getSession() {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function verifySession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    path: "/", maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
