import { askQuestion } from '@/usecases/question';
import type { NextApiHandler } from 'next'

import * as z from "zod"

const Query = z.object({
    word: z.string(),
    question: z.string()
})

const handler : NextApiHandler = async (req, res) => {
    const query = Query.parse(req.query);
    return askQuestion(query).then(answer => {
        res.status(200).json({answer})
    }).catch((e) => {
        console.error(e);
        res.status(500).json({error: "OpenAI API Error"})
    })
}

export default handler

