import { openai } from "@/lib/openapi";

import zodToJsonSchema from "zod-to-json-schema";
import { Personas, personasSchema, StringArray } from "./schema";

const jsonSchema = zodToJsonSchema(personasSchema);

const createPrompt = (titles: StringArray) => {
    return `
# Order
You are planning a food reportage program.
Output detailed personas based on the entered titles and their names for the number of people.

# Input
${JSON.stringify(titles)}

# Output Format
JSON according to the following schema

${JSON.stringify(jsonSchema)}

# Language
日本語

# Output
`
}

export const createPersonas = async (titles: StringArray): Promise<Personas> => {

    const prompt = createPrompt(titles);
    
    return openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature:0.9,
        top_p: 1,
        max_tokens: 4096 - prompt.length,
        frequency_penalty: 0.2,
        presence_penalty: 0.0,
    }).then(e => {
        const text = e.data.choices[0].message?.content
        if(text){
            try {
                return personasSchema.parse(JSON.parse(text));
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
    