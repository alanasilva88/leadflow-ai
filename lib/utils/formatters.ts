export const emptyValue = (value: unknown) =>
  value === null || value === undefined || value === ""
    ? "Não informado"
    : String(value);

export const formatDate = (value?: Date | string | null) => {
  if (!value) return "Não informado";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Não informado"
    : new Intl.DateTimeFormat("pt-BR").format(date);
};

export const formatRating = (value?: number | null) =>
  value == null ? "Não informado" : `${value.toFixed(1)} / 5`;

export const formatReviewCount = (value?: number | null) =>
  value == null
    ? "Não informado"
    : new Intl.NumberFormat("pt-BR").format(value);

export const normalizeUrl = (value?: string | null) => {
  if (!value) return null;
  return /^https?:\/\//i.test(value)
    ? value
    : `https://${value.replace(/^@/, "instagram.com/")}`;
};
