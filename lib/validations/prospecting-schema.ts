import { LeadResponse } from "@prisma/client";
import { z } from "zod";

const date = z.string().date().nullable();
export const contactSchema = z.object({
  leadId: z.string().cuid(), channel: z.enum(["WHATSAPP", "INSTAGRAM", "OTHER"]),
  followUpDate: date, notes: z.string().trim().max(500).optional(),
});
export const followUpSchema = z.object({ leadId: z.string().cuid(), followUpDate: date });
export const responseSchema = z.object({
  leadId: z.string().cuid(), response: z.enum(LeadResponse), followUpDate: date,
});
export const messageSchema = z.object({
  leadId: z.string().cuid(), message: z.string().trim().min(1).max(550),
});
