"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { leadSchema, type LeadFormInput } from "@/lib/validations/lead-schema";
import type { ActionState } from "@/types/lead";
import { requireSession } from "@/lib/auth/session";

function prismaMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return "Lead não encontrado.";
  }
  return "Não foi possível salvar os dados. Tente novamente.";
}

function parseData(input: LeadFormInput) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: { success: false, message: "Revise os campos destacados.", errors: parsed.error.flatten().fieldErrors } satisfies ActionState };
  }
  const { contactedAt, followUpDate, ...rest } = parsed.data;
  return { ok: true as const,
    data: {
      ...rest,
      contactedAt: contactedAt ? new Date(`${contactedAt}T12:00:00`) : null,
      followUpDate: followUpDate ? new Date(`${followUpDate}T12:00:00`) : null,
      response: rest.response ?? null,
    },
  };
}

export async function createLead(input: LeadFormInput): Promise<ActionState> {
  await requireSession();
  const result = parseData(input);
  if (!result.ok) return result.error;
  let id: string;
  try {
    const lead = await prisma.lead.create({ data: result.data });
    id = lead.id;
    revalidatePath("/dashboard");
    revalidatePath("/leads");
  } catch (error) {
    return { success: false, message: prismaMessage(error) };
  }
  redirect(`/leads/${id}?success=created`);
}

export async function updateLead(id: string, input: LeadFormInput): Promise<ActionState> {
  await requireSession();
  const result = parseData(input);
  if (!result.ok) return result.error;
  try {
    await prisma.lead.update({ where: { id }, data: result.data });
    revalidatePath("/dashboard");
    revalidatePath("/leads");
    revalidatePath(`/leads/${id}`);
  } catch (error) {
    return { success: false, message: prismaMessage(error) };
  }
  redirect(`/leads/${id}?success=updated`);
}

export async function deleteLead(id: string): Promise<ActionState> {
  await requireSession();
  try {
    await prisma.lead.delete({ where: { id } });
    revalidatePath("/dashboard");
    revalidatePath("/leads");
  } catch (error) {
    return { success: false, message: prismaMessage(error) };
  }
  redirect("/leads?success=deleted");
}
