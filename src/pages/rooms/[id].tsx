import { Room } from "@/features/room";
import { useRouter } from "next/router";
import React from "react";

export default function Yaminabe() {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id === "string") {
    return <Room roomId={id}></Room>;
  }
  return null;
}
