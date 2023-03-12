import { openai } from "@/lib/openapi";
import * as z from "zod";

const wordsSchema = z.array(z.string());

type Words = z.infer<typeof wordsSchema>;

const createPrompt = (words: Words) => {
  return `
# Order
Translate Input into English

# Input
${JSON.stringify(words)}

# Output Format
JSON Array of String

# Output
`;
};

export const translateToEn = async (words: Words): Promise<Words> => {
  const prompt = createPrompt(words);

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const text = res.data.choices[0].message?.content;
  if (!text) {
    throw new Error("OpenAI API Error");
  }
  return wordsSchema.parse(JSON.parse(text));
};
