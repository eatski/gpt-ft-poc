// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { translateToEn } from "@/usecases/openai/translateToEn";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const requestBodySchema = z.object({
  words: z.array(z.string()),
});

export type RequestBody = z.infer<typeof requestBodySchema>;

export const responseBodySchema = z.array(
  z.object({
    original: z.string(),
    translated: z.string(),
  }),
);

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
