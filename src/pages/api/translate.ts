// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requestBodySchema, responseBodySchema } from "@/apiSchema/translate";
import { translateToEn } from "@/usecases/openai/translateToEn";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<z.infer<typeof responseBodySchema> | string>,
) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  const body = requestBodySchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).send("Bad Request");
    return;
  }
  const result = await translateToEn(body.data.words);
  res.status(200).json(result);
}
