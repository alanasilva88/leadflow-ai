import { LeadResponse, LeadStatus, SalesPotential } from "@prisma/client";

export const potentialLabels: Record<SalesPotential, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};
export const statusLabels: Record<LeadStatus, string> = {
  NEW: "Novo",
  ANALYZED: "Analisado",
  CONTACTED: "Contatado",
  RESPONDED: "Respondeu",
  FOLLOW_UP: "Follow-up",
  MEETING: "Reunião",
  PROPOSAL: "Proposta",
  CLOSED: "Fechado",
  LOST: "Perdido",
};
export const responseLabels: Record<LeadResponse, string> = {
  NO_RESPONSE: "Não respondeu",
  POSITIVE: "Resposta positiva",
  NEGATIVE: "Resposta negativa",
  MORE_INFORMATION: "Pediu mais informações",
  CONTACT_LATER: "Entrar em contato depois",
  MEETING_SCHEDULED: "Reunião agendada",
  PROPOSAL_SENT: "Proposta enviada",
  DEAL_CLOSED: "Negócio fechado",
};
