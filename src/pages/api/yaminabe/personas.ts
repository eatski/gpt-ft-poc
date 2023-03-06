// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPersonas } from '@/usecases/createFoodReportPersona';
import { Personas } from '@/usecases/schema';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Personas | string>
) {
    if(req.method !== "GET" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const personas = await createPersonas();
        res.status(200).json(personas)
    }
}
