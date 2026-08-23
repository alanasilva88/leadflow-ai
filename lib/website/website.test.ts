import assert from "node:assert/strict";
import test from "node:test";
import { extractWebsiteSignals } from "./extract-website-signals";
import { validatePublicUrl } from "./validate-public-url";

const publicResolver = async () => [{ address: "93.184.216.34", family: 4 }];
test("aceita URL HTTP/HTTPS pública", async () => {
  assert.equal(
    (await validatePublicUrl("https://example.com", publicResolver)).hostname,
    "example.com",
  );
});
test("bloqueia localhost, IP privado e metadata", async () => {
  await assert.rejects(validatePublicUrl("http://localhost"));
  await assert.rejects(validatePublicUrl("http://192.168.1.1"));
  await assert.rejects(validatePublicUrl("http://169.254.169.254"));
});
test("bloqueia protocolo, credenciais e porta suspeita", async () => {
  await assert.rejects(validatePublicUrl("ftp://example.com", publicResolver));
  await assert.rejects(
    validatePublicUrl("https://user:pass@example.com", publicResolver),
  );
  await assert.rejects(
    validatePublicUrl("https://example.com:8080", publicResolver),
  );
});
test("bloqueia host público que resolve para rede privada", async () => {
  await assert.rejects(
    validatePublicUrl("https://example.com", async () => [
      { address: "10.0.0.2", family: 4 },
    ]),
  );
});
test("reduz, sanitiza e limita os sinais do HTML", () => {
  const html = `<html lang="pt-BR"><head><title> Clínica &amp; Saúde </title><meta name="description" content="Atendimento humano"></head>
  <body><nav>${"<a>Menu</a>".repeat(50)}</nav><script>segredo()</script><h1>Consultas</h1><h1>Consultas</h1>
  <a href="https://wa.me/1">Agende agora</a><form></form><p>Rua Central, telefone (11) 99999-9999</p></body></html>`;
  const result = extractWebsiteSignals(html, "https://example.com");
  assert.equal(result.title, "Clínica & Saúde");
  assert.deepEqual(result.headings, ["Consultas"]);
  assert.equal(result.hasWhatsApp, true);
  assert.equal(result.hasForm, true);
  assert.equal(result.extractedText.includes("segredo"), false);
  assert.ok(result.extractedText.length <= 3000);
});
