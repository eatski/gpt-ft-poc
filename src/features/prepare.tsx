import { db, store } from "@/firestore"
import { personaSchema } from "@/models/schema"
import { doc, DocumentData, onSnapshot,runTransaction, DocumentReference } from "@firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import z from "zod"

type RoomFetchState = {
    status: "loading"| "error" | "notFound"
} | {
    status: "success",
    data: DocumentData | undefined
}

const dataSchema = z.union([z.object({
    persona: z.union([personaSchema,z.undefined()]),
    name: z.union([z.string(),z.undefined()]),
}),z.undefined()])

type Data = z.infer<typeof dataSchema>

export const Prepare = (props:{roomId: string}) => {
    const [state,setState] = useState<RoomFetchState>({
        status: "loading"
    });
    const playerId = "testes"
    const player = useMemo(() => doc(db,`/rooms/${props.roomId}/players/${playerId}`),[db,props.roomId,playerId]);
    useEffect(() => {
        return onSnapshot(player, (snapshot) => {
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
    },[])
    switch (state.status) {
        case "loading":
            return <div>loading</div>
        case "error":
            return <div>error</div>
        case "notFound":
            return <div>not found</div>
        case "success":
            const typedData = dataSchema.parse(state.data);
            return <Succsess data={typedData} roomId={props.roomId} playerRef={player}></Succsess>
    }
}

const Succsess = (props: {data:Data,roomId: string,playerRef: DocumentReference<DocumentData>}) => {
    useEffect(() => {
        fetch("/api/yaminabe/persona").then(res => {
            if(res.ok){
                return res.json()
            } else {
                throw new Error("error")
            }
        }).then((res) => {
            const persona = personaSchema.parse(res);
            runTransaction(store,async (t) => {
                const current = await t.get(props.playerRef);
                const data = current.data();
                const typed = dataSchema.safeParse(data);
                if(!typed.success || typed.data?.persona === undefined){
                    t.set<Data>(props.playerRef,{
                        name: "仮の名前",
                        persona
                    })
                }
            });
        })
    })
    return <div>
        <h2>{props.data?.name || "準備中"}</h2>
        {
            props.data?.persona && <dl>
                <dt>肩書き</dt>
                <dd>{props.data.persona.title}</dd>
                <dt>自己紹介</dt>
                <dd>{props.data.persona.persona}</dd>
            </dl>
        }
    </div>
}
