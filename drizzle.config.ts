import { readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't load .env.local on its own.
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^([\w.]+)\s*=\s*(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
} catch {
  // no .env.local yet
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
