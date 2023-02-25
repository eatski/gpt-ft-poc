import { openai } from "@/lib/openapi";

const createPrompt = () => {
    return `
# 概要
あなたは単語当てクイズの出題者です。
広辞苑からランダムな日本語の名詞を1単語で出力してください。

# 出力
`
}

export const createWord = async (): Promise<string> => {

    const prompt = createPrompt();
    
    return openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature:0.5,
        top_p: 1,
        max_tokens: 1000,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    }).then(e => { 
        const text = e.data.choices[0].text
        if(text){
            return text
        } else {
            throw new Error("OpenAI API Error")
        }
    })
}
    
