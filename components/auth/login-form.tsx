"use client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { loginAction } from "@/lib/actions/auth-actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);
  return <form action={action} className="mt-7 space-y-5">
    <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">E-mail</label><input id="email" name="email" type="email" autoComplete="username" required className="input" /></div>
    <div><label htmlFor="password" className="mb-1.5 block text-sm font-medium">Senha</label><div className="relative"><input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required className="input pr-11" /><button type="button" onClick={() => setShow(v => !v)} className="absolute inset-y-0 right-0 px-3 text-slate-500" aria-label={show ? "Ocultar senha" : "Mostrar senha"}>{show ? <EyeOff size={19}/> : <Eye size={19}/>}</button></div></div>
    {state?.error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{pending && <Loader2 className="animate-spin" size={18}/>} Entrar</button>
  </form>;
}
