import { openai } from "@/lib/openapi";

export type Input = {
    question: string,
    word: string,
}

const createPrompt = (input: Input) => {
    return `
# 概要
単語と質問を見て選択肢の中から出力を決めてください

# 単語
${input.word}}

# 質問
${input.question}

# 選択肢
- はい: 「単語」に対する「質問」は真である
- 部分的にはい: 「単語」に対する「質問」は部分的に真である
- いいえ: 「単語」に対する「質問」は偽である
- わからない: 「単語」に対する「質問」は答えられない。

# 出力
選択肢から1つ選び、それのみを回答する。
`
}

export const askQuestion = async (input: Input): Promise<string> => {

    const prompt = createPrompt(input);
    
    return openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
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
    

