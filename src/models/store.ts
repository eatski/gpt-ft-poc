import { collection, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { z } from "zod";
import { db } from "../lib/firestore";
import { personaSchema } from "./schema";

export type PersonasDocument = z.infer<typeof personaSchema>;

class ZodSchemaConverter<T> {
  constructor(private schema: z.ZodSchema<T>) {}

  toFirestore(data: T) {
    return data;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return this.schema.parse(data);
  }
}

export const personasCollection = collection(db, "/personas").withConverter<PersonasDocument>(
  new ZodSchemaConverter(personaSchema),
);

const playerDocumentSchema = z.object({
  personaId: z.union([z.string(), z.undefined()]),
  name: z.union([z.string(), z.undefined()]),
});

export type PlayerDocument = z.infer<typeof playerDocumentSchema>;

export const playerCollection = (roomId: string) =>
  collection(db, `/rooms/${roomId}/players`).withConverter<PlayerDocument>(
    new ZodSchemaConverter(playerDocumentSchema),
  );

export const roomDocumentSchema = z.object({
  phase: z.union([z.literal("prepare"), z.literal("game")]),
});

export type RoomDocument = z.infer<typeof roomDocumentSchema>;

export const roomCollection = collection(db, `/rooms/`).withConverter<RoomDocument>(
  new ZodSchemaConverter(roomDocumentSchema),
);

export const potDocumentSchema = z.object({
  status: z.literal("ok"),
});

export type PotDocument = z.infer<typeof potDocumentSchema>;

export const potsCollection = (roomId: string) =>
  collection(db, `/rooms/${roomId}/pots`).withConverter<PotDocument>(new ZodSchemaConverter(potDocumentSchema));

export const potsActionsDocumentSchema = z.object({
  action: z.literal("init"),
});

export type PotsActionsDocument = z.infer<typeof potsActionsDocumentSchema>;

export const potsActionsCollection = (roomId: string, potId: string) =>
  collection(db, `/rooms/${roomId}/pots/${potId}/actions`).withConverter<PotsActionsDocument>(
    new ZodSchemaConverter(potsActionsDocumentSchema),
  );
