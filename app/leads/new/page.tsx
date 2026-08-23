import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LeadForm } from "@/components/leads/lead-form";
import { verifySession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Adicionar lead" };
export default async function NewLeadPage() {
  await verifySession();
  return (
    <div className="-mx-4 -mt-6 bg-[#f8f9fa] pb-20 sm:-mx-6 lg:-mx-8">
      <header className="border-b border-[#c7c4d8] bg-white shadow-[0_1px_1px_rgba(0,0,0,.02)]">
        <div className="mx-auto flex h-[72px] max-w-3xl items-center gap-4 px-6">
          <Link href="/leads" className="grid size-10 place-items-center rounded-full text-[#464555]" aria-label="Voltar para leads"><ArrowLeft size={18}/></Link>
          <div><h1 className="text-2xl font-medium leading-tight tracking-[-.02em] text-[#191c1d]">Adicionar lead</h1><p className="mt-0.5 text-xs font-medium text-[#464555]">Cadastre uma nova oportunidade para organizar sua prospecção.</p></div>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-6 py-8"><LeadForm /></div>
    </div>
  );
}
