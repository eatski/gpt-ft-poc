import { doc, getDoc, setDoc } from "@firebase/firestore";
import { personasCollection } from "@/models/store";
import { Persona } from "@/models/schema";

const personasDoc = doc(personasCollection, "personas")
export const savePersonas = async (personas: Persona[]) => {
    await setDoc(personasDoc, {
        personas
    })
}

export const getPersonas = async (): Promise<Persona[]> => {
    const docData = await getDoc(personasDoc);
    const data = docData.data();
    if (data) {
        return data.personas;
    }
    throw new Error("No data");
}