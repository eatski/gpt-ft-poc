// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Persona, personasSchema } from '@/models/schema';
import { getPersonas } from '@/usecases/personaStore';
import { readFile } from 'fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Persona | string>
) {
    if(req.method !== "GET" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const personas = await getPersonas()
        const at = Math.floor(Math.random() * (personas.length - 1));
        console.log(at);
        const result = personas[at];
        res.status(200).json(result)
    }
}