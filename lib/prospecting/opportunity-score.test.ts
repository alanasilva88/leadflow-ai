import assert from "node:assert/strict";
import test from "node:test";
import { calculateOpportunityScore } from "./opportunity-score";

test("calcula score alto com todas as regras aplicáveis", () => {
  assert.deepEqual(calculateOpportunityScore({ website: null, phone: "8133334444", reviewsCount: 101, rating: 4.5, businessStatus: "OPERATIONAL" }), { eligible: true, score: 8, priority: "HIGH" });
});
test("classifica os limites de prioridade", () => {
  assert.equal(calculateOpportunityScore({ website: null }).priority, "LOW");
  assert.equal(calculateOpportunityScore({ website: null, phone: "1" }).priority, "MEDIUM");
});
test("negócio fechado permanentemente é inelegível", () => {
  assert.equal(calculateOpportunityScore({ businessStatus: "CLOSED_PERMANENTLY" }).eligible, false);
});
