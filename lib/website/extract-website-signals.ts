import type { WebsiteSignals } from "./website-types";

const decode = (text: string) =>
  text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
const clean = (text: string, max = 160) =>
  decode(text.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
const unique = (items: string[], max: number) =>
  [...new Set(items.map((x) => clean(x)).filter((x) => x.length > 1))].slice(
    0,
    max,
  );
const matches = (html: string, regex: RegExp) => {
  const global = regex.global
    ? regex
    : new RegExp(regex.source, `${regex.flags}g`);
  return [...html.matchAll(global)].map((m) => m[1] ?? "");
};

export function extractWebsiteSignals(
  html: string,
  url: string,
): WebsiteSignals {
  const safe = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(nav|footer)[\s\S]*?<\/\1>/gi, " ");
  const title =
    clean(matches(safe, /<title[^>]*>([\s\S]*?)<\/title>/i)[0] ?? "") || null;
  const description =
    clean(
      matches(
        safe,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
      )[0] ??
        matches(
          safe,
          /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
        )[0] ??
        "",
      240,
    ) || null;
  const headings = unique(
    matches(safe, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi),
    12,
  );
  const buttons = matches(safe, /<button[^>]*>([\s\S]*?)<\/button>/gi);
  const links = matches(safe, /<a[^>]*>([\s\S]*?)<\/a>/gi);
  const text = clean(safe, 3000);
  const lower = `${safe} ${text}`.toLowerCase();
  const ctaTerms =
    /contato|fale conosco|agendar|saiba mais|solicite|orçamento|começar|conheça/i;
  const callToActions = unique(
    [...buttons, ...links].filter((x) => ctaTerms.test(clean(x))),
    10,
  );
  const serviceCandidates = headings.filter((x) =>
    /serviço|tratamento|solução|especialidade|produto/i.test(x),
  );
  return {
    url,
    title,
    description,
    language:
      matches(safe, /<html[^>]+lang=["']([^"']+)["']/i)[0]?.slice(0, 12) ??
      null,
    headings,
    callToActions,
    mentionedServices: unique(serviceCandidates, 8),
    hasWhatsApp: /wa\.me|whatsapp/.test(lower),
    hasInstagram: /instagram\.com|instagram/.test(lower),
    hasForm: /<form[\s>]/i.test(safe),
    hasSchedulingTerms: /agendar|marcar (consulta|horário)|reservar/.test(
      lower,
    ),
    hasChatbotSignals:
      /chatbot|assistente virtual|chat online|atendimento automático/.test(
        lower,
      ),
    hasPhone: /tel:|\(?\d{2}\)?\s?\d{4,5}[-.\s]?\d{4}/.test(lower),
    hasAddress: /endereço|rua |avenida |av\. |localização/.test(lower),
    usesHttps: new URL(url).protocol === "https:",
    extractedText: text,
    warnings: [],
  };
}
