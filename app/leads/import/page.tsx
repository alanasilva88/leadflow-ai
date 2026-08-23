import { Bot, LayoutDashboard, Network, Upload, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { ImportWizard } from "@/components/leads/import/import-wizard";
import { verifySession } from "@/lib/auth/session";

export const metadata = { title: "Importar leads | LeadFlow AI", description: "Importe leads de arquivos XLSX e CSV." };
export default async function ImportLeadsPage(){await verifySession();return <div className="-mx-4 -my-6 min-h-screen bg-[#f8f9fa] pb-24 text-[#191c1d] sm:-mx-6 lg:mx-0 lg:my-0 lg:min-h-0 lg:pb-0">
  <header className="flex h-16 items-center justify-between border-b border-[#c7c4d8] px-4 lg:hidden"><div className="flex items-center gap-2 text-[#3525cd]"><Network size={25}/><strong className="text-2xl tracking-[-0.02em]">LeadFlow AI</strong></div><span className="grid size-8 place-items-center rounded-full border border-[#c7c4d8] bg-[#edeeef]"><UserRound size={14}/></span></header>
  <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-0 lg:pt-0"><div className="mb-8"><h1 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.03em]">Importar Leads</h1><p className="mt-2 max-w-sm text-sm leading-5 text-[#464555]">Faça upload da sua lista para validação e importação.</p></div><ImportWizard/></main>
  <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t border-[#c7c4d8] bg-[#f8f9fa] shadow-[0_-2px_8px_rgba(0,0,0,.05)] lg:hidden" aria-label="Navegação da importação"><MobileLink href="/dashboard" label="Dashboard" icon={LayoutDashboard}/><MobileLink href="/leads" label="Leads" icon={Users}/><MobileLink href="/leads/import" label="Importar" icon={Upload} active/><MobileLink href="/leads?analysis=completed" label="Análises" icon={Bot}/></nav>
 </div>}
function MobileLink({href,label,active=false,icon:Icon}:{href:string;label:string;active?:boolean;icon:typeof LayoutDashboard}){return <Link href={href} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active?"text-[#3525cd]":"text-[#404758]"}`}><Icon size={19}/><span>{label}</span></Link>}
