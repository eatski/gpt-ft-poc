import { openai } from "@/lib/openapi";

import zodToJsonSchema from "zod-to-json-schema";
import z from "zod";

const zodSchema = z.array(z.string());
const jsonSchema = zodToJsonSchema(zodSchema);
type Personas = z.infer<typeof zodSchema>;

const createPrompt = () => {
    return `
# Order
You are planning a food reportage program.
Please output a persona of 30 people with various interests and tastes who will be food reporters.

# Constraints
15 characters or less per persona.


# Output Format
JSON according to the following schema

${JSON.stringify(jsonSchema)}

# Language
日本語

# Output
`
}

export const createPersonasTitle = async (): Promise<Personas> => {

    const prompt = createPrompt();
    
    return openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "assistant",
                content: prompt
            }
        ],
        temperature:0.9,
        top_p: 1,
        n: 10,
        max_tokens: 4096 - prompt.length,
        frequency_penalty: 0.2,
        presence_penalty: 0.0,
    }).then(e => {
        try {
            return  e.data.choices.flatMap(e => e.message?.content ? zodSchema.parse(JSON.parse((e.message.content))) : []);
        } catch(e){
            console.error(e);
            throw new Error("Parser Error")
        } 
    })
}
    