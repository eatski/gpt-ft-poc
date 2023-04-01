import { useRouter } from "next/router";
import React from "react";

export default function TunePage() {
    const router = useRouter();
    const id = router.query.id;

    const [input,setInput] = React.useState("");
    return <form onSubmit={async (e) => {
        e.preventDefault();
        const openai = (await import("@/lib/openapi")).openai
        const result = await openai.createCompletion({
            model: id as string,
            prompt: input,
        })
        console.log(result.data);
    }}>
        <textarea onChange={(e) => {
            setInput(e.target.value);
        }}></textarea>
        <button type="submit">Submit</button>
    </form>;
}