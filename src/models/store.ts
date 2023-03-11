import { collection } from "@firebase/firestore";
import { z } from "zod";
import { db } from "../firestore";
import { personaSchema } from "./schema";

const personasDocumentSchema = z.object({
    personas: z.array(personaSchema)
})

type PersonasDocument = z.infer<typeof personasDocumentSchema>;

export const personasCollection =  collection(db,"/personas").withConverter<PersonasDocument>({
    toFirestore: (data) => data,
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return personasDocumentSchema.parse(data);
    }
})