// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createFoodReportPersona } from '@/usecases/createFoodReportPersona';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if(req.method !== "GET" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const personas = await createFoodReportPersona();
        res.status(200).json({
            personas
        })
    }
}
