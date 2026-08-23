import { Bell, Bot, LayoutDashboard, Search, SlidersHorizontal, Upload, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { verifySession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const priorityStyle = {
  HIGH: { label: "ALTA", color: "#ba1a1a", badge: "bg-[#ffdad6] text-[#93000a]" },
  MEDIUM: { label: "MÉDIA", color: "#7e3000", badge: "bg-[#a44100] text-[#ffd2be]" },
  LOW: { label: "BAIXA", color: "#575e70", badge: "bg-[#d9dff5] text-[#5c6274]" },
} as const;
const percent = (value: number, total: number) => total ? Math.round((value / total) * 100) : 0;

export default async function DashboardPage() {
  await verifySession();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [total, high, medium, low, fresh, overdue, recent] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { salesPotential: "HIGH" } }),
    prisma.lead.count({ where: { salesPotential: "MEDIUM" } }),
    prisma.lead.count({ where: { salesPotential: "LOW" } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { followUpDate: { lt: today }, status: { notIn: ["CLOSED", "LOST"] } } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  const distribution = [
    { key: "HIGH", label: "Alta", value: high, color: "#ba1a1a" },
    { key: "MEDIUM", label: "Média", value: medium, color: "#7e3000" },
    { key: "LOW", label: "Baixa", value: low, color: "#575e70" },
  ] as const;

  return <div className="-mx-4 -my-6 min-h-screen bg-[#f8f9fa] pb-24 text-[#191c1d] sm:-mx-6 lg:mx-0 lg:my-0 lg:min-h-0 lg:rounded-2xl lg:pb-8">
    <header className="flex h-16 items-center justify-between border-b border-[#c7c4d8] px-5 lg:hidden">
      <div className="grid size-10 place-items-center text-[#3525cd]"><Bot size={25}/></div>
      <p className="text-2xl font-bold tracking-[-0.02em] text-[#3525cd]">LeadFlow AI</p>
      <Image src="/figma/dashboard-avatar.png" alt="Administrador" width={32} height={32} className="size-8 rounded-full border border-[#c7c4d8] object-cover"/>
    </header>
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-4 sm:px-6 lg:px-0 lg:pt-0">
      <section className="flex items-end justify-between gap-4">
        <div><h1 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.03em]">Dashboard</h1><p className="mt-1 max-w-[270px] text-sm leading-5 text-[#464555]">Visão geral, em tempo real, do seu funil de leads.</p></div>
        <div className="flex gap-2"><Link href="/leads" aria-label="Pesquisar leads" className="grid size-10 place-items-center rounded-full border border-[#c7c4d8] bg-white shadow-sm"><Search size={18}/></Link><Link href="/leads?followUp=overdue" aria-label={`${overdue} follow-ups atrasados`} className="relative grid size-10 place-items-center rounded-full border border-[#c7c4d8] bg-white shadow-sm"><Bell size={18}/>{overdue>0&&<span className="absolute right-2 top-2 size-2 rounded-full bg-[#ba1a1a]"/>}</Link></div>
      </section>
      <section className="grid grid-cols-2 gap-2" aria-label="Métricas por prioridade">
        <div className="col-span-2 rounded-xl border border-[#c7c4d8] bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.05em] text-[#464555]"><span>Total de leads</span><Users size={17}/></div><p className="mt-2 text-5xl font-semibold leading-none tracking-[-0.04em]">{total.toLocaleString("pt-BR")}</p><p className="mt-3 text-xs font-medium tracking-wide text-[#575e70]">↗ {fresh} lead{fresh===1?"":"s"} novo{fresh===1?"":"s"}</p></div>
        <PriorityCard label="Alta Prioridade" value={high} color="#ba1a1a"/><PriorityCard label="Média Prioridade" value={medium} color="#7e3000"/>
        <div className="col-span-2 flex items-center justify-between rounded-xl border border-[#c7c4d8] bg-white p-4 shadow-sm"><span className="flex items-center gap-2 text-xs font-medium tracking-wide text-[#464555]"><i className="size-2 rounded-full bg-[#575e70]"/> Baixa Prioridade</span><strong className="text-2xl font-medium">{low}</strong></div>
      </section>
      <section className="rounded-xl border border-[#c7c4d8] bg-white p-4 shadow-sm"><h2 className="text-xs font-medium uppercase tracking-[0.05em]">Visão geral</h2><div className="mt-4 flex h-4 overflow-hidden rounded-full bg-[#edeeef]">{distribution.map(item=><span key={item.key} style={{width:`${percent(item.value,total)}%`,backgroundColor:item.color}}/>)}</div><div className="mt-2 grid grid-cols-3">{distribution.map((item,index)=><div key={item.key} className={index===1?"text-center":index===2?"text-right":""}><p className="text-xs font-medium" style={{color:item.color}}>{percent(item.value,total)}%</p><p className="text-[11px] font-semibold text-[#464555]">{item.label}</p></div>)}</div></section>
      <section><div className="mb-2 flex items-center justify-between"><h2 className="text-xs font-medium uppercase tracking-[0.05em]">Leads recentes</h2><Link href="/leads" className="text-xs font-medium text-[#3525cd]">Ver todos</Link></div><div className="overflow-hidden rounded-xl border border-[#c7c4d8] bg-white shadow-sm">{recent.length?recent.map((lead,index)=>{const style=priorityStyle[lead.salesPotential];return <Link key={lead.id} href={`/leads/${lead.id}`} className={`flex items-center justify-between gap-3 p-2 hover:bg-[#f8f9fa] ${index?"border-t border-[#c7c4d8]":""}`}><div className="flex min-w-0 items-center gap-2"><span className={`grid size-10 shrink-0 place-items-center rounded-lg text-2xl font-medium ${index===0?"bg-[#4f46e5] text-[#dad7ff]":"bg-[#e1e3e4] text-[#464555]"}`}>{lead.businessName.charAt(0).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{lead.businessName}</p><p className="truncate text-xs font-medium text-[#464555]">{lead.segment??lead.city??"Segmento não informado"}</p></div></div><div className="shrink-0 text-right"><p className="text-xs">Score <strong style={{color:style.color}}>{lead.opportunityScore}</strong></p><span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.badge}`}>{style.label}</span></div></Link>;}):<div className="p-8 text-center text-sm text-[#464555]">Nenhum lead cadastrado.</div>}</div></section>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t border-[#c7c4d8] bg-[#f8f9fa] shadow-[0_-2px_8px_rgba(0,0,0,.05)] lg:hidden" aria-label="Navegação do dashboard"><BottomLink href="/dashboard" label="Dashboard" active icon={LayoutDashboard}/><BottomLink href="/leads" label="Leads" icon={SlidersHorizontal}/><BottomLink href="/leads/import" label="Importar" icon={Upload}/><BottomLink href="/leads?analysis=completed" label="Análises" icon={Bot}/></nav>
  </div>;
}

function PriorityCard({label,value,color}:{label:string;value:number;color:string}){return <div className="rounded-xl border border-[#c7c4d8] bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-medium tracking-wide text-[#464555]"><span>{label}</span><i className="size-2 rounded-full" style={{backgroundColor:color}}/></div><p className="mt-3 text-2xl font-medium">{value}</p></div>}
function BottomLink({href,label,active=false,icon:Icon}:{href:string;label:string;active?:boolean;icon:typeof LayoutDashboard}){return <Link href={href} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active?"text-[#3525cd]":"text-[#404758]"}`}><Icon size={19}/><span>{label}</span></Link>}
