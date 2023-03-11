import crypto from "node:crypto";
import { never } from "./util";

const key = Buffer.from(process.env.CRYPTO_KEY || never("CRYPTO_KEY is not defined"), "hex");
const iv = Buffer.from(process.env.CRYPTO_IV || never("CRYPTO_IV is not defined"), "hex");

export const encode = (original: string): string => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(original);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

export const decrypt = (encoded: string) => {
  const encryptedText = Buffer.from(encoded, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
