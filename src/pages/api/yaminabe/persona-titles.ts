// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPersonasTitle } from '@/usecases/createFoodReportersPersonaTitle';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[] | string>
) {
    if(req.method !== "GET" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const personas = await createPersonasTitle();
        res.status(200).json(personas)
    }
}
