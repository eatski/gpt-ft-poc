// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { openai } from "@/lib/openapi";
import {shuffle} from "lodash-es"

const createPrompt = (ingredients: string[]) => {
  return `Only ${ingredients.join(", ")} in a cooking pot.`;
};

export const createFoodImage = async (ingredients: string[]): Promise<string> => {
  const shuffled = shuffle(ingredients);
  const res = await openai
    .createImage({
      size: "512x512",
      prompt: createPrompt(shuffled),
      response_format: "url",
    })
    .catch((e) => {
      console.error(e.data);
      throw new Error("OpenAI API Error");
    });
  if (!res.data.data[0].url) {
    throw new Error("OpenAI API Error");
  }
  return res.data.data[0].url;
};
