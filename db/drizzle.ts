import { env } from "@/env";
import * as schema from "./schema";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Declaração global para armazenar a instância do banco de dados
declare global {
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

// Variáveis para armazenar a conexão e a instância do banco de dados
let db: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

// Inicializa a instância do banco de dados com base no ambiente
if (env.NODE_ENV === "production") {
  pg = postgres(env.DATABASE_URL);
  db = drizzle(pg, { schema });
} else {
  if (!global.db) {
    pg = postgres(env.DATABASE_URL);
    global.db = drizzle(pg, { schema });
  }
  db = global.db;
}

// Exporta a instância do banco de dados e a conexão
export { db, pg };
