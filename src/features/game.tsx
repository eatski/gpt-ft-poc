import { roomActionsCollection } from "@/models/store";
import { RequestBody } from "@/pages/api/yaminabe/image";
import { brandFilterQuery } from "@/util/brandedFilterQuery";
import { useSubscribeCollection } from "@/util/firestore-hooks";
import { addDoc, getDocs, query, where } from "@firebase/firestore";
import React, { useMemo, useState } from "react";
import { Log } from "./log";

export type GameProps = {
  roomId: string;
};

export const Game: React.FC<GameProps> = ({ roomId }) => {
  const roomActionsCollectionQuery = useMemo(
    () => brandFilterQuery(roomActionsCollection(roomId), "type", "INIT_POTS"),
    [roomId],
  );
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
            {roomActions.data.docs[0].data().payload.pots.map((e) => {
              return (
                <li key={e.id}>
                  <Pot potId={e.id} roomId={roomId} />
                </li>
              );
            })}
          </ul>
          <Log roomId={roomId} />
        </section>
      );
  }
};

const Pot: React.FC<{ potId: string; roomId: string }> = ({ potId, roomId }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const putIngredient = () => {
    const ref = roomActionsCollection(roomId);
    addDoc(ref, {
      type: "PUT_INGREDIENT",
      payload: {
        potId,
        ingredient: input,
      },
      timestamp: new Date().getTime(),
    });
    setInput("");
    setOpen(false);
  };
  const lookIntoPot = () => {
    const putIngredientActuibsQuery = brandFilterQuery(roomActionsCollection(roomId), "type", "PUT_INGREDIENT");
    const filteredByPotIdQuery = query(putIngredientActuibsQuery, where("payload.potId", "==", potId));
    getDocs(filteredByPotIdQuery)
      .then((snapshot) => {
        const ingredients = snapshot.docs.map((doc) => doc.data().payload.ingredient);
        const body: RequestBody = {
          ingredients,
        };
        return fetch("/api/yaminabe/image", {
          method: "POST",
          body: JSON.stringify(body),
        });
      })
      .then((res) => res.text())
      .then((url) => {
        return addDoc(roomActionsCollection(roomId), {
          type: "LOOK_INTO_POT",
          payload: {
            potId,
            imageUrl: url,
          },
          timestamp: new Date().getTime(),
        });
      });
  };
  return (
    <section>
      <h2>鍋: {potId}</h2>
      <button onClick={() => setOpen(!open)}>toggle</button>
      {open && (
        <fieldset>
          <div>
            <label>
              鍋にモノを入れる
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
              {input && <button onClick={putIngredient}>鍋に入れる</button>}
            </label>
          </div>
          <div>
            <button onClick={lookIntoPot}>鍋の中を覗く</button>
          </div>
        </fieldset>
      )}
    </section>
  );
};
