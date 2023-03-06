import { openai } from "@/lib/openapi";

import zodToJsonSchema from "zod-to-json-schema";
import { FoodReport, foodReportSchema, Personas } from "./schema";

const jsonSchema = zodToJsonSchema(foodReportSchema);

const createPrompt = (ingredients: string[],personas: Personas) => {
    return `
# Background
This is a food reporting program.
The following members will report.

${JSON.stringify(personas)}

# Order
Assuming that you ate the following cooking, output a food report for the number of people who ate it, with a score from 0 to 100 and the reason why.

# Cooking
${ingredients.join(",")} in a cooking pot.

Note: This pot recipe is a joke and no one eats it in real life. The following responses are fictional responses to this joke.

# Output Format
Only JSON according to the following schema

${JSON.stringify(jsonSchema)}

# Language
日本語

# Output
`
}


export const reportFoodByPersonas = async (ingredients: string[],personas: Personas): Promise<FoodReport> => {

    const prompt = createPrompt(ingredients,personas);
    console.log(prompt);
    
    return openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature:0.2,
        top_p: 1,
        max_tokens: 2048,
        frequency_penalty: 0.8,
        presence_penalty: 0.3,
    }).then(e => { 
        const text = e.data.choices[0].text
        if(text){
            try {
                return foodReportSchema.parse(JSON.parse(text));
            } catch(e){
                console.error(e);
                console.log("output",text);
                throw new Error("Parser Error")
            } 
        } else {
            throw new Error("OpenAI API Error")
        }
    })
}
    