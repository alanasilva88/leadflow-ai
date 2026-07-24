"use client";

import { BarChart3, FileUp, Plus, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navigation = [
  { href: "/dashboard", label: "Visão geral", icon: BarChart3 },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/leads/new", label: "Adicionar lead", icon: Plus },
  { href: "/leads/import", label: "Importar leads", icon: FileUp },
];

export function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegação principal" className="space-y-1">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/leads" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
          >
            <Icon size={19} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-slate-950 px-5 py-6 lg:flex">
      <div className="mb-9 flex items-center gap-3 px-2">
        <div className="grid size-10 place-items-center rounded-xl bg-blue-600 font-bold text-white">
          LF
        </div>
        <div>
          <p className="font-semibold text-white">LeadFlow AI</p>
          <p className="text-xs text-slate-400">Assistente de prospecção</p>
        </div>
      </div>
      <NavigationLinks />
      <p className="mt-auto px-2 text-xs leading-5 text-slate-500">
        Organize oportunidades e mantenha seus próximos contatos em dia.
      </p>
    </aside>
  );
}
