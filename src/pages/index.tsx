import { store } from "@/firestore"
import { addDoc, collection, doc } from "@firebase/firestore"

export default function Home() {

    return (
        <main>
            <h1>Hello World</h1>
            <button onClick={() => {
                const rooms = collection(store,"/yaminabe/v1/rooms/")
                const room = doc(rooms);
                window.location.href = `/rooms/${room.id}`
            }}>start</button>
        </main>
    )
}