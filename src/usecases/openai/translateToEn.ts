import { openai } from "@/lib/openapi";
import * as z from "zod";
import zodToJsonSchema from "zod-to-json-schema";

type Words = string[];

const zodSchema = z.array(
  z.object({
    original: z.string(),
    translated: z.string(),
  }),
);

type Translation = z.infer<typeof zodSchema>;

const jsonSchema = zodToJsonSchema(zodSchema);

const createPrompt = (words: Words) => {
  return `
# Order
Translate Input into English

# Input
${JSON.stringify(words)}

# Output Format
Only JSON according to the following schema

${JSON.stringify(jsonSchema)}

# Output JSON
`;
};

export const translateToEn = async (words: Words): Promise<Translation> => {
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
  try {
    return zodSchema.parse(JSON.parse(text));
  } catch (e) {
    console.log("output", text);
    console.error(e);
    throw new Error("Parser Error");
  }
};
