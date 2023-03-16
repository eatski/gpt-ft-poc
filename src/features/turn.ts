import { RoomActionsDocument } from "@/models/store";
import { match, P } from "ts-pattern";

export type Turn = {
    phase: "init" | "main"
    actions: RoomActionsDocument[],
    isClosed: boolean,
};

export type GameContext = {
    playerNum: number,
}

export const separateActionsIntoTurn = (actions: RoomActionsDocument[],{playerNum}: GameContext): Turn[] => {

    type Acc = {turns: Turn[]};
    const {turns} = actions.reduce<Acc>((acc,cur):Acc  => {
        return match(cur).with({
            type: "INIT_POTS",
        }, () => {
            return {
                turns: [...acc.turns, {
                    phase: "init" as const,
                    actions: [cur],
                    isClosed: true,
                }]
            }
        }).with({
            type: P.union("PUT_INGREDIENT","LOOK_INTO_POT"),
        }, () => {
            const openTurn = acc.turns.find(turn => !turn.isClosed);
            if(openTurn === undefined) {
                return {
                    turns: [...acc.turns, {
                        phase: "main" as const,
                        actions: [cur],
                        isClosed: 1 === playerNum,
                    }]
                }
            }
            const closeTurns = acc.turns.filter(turn => turn.isClosed);
            return {
                turns: [...closeTurns, {
                    ...openTurn,
                    actions: [...openTurn.actions, cur],
                    isClosed: openTurn.actions.length + 1 === playerNum,
                }]
            }           
        }).exhaustive()
    },{
        turns: [],
    })
    return turns;
}