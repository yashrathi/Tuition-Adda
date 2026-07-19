import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Fallback keeps `next build` working before env is configured —
// postgres.js only connects on first query.
const connectionString =
  process.env.DATABASE_URL ?? "postgresql://localhost:5432/tuition_adda";

// Supabase pooler (transaction mode) doesn't support prepared statements.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
