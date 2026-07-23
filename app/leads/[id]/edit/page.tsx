import { notFound } from "next/navigation";
import { LeadForm } from "@/components/leads/lead-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();
  return (
    <div className="mx-auto max-w-4xl">
      <LeadForm lead={lead} />
    </div>
  );
}
