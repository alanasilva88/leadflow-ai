import { normalizeText } from "./normalize-text";
export function normalizeUrl(value: unknown) {
  const text = normalizeText(value)?.replace(/\s/g, "");
  if (!text) return { value: null, warning: undefined };
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    url.hash = "";
    url.search = "";
    return { value: url.toString().replace(/\/$/, ""), warning: undefined };
  } catch {
    return { value: null, warning: "Site inválido; o campo foi ignorado." };
  }
}
