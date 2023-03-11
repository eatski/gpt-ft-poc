// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default function handler(_: never, res: NextApiResponse<string>) {
  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: "Q: やあやあ、こんにちは！ \nA:",
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    })
    .then((e) => {
      const text = e.data.choices[0].text;
      if (text) {
        res.status(200).send(text);
      } else {
        res.status(500).send("OpenAI API Error");
      }
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("OpenAI API Error");
    });
}
