import { Configuration, OpenAIApi } from "openai";
import { never } from "./util";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? never("NEXT_PUBLIC_OPENAI_API_KEY is not defined"),
});
export const openai = new OpenAIApi(configuration);
