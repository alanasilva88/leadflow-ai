import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/session";

export const metadata = { title: "Login" };
export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");
  return <div className="fixed inset-0 z-50 grid min-h-screen place-items-center bg-slate-950 px-4">
    <main className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl sm:p-9">
      <div className="mb-6 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-blue-600 font-bold text-white">LF</div><div><p className="font-semibold">LeadFlow AI</p><p className="text-sm text-slate-500">Assistente de prospecção</p></div></div>
      <h1 className="text-2xl font-bold">Acesse sua conta</h1><p className="mt-2 text-sm text-slate-600">Entre com as credenciais do administrador.</p><LoginForm />
    </main>
  </div>;
}
