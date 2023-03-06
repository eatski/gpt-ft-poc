// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { openai } from '@/lib/openapi'


const createPrompt = (ingredients: string[]) => {
    return `Only ${ingredients.join(", ")} in a cooking pot.`
}

export const createFoodImage = async (
    ingredients: string[]
): Promise<string> => {
  const res = await openai.createImage({
    size: "1024x1024",
    prompt: createPrompt(ingredients),
    response_format: "url"
  })
  if(!res.data.data[0].url){
    throw new Error("OpenAI API Error")
  }
  return res.data.data[0].url
}
