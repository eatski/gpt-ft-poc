// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next'
import crypto from "node:crypto";

export default function handler(
  _: never,
  res: NextApiResponse<any>
) {
    res.status(200).json({ 
        key: crypto.randomBytes(32).toString("hex"),
        lv: crypto.randomBytes(16).toString("hex")
    })
}
