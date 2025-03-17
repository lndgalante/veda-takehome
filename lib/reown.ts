import { z } from "zod";

// helpers
export function getReownProjectId(): string {
  return z.string().parse(process.env.NEXT_PUBLIC_REOWN_PROJECT_ID);
}
