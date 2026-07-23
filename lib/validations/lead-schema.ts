import { LeadResponse, LeadStatus, SalesPotential } from "@prisma/client";
import { z } from "zod";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);
const optionalUrl = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .refine(
      (value) => !value || /^https?:\/\/|^[\w.-]+\.[a-z]{2,}/i.test(value),
      "Informe uma URL válida.",
    )
    .optional(),
);
const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    schema.optional(),
  );
const optionalDate = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().date("Informe uma data válida.").optional(),
);

export const leadSchema = z.object({
  businessName: z.string().trim().min(2, "Informe o nome do negócio.").max(120),
  phone: optionalText,
  instagram: optionalText,
  website: optionalUrl,
  rating: optionalNumber(
    z.number().min(0, "A nota mínima é 0.").max(5, "A nota máxima é 5."),
  ),
  reviewCount: optionalNumber(
    z
      .number()
      .int("Use um número inteiro.")
      .min(0, "O valor não pode ser negativo."),
  ),
  segment: optionalText,
  city: optionalText,
  salesPotential: z.enum(SalesPotential),
  websiteStatus: optionalText,
  websiteScore: optionalNumber(
    z
      .number()
      .int("Use um número inteiro.")
      .min(0, "A nota mínima é 0.")
      .max(10, "A nota máxima é 10."),
  ),
  mainProblem: optionalText,
  suggestedSolution: optionalText,
  personalizedMessage: optionalText,
  status: z.enum(LeadStatus),
  contactedAt: optionalDate,
  followUpDate: optionalDate,
  response: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(LeadResponse).optional(),
  ),
  notes: optionalText,
});

export type LeadFormInput = z.input<typeof leadSchema>;
export type LeadFormValues = z.output<typeof leadSchema>;
