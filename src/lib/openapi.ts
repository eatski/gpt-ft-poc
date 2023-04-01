import { Configuration, OpenAIApi } from "openai";
import { never } from "./util";

//https://github.com/openai/openai-node/issues/75
class CustomFormData extends FormData {
  getHeaders() {
      return {}
  }
}

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? never("NEXT_PUBLIC_OPENAI_API_KEY is not defined"),
  formDataCtor: CustomFormData
});
export const openai = new OpenAIApi(configuration);
