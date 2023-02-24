// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default function handler(
  _: never,
  res: NextApiResponse<any>
) {
  openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Q: やあやあ、こんにちは！ \nA:",
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["\n"],
  }).then(e => {
    res.status(200).json({
      answer:e.data.choices[0].text
    })
  }).catch((e) => {
    console.error(e);
    res.status(500).json({
      error: "OpenAI API Error"
    })
  })
}
