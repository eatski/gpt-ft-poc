import * as z from "zod"

export const personaSchema = z.object({
    name: z.string(),
    title: z.string(),
    persona: z.string().min(10)
})

export type Persona = z.infer<typeof personaSchema>;

export const personasSchema = z.array(personaSchema)

export const personaWithIdSchema = z.object({
    personaId: z.string(),
}).merge(personaSchema)

export type Personas = z.infer<typeof personasSchema>;

export const foodReportSchema = z.array(z.object({
    personaId: z.string(),
    personaTitle: z.string(),
    score: z.number().min(0).max(100),
    reason: z.string().min(15)
}))

export type FoodReport = z.infer<typeof foodReportSchema>;

export const stringArraySchema = z.array(z.string());

export type StringArray = z.infer<typeof stringArraySchema>;

