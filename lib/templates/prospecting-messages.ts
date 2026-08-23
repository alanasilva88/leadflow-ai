export function buildInitialProspectingMessage(lead: {
  businessName: string;
  segment?: string | null;
  city?: string | null;
}) {
  const context = lead.segment
    ? ` empresas de ${lead.segment}${lead.city ? ` em ${lead.city}` : " na região"}`
    : lead.city
      ? ` empresas em ${lead.city}`
      : " pequenos negócios";
  return `Olá, tudo bem? Conheci a ${lead.businessName} enquanto pesquisava${context}. Trabalho com sites, sistemas e automações para pequenos negócios e percebi que pode ajudar novos clientes a encontrarem vocês com mais facilidade e também simplificar o agendamento. Posso compartilhar uma ideia rápida?`;
}

export function buildFollowUpMessage() {
  return "Olá! Passando apenas para confirmar se conseguiu ver minha mensagem anterior. Posso enviar um exemplo rápido da ideia que mencionei?";
}
