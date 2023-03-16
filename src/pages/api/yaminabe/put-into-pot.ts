// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { putIntoPot } from "@/usecases/openai/putIntoPot";
import { requestBodySchema, ResponseBody } from "@/apiSchema/yaminabe/put-into-pot";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseBody | string>) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  } else {
    const body = requestBodySchema.parse(req.body);
    const result = await putIntoPot(body.ingredients, body.persona);
    res.status(200).json(result);
  }
}
