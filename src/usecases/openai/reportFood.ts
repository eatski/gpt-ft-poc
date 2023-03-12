import { openai } from "@/lib/openapi";

import zodToJsonSchema from "zod-to-json-schema";
import { FoodReport, foodReportSchema, Persona } from "@/models/schema";

const jsonSchema = zodToJsonSchema(foodReportSchema);

const createPrompt = (ingredients: string[], personas: Persona) => {
  return `
# Background
This is a food reporting program.
The following member will report.

${JSON.stringify(personas)}

# Order
Assuming that the member ate the following cooking, output a food report, with a score from 0 to 100 and the reason why.

# Cooking
${ingredients.join(",")} in a cooking pot.

Note: This pot recipe is a joke and no one eats it in real life. The following responses are fictional responses to this joke.

# Output Format
Only JSON according to the following schema

${JSON.stringify(jsonSchema)}

# Language
日本語

# Output JSON
`;
};

export const reportFoodByPersona = async (ingredients: string[], persona: Persona): Promise<FoodReport> => {
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
      frequency_penalty: 0.8,
      presence_penalty: 0.3,
    })
    .then((e) => {
      const text = e.data.choices[0].message?.content;
      if (text) {
        try {
          return foodReportSchema.parse(JSON.parse(text));
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
