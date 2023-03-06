import { FoodReport, foodReportSchema, Personas,personasSchema } from "@/usecases/schema";
import { useEffect, useState } from "react";
import { RequestBody } from "./api/yaminabe/food-reporting";


export default function Home() {
    const [personas,setPersonas] = useState<Personas | null>(null)
    useEffect(() => {
        fetch("/api/yaminabe/personas").then(res => {
            if(res.ok){
                return res.json()
            } else {
                throw new Error("error")
            }
        }).then(res => {
            setPersonas(personasSchema.parse(res));
        })
    },[])

    const [reportResult,setReportResult] = useState<FoodReport | null>()
    const submitToFoodReportingApi = (items: string[]) => {
        const body : RequestBody = {
            ingredients: items,
            personas: personas || []
        }
        fetch("/api/yaminabe/food-reporting",{
            method: "POST",
            body: JSON.stringify(body)
        }).then(res => {
            if(res.ok){
                return res.json()
            } else {
                throw new Error("error")
            }
        }).then(e => {
            const reports = foodReportSchema.parse(e);
            console.log(e);
            setReportResult(reports);
        })
    }
    return (
        <main>
            <h1>Hello World</h1>
            {
                personas ? personas.map(persona => {
                    return (
                        <section key={persona.name}>
                            <h2>{persona.name}</h2>
                            <p>{persona.title}</p>
                            <p>{persona.persona}</p>
                        </section>
                    )
                }) : "loading..."
            }
            <AddToPot submit={submitToFoodReportingApi}></AddToPot>
            <code>
                {reportResult ? JSON.stringify(reportResult) : "no result"}
            </code>
        </main>
    )
}

export type AddToPotProps = {
    submit: (values: string[]) => void;
}

const AddToPot: React.FC<AddToPotProps> = ({submit}) => {
    const [items, setItems] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
  
    const handleAddItem = () => {
      setItems([...items, inputValue]);
      setInputValue('');
    };
  
    return (
      <div>
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleAddItem}>追加</button>
        </div>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {
            items.length > 0 ? <button onClick={() => {
                submit(items);
            }}>送信</button> : null
        }
      </div>
    );
  };