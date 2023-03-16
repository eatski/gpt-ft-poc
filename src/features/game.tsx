import React, {} from "react";
import { Log } from "./log";
import { Pots } from "./pots";

export type GameProps = {
  roomId: string;
};

export const Game: React.FC<GameProps> = ({ roomId }) => {
  return (
    <>
      <Pots roomId={roomId}></Pots>
      <Log roomId={roomId} />
    </>
  );
};
