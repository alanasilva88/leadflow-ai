"use client";

import { usePathname } from "next/navigation";
import { MobileNavigation } from "./mobile-navigation";

function pageInfo(pathname: string) {
  if (pathname === "/dashboard")
    return ["Visão geral", "Acompanhe o andamento da sua prospecção."];
  if (pathname === "/leads/new")
    return ["Adicionar lead", "Registre uma nova oportunidade comercial."];
  if (pathname.endsWith("/edit"))
    return ["Editar lead", "Atualize as informações desta oportunidade."];
  if (pathname === "/leads")
    return ["Leads", "Consulte, filtre e gerencie suas oportunidades."];
  if (pathname.startsWith("/leads/"))
    return [
      "Detalhes do lead",
      "Veja todo o histórico e diagnóstico da oportunidade.",
    ];
  return ["LeadFlow AI", "Assistente de prospecção"];
}

export function AppHeader() {
  const pathname = usePathname();
  const [title, description] = pageInfo(pathname);
  const isLeadDetail = /^\/leads\/[^/]+$/.test(pathname);
  return (
    <header className={`sticky top-0 z-20 border-b bg-white/95 backdrop-blur ${pathname === "/dashboard" || pathname === "/leads" || pathname === "/leads/import" || pathname === "/leads/new" || isLeadDetail ? "hidden lg:block" : ""}`}>
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileNavigation />
        <div>
          <h1 className="font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="hidden text-sm text-slate-500 sm:block">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}
