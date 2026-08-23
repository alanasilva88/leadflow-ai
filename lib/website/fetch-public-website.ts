import "server-only";
import { extractWebsiteSignals } from "./extract-website-signals";
import { validatePublicUrl } from "./validate-public-url";
import type { WebsiteFetchResult } from "./website-types";

const MAX_BYTES = 500_000;

export async function fetchPublicWebsite(
  value?: string | null,
): Promise<WebsiteFetchResult> {
  if (!value)
    return {
      signals: null,
      warnings: ["Lead sem site informado."],
      checkedAt: null,
    };
  let current = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const checkedAt = new Date().toISOString();
  try {
    for (let redirects = 0; redirects <= 3; redirects++) {
      const url = await validatePublicUrl(current);
      const response = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(6_000),
        headers: {
          Accept: "text/html",
          "User-Agent": "LeadFlowAI/1.0 public-page-check",
        },
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location || redirects === 3)
          throw new Error("O site excedeu o limite de redirecionamentos.");
        current = new URL(location, url).toString();
        continue;
      }
      if (!response.ok)
        throw new Error(`O site respondeu com status ${response.status}.`);
      if (
        !(response.headers.get("content-type") ?? "")
          .toLowerCase()
          .includes("text/html")
      )
        throw new Error("O endereço não retornou uma página HTML.");
      const declared = Number(response.headers.get("content-length") ?? 0);
      if (declared > MAX_BYTES)
        throw new Error("A página é grande demais para análise.");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("A página não retornou conteúdo.");
      const chunks: Uint8Array[] = [];
      let total = 0;
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        total += chunk.length;
        if (total > MAX_BYTES) {
          await reader.cancel();
          throw new Error("A página é grande demais para análise.");
        }
        chunks.push(chunk);
      }
      const html = new TextDecoder().decode(Buffer.concat(chunks));
      return {
        signals: extractWebsiteSignals(html, url.toString()),
        warnings: [],
        checkedAt,
      };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível ler o site.";
    return { signals: null, warnings: [message], checkedAt };
  }
  return {
    signals: null,
    warnings: ["Não foi possível ler o site."],
    checkedAt,
  };
}
