import assert from "node:assert/strict";
import test from "node:test";
import { LeadStatus, SalesPotential } from "@prisma/client";
import { detectColumn, suggestMapping } from "./detect-columns";
import { detectFileDuplicates } from "./detect-file-duplicates";
import {
  normalizeImportRow,
  parsePotential,
  parseRating,
  parseReviewCount,
  parseStatus,
} from "./normalize-import-row";
import { normalizeHeader } from "../utils/normalize-text";
import { normalizePhone } from "../utils/normalize-phone";
import { normalizeUrl } from "../utils/normalize-url";
import { normalizeInstagram } from "../utils/normalize-instagram";

test("normaliza cabeçalhos e detecta colunas", () => {
  assert.equal(normalizeHeader("  NOME_do-Negócio "), "nome do negocio");
  assert.equal(detectColumn("Avaliações"), "reviewCount");
  assert.deepEqual(suggestMapping(["Phone", "Telefone"]), {
    Phone: "phone",
    Telefone: "ignore",
  });
});
test("normaliza telefone, site e instagram", () => {
  assert.equal(normalizePhone("(11) 98888-1234").digits, "11988881234");
  assert.equal(
    normalizeUrl("clinica.example").value,
    "https://clinica.example",
  );
  assert.equal(
    normalizeInstagram("@clinica.feliz").value,
    "https://www.instagram.com/clinica.feliz",
  );
});
test("converte avaliações", () => {
  assert.equal(parseRating("4,8 estrelas"), 4.8);
  assert.equal(parseRating("5.2"), null);
  assert.equal(parseReviewCount("1.234 avaliações"), 1234);
  assert.equal(parseReviewCount("1,234 reviews"), 1234);
  assert.equal(parseReviewCount("12,5"), null);
});
test("mapeia potencial e status", () => {
  assert.equal(parsePotential("MÉDIA"), SalesPotential.MEDIUM);
  assert.equal(parsePotential("alta"), SalesPotential.HIGH);
  assert.equal(parseStatus("reunião"), LeadStatus.MEETING);
  assert.equal(parseStatus("FOLLOW_UP"), LeadStatus.FOLLOW_UP);
});
test("rejeita linha sem nome e detecta duplicado", () => {
  const mapping = {
    Nome: "businessName",
    Telefone: "phone",
    Cidade: "city",
  } as const;
  assert.equal(
    normalizeImportRow({ Nome: "", Telefone: "11999999999" }, mapping, 2).lead,
    null,
  );
  const a = normalizeImportRow(
    { Nome: "Clínica A", Telefone: "11999999999", Cidade: "São Paulo" },
    mapping,
    2,
  ).lead!;
  const b = normalizeImportRow(
    { Nome: "Clínica B", Telefone: "(11) 99999-9999", Cidade: "Santos" },
    mapping,
    3,
  ).lead!;
  assert.deepEqual([...detectFileDuplicates([a, b])], [3]);
});
