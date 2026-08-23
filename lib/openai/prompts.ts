import type { Lead } from "@prisma/client";
import type { WebsiteSignals } from "@/lib/website/website-types";

const limit = (value: string | null | undefined, max: number) =>
  value?.trim().slice(0, max) || null;

export const LEAD_ANALYSIS_SYSTEM_PROMPT = `Você é um analista comercial cuidadoso para uma empresa que oferece landing pages, sites institucionais, chatbots, sistemas de agendamento, sistemas personalizados e revisão de presença digital.
Responda em português brasileiro e use somente os dados fornecidos. Não invente testes, contatos, lentidão, perdas, falhas, funcionalidades ou promessas de resultado. Quando não for possível confirmar algo, diga isso e reduza a confiança. Dados insuficientes exigem confiança LOW e evidência INSUFFICIENT_DATA.
Classifique o potencial como HIGH quando houver oportunidade concreta e forte, MEDIUM para melhoria clara mas presença razoável, e LOW quando não houver oportunidade clara. CUSTOM_SYSTEM exige evidência operacional específica; dados insuficientes devem preferir DIGITAL_PRESENCE_REVIEW.
A mensagem inicial deve ser humana, respeitosa, focar uma oportunidade, terminar em pergunta e ter até 550 caracteres. O follow-up deve ser mais curto, sem pressão, não presumir leitura e ter até 400 caracteres. Produza apenas o formato estruturado solicitado.`;

export function buildLeadAnalysisInput(
  lead: Lead,
  website: WebsiteSignals | null,
) {
  return {
    lead: {
      businessName: limit(lead.businessName, 120),
      segment: limit(lead.segment, 100),
      city: limit(lead.city, 100),
      phone: limit(lead.phone, 40),
      website: limit(lead.website, 300),
      instagram: limit(lead.instagram, 120),
      rating: lead.rating,
      reviewCount: lead.reviewCount,
      currentSalesPotential: lead.salesPotential,
      currentStatus: lead.status,
      websiteStatus: limit(lead.websiteStatus, 160),
      manualWebsiteScore: lead.websiteScore,
      mainProblem: limit(lead.mainProblem, 400),
      suggestedSolution: limit(lead.suggestedSolution, 500),
      notes: limit(lead.notes, 700),
    },
    website: website
      ? {
          ...website,
          extractedText: limit(website.extractedText, 2500),
          headings: website.headings.slice(0, 12),
          callToActions: website.callToActions.slice(0, 10),
          mentionedServices: website.mentionedServices.slice(0, 8),
        }
      : null,
  };
}
