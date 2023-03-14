import { roomActionsCollection } from "@/models/store";
import { brandFilterQuery } from "@/util/brandedFilterQuery";
import { useSubscribeCollection } from "@/util/firestore-hooks";
import React, { useMemo, useState } from "react";
import { Log } from "./log";

export type GameProps = {
  roomId: string;
};

export const Game: React.FC<GameProps> = ({ roomId }) => {
  const roomActionsCollectionQuery = useMemo(() => 
  brandFilterQuery(roomActionsCollection(roomId),"type", "INIT_POTS")
    , [roomId]);
  const roomActions = useSubscribeCollection(roomActionsCollectionQuery);

  switch (roomActions.status) {
    case "error":
      return <div>error</div>;
    case "loading":
      return <div>loading</div>;
    case "not-found":
      return <div>not found</div>;
    case "success":
      return (
        <section>
          <h1>Game</h1>
          <ul>
            {
              roomActions.data.docs[0].data().payload.pots.map((e) => {
                return <li key={e.id}>
                  <Pot potId={e.id} />
                </li>
              })
            }
          </ul>
            <Log roomId={roomId}/>
        </section>
      );
  }
};



const Pot: React.FC<{ potId: string }> = ({ potId }) => {
    const [open , setOpen] = useState(false);
    const [input, setInput] = useState("");
    return <section>
        <h2>鍋: {potId}</h2>
        <button onClick={() => setOpen(!open)}>toggle</button>
        {open && 
            <>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
                {input && <button>鍋に入れる</button>}
            </>
        }
    </section>;
}
