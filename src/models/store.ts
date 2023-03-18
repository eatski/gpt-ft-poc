import { appNameSpace } from "@/lib/firestore";
import { collection, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { z } from "zod";
export class ZodSchemaConverter<T> {
  constructor(private schema: z.ZodSchema<T>) {}

  toFirestore(data: T) {
    return this.schema.parse(data);
  }

  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return this.schema.parse(data);
  }
}

export const ROOM_SCHEMA = z.object({
  createdAt: z.date()
});

export const getRoomCollection = () => {
  return collection(appNameSpace, "rooms").withConverter(new ZodSchemaConverter(ROOM_SCHEMA));
}

export const CHAT_MESSAGE_SCHEMA = z.object({
  text: z.string(),
  createdAt: z.number(),
  author: z.union([z.literal("user"), z.literal("assistant")])
})

export const getChatMessageCollection = (roomId: string) => {
  return collection(appNameSpace,`rooms/${roomId}/messages`).withConverter(new ZodSchemaConverter(CHAT_MESSAGE_SCHEMA));
}

export const SCENARIO_SCHEMA = z.object({
  title: z.string(),
  initialPrompt: z.object({
    text: z.string(),
    hidden: z.boolean(),
  }),
  description: z.string(),
})

export const getScenarioCollection = () => {
  return collection(appNameSpace, "scenarios").withConverter(new ZodSchemaConverter(SCENARIO_SCHEMA));
}

