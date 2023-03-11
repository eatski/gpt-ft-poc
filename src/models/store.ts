import { collection } from "@firebase/firestore";
import { z } from "zod";
import { db } from "../firestore";
import { personaSchema } from "./schema";

export type PersonasDocument = z.infer<typeof personaSchema>;

export const personasCollection =  collection(db,"/personas").withConverter<PersonasDocument>({
    toFirestore: (data) => data,
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return personaSchema.parse(data);
    }
})

const playerDocumentSchema = z.object({
    personaId: z.union([z.string(),z.undefined()]),
    name: z.union([z.string(),z.undefined()]),
})

export type PlayerDocument = z.infer<typeof playerDocumentSchema>;

export const playerCollection =  (roomId: string) => collection(db,`/rooms/${roomId}/players`).withConverter<PlayerDocument>({
    toFirestore: (data) => data,
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return playerDocumentSchema.parse(data);
    }
})