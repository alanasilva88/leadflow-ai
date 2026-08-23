import assert from "node:assert/strict";
import test from "node:test";
import { leadAIAnalysisSchema } from "./lead-analysis-schema";

const valid = {
  salesPotential: "HIGH",
  websiteScore: 7,
  mainOpportunity: "Contato pouco visível",
  evidence: [
    { description: "O site não exibe formulário.", source: "WEBSITE" },
  ],
  suggestedSolution: "Destacar uma forma clara de contato.",
  recommendedService: "LANDING_PAGE",
  approachMessage:
    "Olá! Notei uma oportunidade no contato do negócio. Posso compartilhar uma ideia?",
  followUpMessage:
    "Olá! Faz sentido eu compartilhar a ideia em uma mensagem curta?",
  confidence: "HIGH",
};

test("aceita uma análise estruturada válida", () =>
  assert.equal(leadAIAnalysisSchema.safeParse(valid).success, true));
test("limita nota do site entre 0 e 10", () => {
  assert.equal(
    leadAIAnalysisSchema.safeParse({ ...valid, websiteScore: -1 }).success,
    false,
  );
  assert.equal(
    leadAIAnalysisSchema.safeParse({ ...valid, websiteScore: 11 }).success,
    false,
  );
});
test("limita mensagens", () => {
  assert.equal(
    leadAIAnalysisSchema.safeParse({
      ...valid,
      approachMessage: "a".repeat(551),
    }).success,
    false,
  );
  assert.equal(
    leadAIAnalysisSchema.safeParse({
      ...valid,
      followUpMessage: "a".repeat(401),
    }).success,
    false,
  );
});
test("rejeita serviço e potencial fora dos enums", () => {
  assert.equal(
    leadAIAnalysisSchema.safeParse({ ...valid, recommendedService: "SEO" })
      .success,
    false,
  );
  assert.equal(
    leadAIAnalysisSchema.safeParse({ ...valid, salesPotential: "VERY_HIGH" })
      .success,
    false,
  );
});
test("rejeita resposta vazia ou inválida", () =>
  assert.equal(leadAIAnalysisSchema.safeParse({}).success, false));
