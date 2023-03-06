import { createFoodReportPersona, Personas } from "@/usecases/createFoodReportPersona";
import { GetServerSideProps } from "next";

type Props = {
    data: Personas
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const personas = await createFoodReportPersona();
    return {
        props: {
            data:personas
        }
    }
}


export default function Home(props: Props) {
    return (
        <main>
            <h1>Hello World</h1>
            <ul>
                {
                    props.data.map(persona => {
                        return (
                            <li key={persona.name}>
                                <section>
                                    <h2>{persona.name}</h2>
                                    <p>{persona.title}</p>
                                    <p>{persona.persona}</p>
                                </section>
                            </li>
                        )
                    })
                }
            </ul>
        </main>
    )
}