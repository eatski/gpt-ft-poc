import { RoomActionsDocument, roomActionsQueryBase } from "@/models/store";
import { useSubscribeCollection } from "@/util/firestore-hooks";
import { QuerySnapshot } from "@firebase/firestore";
import React, { useMemo } from "react";
import { match, P } from "ts-pattern";
import { separateActionsIntoTurn } from "./turn";

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
    const turns = separateActionsIntoTurn(data.docs.map(e => e.data()),{
        playerNum: 1
    })
  return (
    <section>
      <h2>ログ</h2>
      <ul>
        {turns.map((e,i) => {
            return <li key={i}>
                {i + 1}ターン目
                <ul>
                    {
                        e.actions.map((e,i) => {
                            return (
                                <li key={i}>
                                {match(e)
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
                                        {payload.ingredient.original}が鍋{payload.potId}に入りました。
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
                        })
                    }
                </ul>
            </li>
        })}
      </ul>
    </section>
  );
};
