import type { Metadata } from "next";
import { LeadForm } from "@/components/leads/lead-form";

export const metadata: Metadata = { title: "Adicionar lead" };
export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <LeadForm />
    </div>
  );
}
