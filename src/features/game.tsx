import { potsCollection } from "@/models/store";
import { useSubscribeCollection } from "@/util/firestore-hooks";
import React, { useMemo } from "react";

export type GameProps = {
  roomId: string;
};

export const Game: React.FC<GameProps> = ({ roomId }) => {
  const pots = useMemo(() => potsCollection(roomId), [roomId]);
  const potsSubscriptions = useSubscribeCollection(pots);
  switch (potsSubscriptions.status) {
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
            {potsSubscriptions.data.docs.map((e) => {
              return <li key={e.id}>{e.id}</li>;
            })}
          </ul>
        </section>
      );
  }
};
