// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { openai } from "@/lib/openapi";
import type { NextApiResponse } from "next";

export default function handler(_: never, res: NextApiResponse<unknown>) {
  openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "I am a student.",
          name: "Taro",
        },
        {
          role: "user",
          content: "I am Taro's teacher.",
          name: "Yamada",
        },
        {
          role: "user",
          content: "Who's Taro's teacher?",
        },
      ],
    })
    .then((e) => {
      res.json(e.data);
    })
    .catch((e) => {
      res.json(e.response.data);
    });
}
