import { type FineTune } from "openai"
import React,{ useEffect, useState } from "react"

const ListTunes = () => {

    const [tunes, setTunes] = useState<FineTune[]>([])

    useEffect(() => {
        (async () => {
            const openai = (await import("@/lib/openapi")).openai
            const tunes = await openai.listFineTunes()
            setTunes(tunes.data.data);
        })()
    },[])

    return <ul>
        {tunes.map(tune => <li key={tune.id}>
            <a href={`/tunes/${tune.fine_tuned_model}`} >{tune.created_at}</a>
        </li>)}
    </ul>
}

export default ListTunes