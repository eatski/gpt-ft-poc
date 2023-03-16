import { z } from "zod";

export const requestBodySchema = z.object({
  words: z.array(z.string()),
});

export type RequestBody = z.infer<typeof requestBodySchema>;

export const responseBodySchema = z.array(
  z.object({
    original: z.string(),
    translated: z.string(),
  }),
);
