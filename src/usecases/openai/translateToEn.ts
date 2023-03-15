import {Translator} from "deepl-node"

if(!process.env.DEEPL_API_KEY){
  throw new Error("DEEPL_API_KEY is not set")
}
const translator = new Translator(process.env.DEEPL_API_KEY)

type Words = string[];

type Translation = {
  original: string;
  translated: string;
}[];

export const translateToEn = async (words: Words): Promise<Translation> => {
  const res = await translator.translateText(words, "ja", "en-US");
  return res.map((e,i) => ({
    original: words[i],
    translated: e.text
  }))
};
