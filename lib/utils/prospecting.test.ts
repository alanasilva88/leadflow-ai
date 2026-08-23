import assert from "node:assert/strict";
import test from "node:test";
import {
  buildWhatsAppUrl, contactStatusWithoutRegression, dateAfterDays, followUpState,
  normalizeInstagramProfile, normalizeWhatsAppPhone, responseRate, responseStatusMap,
} from "./prospecting";

test("normaliza telefones brasileiros com e sem código 55", () => {
  assert.equal(normalizeWhatsAppPhone("(81) 99999-9999"), "5581999999999");
  assert.equal(normalizeWhatsAppPhone("+55 81 99999-9999"), "5581999999999");
  assert.equal(normalizeWhatsAppPhone("81 3333-4444"), "558133334444");
});
test("rejeita telefone sem DDD ou claramente inválido", () => {
  assert.equal(normalizeWhatsAppPhone("99999-9999"), null);
  assert.equal(normalizeWhatsAppPhone("123"), null);
});
test("constrói URL segura e codifica a mensagem", () => {
  assert.equal(buildWhatsAppUrl("(81) 99999-9999", "Olá & tudo bem?"),
    "https://wa.me/5581999999999?text=Ol%C3%A1%20%26%20tudo%20bem%3F");
});
test("normaliza formatos do Instagram e rejeita inválidos", () => {
  assert.equal(normalizeInstagramProfile("@clinica.feliz"), "https://www.instagram.com/clinica.feliz");
  assert.equal(normalizeInstagramProfile("https://www.instagram.com/clinicafeliz/?hl=pt"), "https://www.instagram.com/clinicafeliz");
  assert.equal(normalizeInstagramProfile("perfil inválido!"), null);
});
test("calcula opções de data determinísticas", () => {
  assert.equal(dateAfterDays(2, new Date("2026-07-26T12:00:00")), "2026-07-28");
});
test("identifica follow-up hoje, atrasado e futuro", () => {
  const now = new Date("2026-07-26T15:00:00");
  assert.equal(followUpState("2026-07-26T12:00:00", now), "TODAY");
  assert.equal(followUpState("2026-07-25T12:00:00", now), "OVERDUE");
  assert.equal(followUpState("2026-07-27T12:00:00", now), "UPCOMING");
});
test("mapeia respostas para os status esperados", () => {
  assert.equal(responseStatusMap.POSITIVE, "RESPONDED");
  assert.equal(responseStatusMap.NEGATIVE, "LOST");
  assert.equal(responseStatusMap.MEETING_SCHEDULED, "MEETING");
  assert.equal(responseStatusMap.PROPOSAL_SENT, "PROPOSAL");
  assert.equal(responseStatusMap.DEAL_CLOSED, "CLOSED");
});
test("não regride status avançado ao registrar contato", () => {
  assert.equal(contactStatusWithoutRegression("NEW"), "CONTACTED");
  assert.equal(contactStatusWithoutRegression("PROPOSAL"), "PROPOSAL");
  assert.equal(contactStatusWithoutRegression("CLOSED"), "CLOSED");
});
test("calcula taxa de resposta e protege divisão por zero", () => {
  assert.equal(responseRate(0, 0), 0);
  assert.equal(responseRate(10, 4), 40);
});
