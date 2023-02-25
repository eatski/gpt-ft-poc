import { decrypt } from "@/lib/crypto";
import { GetServerSideProps } from "next"
import Link from "next/link";

import * as z from "zod"

const Query = z.object({
    word: z.string(),
})

type Props = {
    word: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ({query}) => {
    const typedQuery = Query.parse(query);
    const word = decrypt(typedQuery.word);
  return {
    props: {
        word
    }
  }
}
export default function Home(props: Props) {
    return <>
        <main>
            <h1>Word</h1>
            <p>
                {props.word}
            </p>
        </main>
        <footer>
            <Link href="/">Home</Link>
        </footer>
    </>
}