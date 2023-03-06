import * as z from "zod"

export const personasSchema = z.array(z.object({
    personaId: z.string(),
    name: z.string(),
    title: z.string(),
    age: z.number(),
    persona: z.string().min(10)
}))

export type Personas = z.infer<typeof personasSchema>;

export const foodReportSchema = z.array(z.object({
    personaId: z.string(),
    personaName: z.string(),
    personaTitle: z.string(),
    score: z.number().min(0).max(100),
    reason: z.string().min(15)
}))

export type FoodReport = z.infer<typeof foodReportSchema>;