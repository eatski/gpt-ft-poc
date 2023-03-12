import { DocumentReference, onSnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";

type SubscriptionData<T> =
  | {
      status: "loading" | "error" | "not-found";
    }
  | {
      status: "success";
      data: T;
    };

export const useSubscribeDocument = <T>(documentRef: DocumentReference<T>) => {
  const [document, setDocument] = useState<SubscriptionData<T>>({
    status: "loading",
  });
  useEffect(() => {
    return onSnapshot(
      documentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setDocument({
            status: "success",
            data: snapshot.data(),
          });
        } else {
          setDocument({
            status: "not-found",
          });
        }
      },
      () => {
        setDocument({
          status: "error",
        });
      },
    );
  }, [documentRef]);
  return document;
};
