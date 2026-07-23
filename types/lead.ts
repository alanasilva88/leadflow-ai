import type { Lead } from "@prisma/client";

export type LeadRecord = Lead;
export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
