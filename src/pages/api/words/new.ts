// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { encode } from '@/lib/crypto';
import { createWord } from '@/usecases/createWord';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if(req.method !== "POST" ){
        res.status(405).send("Method Not Allowed");
    } else {
        const word = await createWord();
        const encoded = encode(word);
        res.status(200).json({
            word: encoded
        })
    }
}
