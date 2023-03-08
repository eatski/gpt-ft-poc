// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPersonas } from '@/usecases/createFoodReportersPersona';
import { createPersonasTitle } from '@/usecases/createFoodReportersPersonaTitle';
import { Personas, stringArraySchema } from '@/usecases/schema';
import { readFile } from 'fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Personas | string>
) {
    if(req.method !== "GET" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const count = 3;
        const titles = stringArraySchema.parse(JSON.parse(await readFile("data/personaTItle.json", "utf-8")));
        const start = Math.random() * (titles.length - count);
        const filteredTitles = titles.slice(start, start + count);
        const personas = await createPersonas(filteredTitles);
        res.status(200).json(personas)
    }
}