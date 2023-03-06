// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { reportFoodByPersonas } from '@/usecases/reportFood';
import { FoodReport, personasSchema } from '@/usecases/schema';
import type { NextApiRequest, NextApiResponse } from 'next'
import z from "zod"

const requestBodySchema = z.object({
    ingredients: z.array(z.string()),
    personas: personasSchema
})

export type RequestBody = z.infer<typeof requestBodySchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FoodReport | string>
) {
    if(req.method !== "POST" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const body = requestBodySchema.parse(JSON.parse(req.body));
        const report = await reportFoodByPersonas(body.ingredients,body.personas);
        res.status(200).json(report)
    }
}
