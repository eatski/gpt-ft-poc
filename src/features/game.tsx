import { store } from "@/lib/firestore";
import { roomActionsCollection } from "@/models/store";
import { RequestBody, responseBodySchema } from "@/apiSchema/translate";
import { RequestBody as ImagesRequestBody } from "@/pages/api/yaminabe/image";
import { brandFilterQuery } from "@/util/brandedFilterQuery";
import { useSubscribeCollection } from "@/util/firestore-hooks";
import { addDoc, getDocs, onSnapshot, query, where, writeBatch } from "@firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Log } from "./log";
import deepmerge from "deepmerge";

export type GameProps = {
  roomId: string;
};

export const Game: React.FC<GameProps> = ({ roomId }) => {
  const roomActionsCollectionQuery = useMemo(
    () => brandFilterQuery(roomActionsCollection(roomId), "type", "INIT_POTS"),
    [roomId],
  );
  const roomActions = useSubscribeCollection(roomActionsCollectionQuery);

  useTranslationPutIngredient(roomId);

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

const useTranslationPutIngredient = (roomId: string) => {
  useEffect(() => {
    const roomActiionsCollectionRef = roomActionsCollection(roomId);
    const filtered = brandFilterQuery(roomActiionsCollectionRef, "type", "PUT_INGREDIENT");
    return onSnapshot(filtered, async (snapshot) => {
      const notTranslated = snapshot.docs.filter((e) => !e.data().payload.ingredient.translated);
      if (!notTranslated.length) {
        return;
      }
      const body: RequestBody = {
        words: notTranslated.map(item => item.data().payload.ingredient.original),
      };
      const translated = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((json) => responseBodySchema.parse(json));

      const batch = writeBatch(store);
      notTranslated.forEach((doc) => {
        const data = doc.data();
        batch.update(doc.ref,deepmerge({
          payload: {
            ingredient: {
              translated: translated.find(e => e.original === data.payload.ingredient.original)?.translated,
            }
          }
        },data));
      });
      await batch.commit();
    });
  }, [roomId]);
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
        ingredient: {
          original: input
        },
      },
      timestamp: new Date().getTime(),
    });
    setInput("");
    setOpen(false);
  };
  const lookIntoPot = async () => {
    const putIngredientActuibsQuery = brandFilterQuery(roomActionsCollection(roomId), "type", "PUT_INGREDIENT");
    const filteredByPotIdQuery = query(putIngredientActuibsQuery, where("payload.potId", "==", potId));
    const ingredients = await getDocs(filteredByPotIdQuery).then((snapshot) =>
      snapshot.docs.map((doc) => doc.data().payload.ingredient),
    );

    const body: ImagesRequestBody = {
      ingredients: ingredients.map(e => e.translated || e.original), // TODO: 未翻訳の場合はエラーにする
    };

    const imageUrl = await fetch("/api/yaminabe/image", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.text());

    await addDoc(roomActionsCollection(roomId), {
      type: "LOOK_INTO_POT",
      payload: {
        potId,
        imageUrl: imageUrl,
      },
      timestamp: new Date().getTime(),
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
