export type ScoreInput = { website?: string | null; phone?: string | null; reviewsCount?: number | null; rating?: number | null; businessStatus?: string | null };
export function calculateOpportunityScore(input: ScoreInput) {
  if (input.businessStatus === "CLOSED_PERMANENTLY") return { eligible: false, score: 0, priority: "LOW" as const };
  let score = 0;
  if (!input.website) score += 3;
  if (input.phone) score += 1;
  if ((input.reviewsCount ?? 0) > 30) score += 1;
  if ((input.reviewsCount ?? 0) > 100) score += 1;
  if ((input.rating ?? 0) >= 4) score += 1;
  if (input.businessStatus === "OPERATIONAL") score += 1;
  return { eligible: true, score, priority: score >= 7 ? "HIGH" as const : score >= 4 ? "MEDIUM" as const : "LOW" as const };
}
