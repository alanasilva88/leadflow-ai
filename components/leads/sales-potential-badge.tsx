import type { SalesPotential } from "@prisma/client";
import { potentialLabels } from "@/lib/utils/lead-labels";

const colors: Record<SalesPotential, string> = {
  HIGH: "bg-emerald-50 text-emerald-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  LOW: "bg-slate-100 text-slate-600",
};
export function SalesPotentialBadge({
  potential,
}: {
  potential: SalesPotential;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[potential]}`}
    >
      {potentialLabels[potential]}
    </span>
  );
}
