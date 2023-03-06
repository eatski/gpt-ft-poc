import { openai } from "@/lib/openapi";
import * as z from "zod"
import zodToJsonSchema from "zod-to-json-schema";

const schema = z.array(z.object({
    name: z.string(),
    title: z.string(),
    age: z.number(),
    persona: z.string().min(15)
}))

export type Personas = z.infer<typeof schema>;

const jsonSchema = zodToJsonSchema(schema);

const createPrompt = () => {
    return `
# 命令書
あなたは食レポ番組を企画してます。
食レポをしてもらう10人の様々な趣味嗜好を持ったペルソナを出力してください。

# 出力フォーマット
以下のスキーマに沿ったJSON

${JSON.stringify(jsonSchema)}

# 言語
日本語

# 出力
`
}

export const createFoodReportPersona = async (): Promise<Personas> => {

    const prompt = createPrompt();
    
    return openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature:0.9,
        top_p: 1,
        max_tokens: 2048,
        frequency_penalty: 0.1,
        presence_penalty: 0.0,
    }).then(e => { 
        const text = e.data.choices[0].text
        if(text){
            try {
                return schema.parse(JSON.parse(text));
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
    