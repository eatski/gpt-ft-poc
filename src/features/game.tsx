import { store } from "@/lib/firestore";
import { roomActionsCollection, translationCollection } from "@/models/store";
import { RequestBody, responseBodySchema } from "@/apiSchema/translate";
import { RequestBody as ImagesRequestBody } from "@/pages/api/yaminabe/image";
import { brandFilterQuery } from "@/util/brandedFilterQuery";
import { useSubscribeCollection } from "@/util/firestore-hooks";
import { addDoc, doc, getDocs, onSnapshot, query, where, writeBatch } from "@firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { match, P } from "ts-pattern";
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

  useTranslationActionsWord(roomId);

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

const useTranslationActionsWord = (roomId: string) => {
  useEffect(() => {
    const roomActiionsCollectionRef = roomActionsCollection(roomId);
    const filtered = brandFilterQuery(roomActiionsCollectionRef, "type", "PUT_INGREDIENT");
    return onSnapshot(filtered, async (snapshot) => {
      const words = snapshot.docs.flatMap((doc) => {
        return match(doc.data())
          .with(
            {
              type: "PUT_INGREDIENT",
              payload: P.select(),
            },
            (payload) => [payload.ingredient],
          )
          .exhaustive();
      });
      if (!words.length) {
        return;
      }
      const translationCollectionRef = translationCollection(roomId);
      const queryByWords = query(translationCollectionRef, where("ja", "in", words));
      const notTranslated = await getDocs(queryByWords).then((snapshot) => {
        const translations = snapshot.docs.map((doc) => doc.data());
        return words.filter((e) => !translations.some((t) => t.ja.includes(e)));
      });
      const body: RequestBody = {
        words: notTranslated,
      };
      if (!notTranslated.length) {
        return;
      }
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
      translated.forEach((e) => {
        batch.set(doc(translationCollectionRef, btoa(encodeURIComponent(e.original))), {
          ja: e.original,
          en: e.translated,
        });
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
        ingredient: input,
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

    const translationCollectionRef = translationCollection(roomId);
    const queryByWords = query(translationCollectionRef, where("ja", "in", ingredients));
    const translations = await getDocs(queryByWords);

    const body: ImagesRequestBody = {
      ingredients: translations.docs.map((doc) => doc.data().en),
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
