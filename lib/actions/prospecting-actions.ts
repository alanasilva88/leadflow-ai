"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { contactStatusWithoutRegression, responseStatusMap } from "@/lib/utils/prospecting";
import { contactSchema, followUpSchema, messageSchema, responseSchema } from "@/lib/validations/prospecting-schema";
import { requireSession } from "@/lib/auth/session";

type Result = { success: boolean; message: string };
const paths = (id: string) => {
  revalidatePath("/dashboard"); revalidatePath("/leads"); revalidatePath(`/leads/${id}`);
};
const parsedDate = (value: string | null) => value ? new Date(`${value}T12:00:00`) : null;
async function lead(id: string) {
  return prisma.lead.findUnique({ where: { id }, select: { id: true, status: true, response: true, notes: true } });
}

export async function registerContactAction(input: unknown): Promise<Result> {
  await requireSession();
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revise os dados do contato." };
  const current = await lead(parsed.data.leadId);
  if (!current) return { success: false, message: "Lead não encontrado." };
  const channel = { WHATSAPP: "WhatsApp", INSTAGRAM: "Instagram", OTHER: "Outro" }[parsed.data.channel];
  const note = parsed.data.notes
    ? [current.notes, `[Contato via ${channel}] ${parsed.data.notes}`].filter(Boolean).join("\n").slice(0, 2000)
    : current.notes;
  await prisma.lead.update({ where: { id: current.id }, data: {
    status: contactStatusWithoutRegression(current.status), contactedAt: new Date(),
    response: current.response && current.response !== "NO_RESPONSE" ? current.response : "NO_RESPONSE",
    followUpDate: parsedDate(parsed.data.followUpDate), notes: note,
  } });
  paths(current.id); return { success: true, message: "Contato registrado." };
}

export async function setFollowUpAction(input: unknown): Promise<Result> {
  await requireSession();
  const parsed = followUpSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Data de follow-up inválida." };
  const current = await lead(parsed.data.leadId);
  if (!current) return { success: false, message: "Lead não encontrado." };
  await prisma.lead.update({ where: { id: current.id }, data: { followUpDate: parsedDate(parsed.data.followUpDate) } });
  paths(current.id); return { success: true, message: parsed.data.followUpDate ? "Follow-up atualizado." : "Follow-up removido." };
}

export async function registerFollowUpAction(input: unknown): Promise<Result> {
  await requireSession();
  const parsed = followUpSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Data de follow-up inválida." };
  const current = await lead(parsed.data.leadId);
  if (!current) return { success: false, message: "Lead não encontrado." };
  const protectedStatus = ["MEETING", "PROPOSAL", "CLOSED", "LOST"].includes(current.status);
  await prisma.lead.update({ where: { id: current.id }, data: {
    contactedAt: new Date(), status: protectedStatus ? current.status : "FOLLOW_UP",
    followUpDate: parsedDate(parsed.data.followUpDate),
  } });
  paths(current.id); return { success: true, message: "Follow-up realizado registrado." };
}

export async function registerResponseAction(input: unknown): Promise<Result> {
  await requireSession();
  const parsed = responseSchema.safeParse(input);
  if (!parsed.success || (parsed.data?.response === "CONTACT_LATER" && !parsed.data.followUpDate))
    return { success: false, message: "Revise a resposta e a data de follow-up." };
  const current = await lead(parsed.data.leadId);
  if (!current) return { success: false, message: "Lead não encontrado." };
  await prisma.lead.update({ where: { id: current.id }, data: {
    response: parsed.data.response,
    status: parsed.data.response === "NO_RESPONSE" && current.status === "FOLLOW_UP"
      ? "FOLLOW_UP" : responseStatusMap[parsed.data.response],
    followUpDate: parsedDate(parsed.data.followUpDate),
  } });
  paths(current.id); return { success: true, message: "Resposta registrada." };
}

export async function saveProspectingMessageAction(input: unknown): Promise<Result> {
  await requireSession();
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Mensagem inválida." };
  const current = await lead(parsed.data.leadId);
  if (!current) return { success: false, message: "Lead não encontrado." };
  await prisma.lead.update({ where: { id: current.id }, data: { personalizedMessage: parsed.data.message } });
  paths(current.id); return { success: true, message: "Mensagem salva no lead." };
}
