import type { LeadStatus } from "@prisma/client";
import { statusLabels } from "@/lib/utils/lead-labels";

const colors: Record<LeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-700",
  ANALYZED: "bg-violet-50 text-violet-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  RESPONDED: "bg-cyan-50 text-cyan-700",
  FOLLOW_UP: "bg-orange-50 text-orange-700",
  MEETING: "bg-indigo-50 text-indigo-700",
  PROPOSAL: "bg-fuchsia-50 text-fuchsia-700",
  CLOSED: "bg-emerald-50 text-emerald-700",
  LOST: "bg-slate-100 text-slate-600",
};
export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
