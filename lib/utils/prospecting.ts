import type { LeadResponse, LeadStatus } from "@prisma/client";

export function normalizeWhatsAppPhone(value?: string | null) {
  let digits = value?.replace(/\D/g, "") ?? "";
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) return digits;
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  return digits.length === 12 || digits.length === 13 ? digits : null;
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const normalized = normalizeWhatsAppPhone(phone);
  return normalized ? `https://wa.me/${normalized}?text=${encodeURIComponent(message)}` : null;
}

export function normalizeInstagramProfile(value?: string | null) {
  if (!value) return null;
  let username = value.trim().replace(/^@/, "");
  if (/instagram\.com/i.test(username)) {
    try {
      username = new URL(/^https?:\/\//i.test(username) ? username : `https://${username}`)
        .pathname.split("/").filter(Boolean)[0] ?? "";
    } catch { return null; }
  }
  return /^[A-Za-z0-9._]{1,30}$/.test(username)
    ? `https://www.instagram.com/${username}` : null;
}

export function dateAfterDays(days: number, now = new Date()) {
  const date = new Date(now); date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function followUpState(value?: Date | string | null, now = new Date()) {
  if (!value) return "NONE" as const;
  const date = new Date(value); const today = new Date(now);
  date.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime() ? "TODAY" as const
    : date < today ? "OVERDUE" as const : "UPCOMING" as const;
}

export const responseStatusMap: Record<LeadResponse, LeadStatus> = {
  NO_RESPONSE: "CONTACTED", POSITIVE: "RESPONDED", NEGATIVE: "LOST",
  MORE_INFORMATION: "RESPONDED", CONTACT_LATER: "FOLLOW_UP",
  MEETING_SCHEDULED: "MEETING", PROPOSAL_SENT: "PROPOSAL", DEAL_CLOSED: "CLOSED",
};

const statusRank: Record<LeadStatus, number> = {
  NEW: 0, ANALYZED: 1, CONTACTED: 2, FOLLOW_UP: 3, RESPONDED: 4,
  MEETING: 5, PROPOSAL: 6, CLOSED: 7, LOST: 7,
};
export function contactStatusWithoutRegression(current: LeadStatus) {
  return statusRank[current] > statusRank.CONTACTED ? current : "CONTACTED";
}

export function responseRate(contacted: number, responses: number) {
  return contacted === 0 ? 0 : Math.round((responses / contacted) * 100);
}
