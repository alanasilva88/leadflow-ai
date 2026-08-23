import "server-only";

export const SESSION_COOKIE = "leadflow_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 12;

export function authConfig() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const secret = process.env.AUTH_SECRET?.trim();
  if (!email || !passwordHash || !secret || secret.length < 32) {
    throw new Error("A autenticação do administrador não está configurada corretamente.");
  }
  return { email, passwordHash, secret };
}
