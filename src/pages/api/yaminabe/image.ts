// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createFoodImage } from "@/usecases/openai/createFoodImage";
import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

const requestBodySchema = z.object({
  ingredients: z.array(z.string()),
});

export type RequestBody = z.infer<typeof requestBodySchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  } else {
    const body = requestBodySchema.parse(JSON.parse(req.body));
    const image = await createFoodImage(body.ingredients);
    res.status(200).send(image);
  }
}
