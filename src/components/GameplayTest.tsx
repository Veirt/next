import MatchContent from "./Game/MatchContent";

const GameplayText = () => {

    return (
        <div className={"flex h-screen"}>
            <div className={"max-w-screen-sm m-auto"}>
                <MatchContent
                    quote={"This is a no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no no."}
                    disabled={false}
                    sendKeystroke={() => console.log('keystroke sent')}
                    sendWord={() => console.log('keystroke sent')}
                />
            </div>
        </div>
    )
}

export default GameplayText;