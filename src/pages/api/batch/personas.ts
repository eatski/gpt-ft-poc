// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPersonas } from "@/usecases/createFoodReportersPersona";
import { createPersonasTitle } from "@/usecases/createFoodReportersPersonaTitle";
import { Personas } from "@/models/schema";
import type { NextApiRequest, NextApiResponse } from "next";
import { doc, writeBatch } from "@firebase/firestore";
import { personasCollection } from "@/models/store";
import { store } from "@/lib/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Personas | string>) {
  if (process.env.NODE_ENV === "production") {
    res.status(404).send("Not Found");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  } else {
    const titles = await createPersonasTitle();
    // 配列を5つずつに分割する
    const inputs: string[][] = [];

    for (let i = 0; i < titles.length; i += 5) {
      inputs.push(titles.slice(i, i + 5));
    }
    const result = await Promise.allSettled(inputs.map((input) => createPersonas(input)));
    result.forEach((e) => {
      if (e.status === "rejected") {
        console.error(e.reason);
      }
    });
    const personas = result.flatMap((e) => (e.status === "fulfilled" ? e.value : []));
    const batch = writeBatch(store);
    personas.forEach((persona) => {
      batch.set(doc(personasCollection), persona);
    });
    await batch.commit();
    res.status(200).json(personas);
  }
}
