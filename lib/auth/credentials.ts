import "server-only";
import { compare } from "bcryptjs";

export async function verifyAdminCredentials(input: { email: string; password: string }, config: { email: string; passwordHash: string }) {
  if (input.email.trim().toLowerCase() !== config.email.trim().toLowerCase()) return false;
  return compare(input.password, config.passwordHash);
}
