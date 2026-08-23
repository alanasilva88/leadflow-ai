import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  // Prisma CLI operations use Neon's direct connection. The application keeps
  // using the pooled DATABASE_URL through lib/prisma.ts.
  datasource: { url: env("DATABASE_URL_UNPOOLED") },
});
