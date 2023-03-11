import { store } from "@/firestore"
import { personasCollection, PersonasDocument, playerCollection, PlayerDocument } from "@/models/store"
import { doc, onSnapshot,runTransaction, DocumentReference, getDocs, getDoc} from "@firebase/firestore"
import React,{ useEffect, useMemo, useState } from "react"

type RoomFetchState = {
    status: "loading"| "error" | "notFound"
} | {
    status: "success",
    data: PlayerDocument
}


export const Prepare = (props:{roomId: string}) => {
    const [state,setState] = useState<RoomFetchState>({
        status: "loading"
    });
    const playerId = "testes"
    const playerDocumentRef = useMemo(() => doc(playerCollection(props.roomId),playerId),[props.roomId, playerId]);
    useEffect(() => {
        return onSnapshot(playerDocumentRef, (snapshot) => {
            const exists = snapshot.exists();
            if(!exists){
                setState({
                    status: "notFound"
                });
                return;
            }
            setState({
                status: "success",
                data:snapshot.data()
            });
        },(e) => {
            console.error(e)
            setState({
                status: "error"
            })
        })
    },[playerDocumentRef])
    switch (state.status) {
        case "loading":
            return <div>loading</div>
        case "error":
            return <div>error</div>
        case "notFound":
            return <div>not found</div>
        case "success":
            return <Succsess player={state.data} playerRef={playerDocumentRef}></Succsess>
    }
}

const Succsess = ({player,playerRef}: {player:PlayerDocument,playerRef: DocumentReference<PlayerDocument>}) => {
    const [persona,setPersona] = useState<{
        status: "ready" | "error"
    } | {
        status: "done",
        data: PersonasDocument
    }>({
        status: "ready"
    });
    useEffect(() => {
        if(persona.status !== "ready"){
            return;
        }
        if(player.personaId){
            const personaRef = doc(personasCollection,player.personaId);
            getDoc(personaRef)
                .then(e => {
                    const data = e.data();
                    if(data){
                        setPersona({
                            status: "done",
                            data
                        })
                    } else {
                        console.error("persona not found")
                        setPersona({
                            status: "error"
                        })
                    }
                })
            return;
        }
       getDocs(personasCollection)
        .then(({docs}) => {
            return docs[Math.floor(Math.random() * docs.length)].id;
        })
        .then(personaId => {
            runTransaction(store,async (t) => {
                const current = await t.get(playerRef);
                const data = current.data();
                if(data?.personaId === undefined){
                    t.set(playerRef,{
                        name: "仮の名前",
                        personaId
                    })
                }
            });
        })
    },[persona,player.personaId,playerRef])
    return <div>
        <h2>{player?.name || "準備中"}</h2>
        {
            persona.status === "done" && <dl>
                <dt>肩書き</dt>
                <dd>{persona.data.title}</dd>
                <dt>自己紹介</dt>
                <dd>{persona.data.persona}</dd>
            </dl>
        }
    </div>
}
