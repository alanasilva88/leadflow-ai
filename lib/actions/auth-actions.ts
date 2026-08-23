"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authConfig } from "@/lib/auth/config";
import { checkLoginRateLimit, resetLoginRateLimit } from "@/lib/auth/rate-limit";
import { clearSessionCookie, createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { verifyAdminCredentials } from "@/lib/auth/credentials";

const schema = z.object({ email: z.email().trim().toLowerCase(), password: z.string().min(1).max(200) });
export type LoginState = { error?: string } | undefined;

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  const h = await headers();
  const key = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const limit = checkLoginRateLimit(key);
  if (!limit.allowed) return { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
  if (!parsed.success) return { error: "E-mail ou senha inválidos." };
  try {
    const config = authConfig();
    const valid = await verifyAdminCredentials(parsed.data, config);
    if (!valid) return { error: "E-mail ou senha inválidos." };
    resetLoginRateLimit(key);
    await setSessionCookie(await createSessionToken(config.email));
  } catch { return { error: "Não foi possível entrar. Verifique a configuração do servidor." }; }
  redirect("/dashboard");
}

export async function logoutAction() { await clearSessionCookie(); redirect("/login"); }
