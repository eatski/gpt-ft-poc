import { store } from "@/firestore";
import { personasCollection, PersonasDocument, playerCollection, PlayerDocument } from "@/models/store";
import { useSubscribeDocument } from "@/util/firestore-hooks";
import { doc, runTransaction, DocumentReference, getDocs, getDoc } from "@firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";

export type PrepareProps = {
  roomId: string;
  onReady: () => void;
};

export const Prepare = ({ roomId, onReady }: PrepareProps) => {

  const playerId = "testes";
  const playerDocumentRef = useMemo(() => doc(playerCollection(roomId), playerId), [roomId, playerId]);
  const playerDocumentData = useSubscribeDocument(playerDocumentRef);

  switch (playerDocumentData.status) {
    case "loading":
      return <div>loading</div>;
    case "error":
      return <div>error</div>;
    case "not-found":
      return <div>not found</div>;
    case "success":
      return <Succsess player={playerDocumentData.data} playerRef={playerDocumentRef} onReady={onReady}></Succsess>;
  }
};

const Succsess = ({
  player,
  playerRef,
  onReady,
}: {
  player: PlayerDocument;
  playerRef: DocumentReference<PlayerDocument>;
  onReady: () => void;
}) => {
  const [persona, setPersona] = useState<
    | {
        status: "ready" | "error";
      }
    | {
        status: "done";
        data: PersonasDocument;
      }
  >({
    status: "ready",
  });
  useEffect(() => {
    if (persona.status !== "ready") {
      return;
    }
    if (player.personaId) {
      const personaRef = doc(personasCollection, player.personaId);
      getDoc(personaRef).then((e) => {
        const data = e.data();
        if (data) {
          setPersona({
            status: "done",
            data,
          });
        } else {
          console.error("persona not found");
          setPersona({
            status: "error",
          });
        }
      });
      return;
    }
    getDocs(personasCollection)
      .then(({ docs }) => {
        return docs[Math.floor(Math.random() * docs.length)].id;
      })
      .then((personaId) => {
        runTransaction(store, async (t) => {
          const current = await t.get(playerRef);
          const data = current.data();
          if (data?.personaId === undefined) {
            t.set(playerRef, {
              name: "仮の名前",
              personaId,
            });
          }
        });
      });
  }, [persona, player.personaId, playerRef]);
  return (
    <div>
      <h2>{player?.name || "準備中"}</h2>
      {persona.status === "done" && (
        <>
          <dl>
            <dt>肩書き</dt>
            <dd>{persona.data.title}</dd>
            <dt>自己紹介</dt>
            <dd>{persona.data.persona}</dd>
          </dl>
          <button onClick={onReady}>準備完了</button>
        </>
      )}
    </div>
  );
};
