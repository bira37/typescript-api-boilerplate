import { DBUser } from "./db";
import { PgPoolInstance } from "./utils/db";

export interface ErrorData {
  error: string;
}

interface APIContext {
  user: DBUser | null;
}

export type Context = APIContext & PgPoolInstance;
