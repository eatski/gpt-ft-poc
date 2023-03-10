import { db } from "@/firestore"
import { collection, doc } from "@firebase/firestore"
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    return (
        <main>
            <h1>Hello World</h1>
            <button onClick={() => {
                const rooms = collection(db,"/rooms");
                const room = doc(rooms);
                router.push(`/rooms/${room.id}`);
            }}>start</button>
        </main>
    )
}