// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createFoodImage } from '@/usecases/createFoodImage';
import { translateToEn } from '@/usecases/translateToEn';
import type { NextApiRequest, NextApiResponse } from 'next'
import z from "zod"

const requestBodySchema = z.object({
    ingredients: z.array(z.string()),
})

export type RequestBody = z.infer<typeof requestBodySchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
    if(req.method !== "POST" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const body = requestBodySchema.parse(JSON.parse(req.body));
        const ingredientsEn = await translateToEn(body.ingredients);
        const image = await createFoodImage(ingredientsEn);
        res.status(200).send(image);
    }
}