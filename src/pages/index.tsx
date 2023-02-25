export default function Home() {
    return (
        <main>
            <h1>Hello World</h1>
            <button onClick={() => {
                fetch("/api/words/new",{
                    method: "POST"
                }).then(e => {
                    if(e.ok){
                        return e;
                    } else {
                        throw new Error("Error");
                    }
                }) .then(e => e.json()).then(e => {
                    window.open(`/words/${e.word}`);
                })
                
            }}>Start</button>
        </main>
    )
}