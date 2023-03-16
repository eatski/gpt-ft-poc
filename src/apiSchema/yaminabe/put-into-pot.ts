import { personaSchema } from "@/models/schema";
import { z } from "zod";

export const requestBodySchema = z.object({
    ingredients: z.array(z.string()),
    persona: personaSchema,
});
  
export type RequestBody = z.infer<typeof requestBodySchema>;

export const responseBodySchema =  z.object({
    stuff: z.string(),
    comment: z.string(),
})

export type ResponseBody = z.infer<typeof responseBodySchema>;