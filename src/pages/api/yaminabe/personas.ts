// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPersonas } from '@/usecases/createFoodReportersPersona';
import { createPersonasTitle } from '@/usecases/createFoodReportersPersonaTitle';
import { Personas, personasSchema, stringArraySchema } from '@/usecases/schema';
import { readFile } from 'fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Personas | string>
) {
    if(req.method !== "GET" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const personas = personasSchema.parse(JSON.parse(await readFile("data/persona.json", "utf-8")));
        const COUNT = 3;
        const start = Math.random() * (personas.length - COUNT);
        const result = personas.slice(start, start + COUNT);
        res.status(200).json(result)
    }
}