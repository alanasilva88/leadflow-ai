import { normalizeText } from "./normalize-text";
export function normalizeInstagram(value: unknown) {
  let text = normalizeText(value);
  if (!text) return { value: null, warning: undefined };
  text = text.replace(/^@/, "");
  if (/instagram\.com/i.test(text)) {
    try {
      text =
        new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`).pathname
          .split("/")
          .filter(Boolean)[0] ?? "";
    } catch {
      text = "";
    }
  }
  if (!/^[A-Za-z0-9._]{1,30}$/.test(text))
    return {
      value: null,
      warning: "Instagram inválido; o campo foi ignorado.",
    };
  return { value: `https://www.instagram.com/${text}`, warning: undefined };
}
