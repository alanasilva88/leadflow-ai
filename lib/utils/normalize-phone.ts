import { normalizeText } from "./normalize-text";
export function normalizePhone(value: unknown) {
  const display = normalizeText(value);
  if (!display) return { value: null, digits: null, warning: undefined };
  const digits = display.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15)
    return {
      value: null,
      digits: null,
      warning: "Telefone inválido; o campo foi ignorado.",
    };
  return { value: display, digits, warning: undefined };
}
