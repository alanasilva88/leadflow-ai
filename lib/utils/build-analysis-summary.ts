import type { AnalysisPreview } from "@/lib/openai/lead-analysis-schema";
import { analysisPotentialLabels, serviceLabels } from "./analysis-labels";

export function buildAnalysisSummary(
  businessName: string,
  analysis: AnalysisPreview,
) {
  return `Negócio: ${businessName}
Potencial sugerido: ${analysisPotentialLabels[analysis.salesPotential]}
Oportunidade: ${analysis.mainOpportunity}
Serviço recomendado: ${serviceLabels[analysis.recommendedService]}
Solução: ${analysis.suggestedSolution}`;
}
