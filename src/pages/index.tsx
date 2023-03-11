import { db } from "@/firestore";
import { collection, doc, setDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <main>
      <h1>Hello World</h1>
      {loading ? (
        <div>loading</div>
      ) : (
        <button
          onClick={async () => {
            const rooms = collection(db, "/rooms");
            const room = doc(rooms);
            const player = doc(room, "/players/testes");
            setLoading(true);
            await setDoc(player, {});
            router.push(`/rooms/${room.id}`);
          }}
        >
          start
        </button>
      )}
    </main>
  );
}
