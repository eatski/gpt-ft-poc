import { openai } from "@/lib/openapi";

import zodToJsonSchema from "zod-to-json-schema";
import { Persona } from "@/models/schema";
import { z } from "zod";

const puttingPotSchema = z.object({
    stuff: z.string(),
    comment: z.string()
})

export type PuttingPot = z.infer<typeof puttingPotSchema>;

const jsonSchema = zodToJsonSchema(puttingPotSchema);

const createPrompt = (ingredients: string[], personas: Persona) => {
  return `
# Background
You are attending a potluck party.

# Order
Output [one] specific [new item to add to the pot] and [comment].

# Your preferences
${personas.persona}

# What's in the pot.
${JSON.stringify(ingredients)}

# Output Format
Only JSON according to the following schema

${JSON.stringify(jsonSchema)}

# Language
日本語

# Output JSON
`;
};

export const putIntoPot = async (ingredients: string[], persona: Persona): Promise<PuttingPot> => {
  const prompt = createPrompt(ingredients, persona);
  console.log(prompt);

  return openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      top_p: 1,
      max_tokens: 4096 - prompt.length,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    })
    .then((e) => {
      const text = e.data.choices[0].message?.content;
      if (text) {
        try {
          return puttingPotSchema.parse(JSON.parse(text));
        } catch (e) {
          console.error(e);
          console.log("output", text);
          throw new Error("Parser Error");
        }
      } else {
        throw new Error("OpenAI API Error");
      }
    })
    .catch((e) => {
      console.error(e.data);
      throw new Error("OpenAI API Error");
    });
};
