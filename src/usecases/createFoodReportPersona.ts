import { openai } from "@/lib/openapi";

import zodToJsonSchema from "zod-to-json-schema";
import { Personas, personasSchema } from "./schema";

const jsonSchema = zodToJsonSchema(personasSchema);

const createPrompt = () => {
    return `
# Order
You are planning a food reportage program.
Please output a persona of 3 people with various interests and tastes who will be food reporters.

# Output Format
JSON according to the following schema

${JSON.stringify(jsonSchema)}

# Language
日本語

# Output
`
}

export const createPersonas = async (): Promise<Personas> => {

    const prompt = createPrompt();
    
    return openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature:0.9,
        top_p: 1,
        max_tokens: 2048,
        frequency_penalty: 0.2,
        presence_penalty: 0.0,
    }).then(e => { 
        const text = e.data.choices[0].text
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
    