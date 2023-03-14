import { RoomActionsDocument, roomActionsQueryBase } from "@/models/store";
import { useSubscribeCollection } from "@/util/firestore-hooks";
import { QuerySnapshot } from "@firebase/firestore";
import React, { useMemo } from "react";
import { match, P } from "ts-pattern";

export const Log: React.FC<{ roomId: string }> = ({ roomId }) => {
  const col = useMemo(() => roomActionsQueryBase(roomId), [roomId]);
  const ingredientsGroupSubscription = useSubscribeCollection(col);
  switch (ingredientsGroupSubscription.status) {
    case "error":
      return <div>error</div>;
    case "loading":
      return <div>loading</div>;
    case "not-found":
      return <div>not found</div>;
    case "success":
      return <Success data={ingredientsGroupSubscription.data} />;
  }
};

const Success = ({ data }: { data: QuerySnapshot<RoomActionsDocument> }) => {
  return (
    <section>
      <h2>ログ</h2>
      <ul>
        {data.docs.map((e) => {
          return (
            <li key={e.id}>
              {match(e.data())
                .with(
                  {
                    type: "INIT_POTS",
                    payload: P.select(),
                  },
                  (payload) => <p>鍋が{payload.pots.length}個あります。</p>,
                )
                .with(
                  {
                    type: "PUT_INGREDIENT",
                    payload: P.select(),
                  },
                  (payload) => (
                    <p>
                      {payload.ingredient}が鍋{payload.potId}に入りました。
                    </p>
                  ),
                )
                .with(
                  {
                    type: "LOOK_INTO_POT",
                    payload: P.select(),
                  },
                  (payload) => (
                    <>
                      <p>鍋{payload.potId}を見ました。</p>
                      <img src={payload.imageUrl} />
                    </>
                  ),
                )
                .exhaustive()}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
