import { ChangeEvent, useEffect, useRef, useState } from "react";
import useConfig from "../../hooks/useConfig";


interface IProps {
    quote: string;
    disabled: boolean;
    removeLimit?: boolean;
    sendKeystroke: (keystroke: string, event: boolean) => void;
    isSuddenDeath?: boolean;
    replayInput?: string;
    isReplay?: boolean;
  }

const MatchTextContainer = (props: IProps) => {

    // Props 
    const { quote, disabled, removeLimit, sendKeystroke, isSuddenDeath, replayInput, isReplay } = props;

    // Refs 
    const refreshFPS = useRef<NodeJS.Timer | null>(null);
    const caretIdle = useRef<NodeJS.Timer | null>(null);
    const inputElement = useRef<HTMLInputElement | null>(null);
    const letterElement = useRef<HTMLDivElement | null>(null);
    const caretElement = useRef<HTMLDivElement | null>(null);
    const currentElement = useRef<HTMLDivElement | null>(null);
    const containerElement = useRef<HTMLDivElement | null>(null);

    // Config
    const { 
        smoothCaret, smoothCaretSpeed, 
        matchTextType, matchContainerTransparent,
        hideInputBox, colorBlindMode, 
        upscaleMatch, performanceMode
    } = useConfig();

    // States
    const [ input, setInput ] = useState<string>(replayInput || '');
    const [ correct, setCorrect ] = useState<string>('');
    const [ current, setCurrent ] = useState<string>(quote.charAt(0));
    const [ incorrect, setIncorrect ] = useState<string>('');
    const [ next, setNext ] = useState<string>(quote.substr(1));
    const [ disable, setDisable ] = useState<boolean>(disabled);

    // Index 
    const [ wordIndex, setWordIndex ] = useState<number>(0);
    const [ typoStreak, setTypoStreak ] = useState<number>(0);
    const [ letterIndex, setLetterIndex ] = useState<number>(0);

    // Caret 
    const [ caretBlinker, setCaretBlinker ] = useState<boolean>(true);
    const caretScale = 1.3;

    // Effect State Hooks
    useEffect(() => {
        const useFPS = performanceMode === '1' ? 34 : 17;
        const onFocus = () => setTimeout(() => inputElement.current?.focus(), 1);

        if (!refreshFPS.current) 
            refreshFPS.current = setInterval(onRefreshFPS, useFPS);

        if (inputElement.current) 
            inputElement.current?.addEventListener('blur', onFocus);

        return () => {
            if (caretIdle.current) clearInterval(caretIdle.current);
            if (refreshFPS.current) clearInterval(refreshFPS.current);
            // eslint-disable-next-line
            if (inputElement.current) inputElement.current.removeEventListener('blur', onFocus);
        }
        // eslint-disable-next-line
    }, [ isReplay, performanceMode ]);

    useEffect(() => setDisable(disabled), [ disabled ]);

    useEffect(() => {
        if (isSuddenDeath && typoStreak >= 1)
            setDisable(true)
    }, [ typoStreak, isSuddenDeath ]);

    useEffect(() => {
        setLetterIndex(0);
        setWordIndex(0);
        setTypoStreak(0);
        setCaretBlinker(true);
        setInput('');

        if (containerElement.current)
            containerElement.current.scrollTop = 0;
    }, [ props.quote ]);

    useEffect(() => {
        const typoStreakAfterCurrent = typoStreak - 1;

        const useNextIndex = 
            typoStreak >= 1 
                ? typoStreak === 1 
                    ? (letterIndex + 1) 
                    : (letterIndex + 1 + typoStreakAfterCurrent)
                : (letterIndex + 1 + typoStreak);
            
        setCorrect(props.quote.substr(0, letterIndex));
        setCurrent(props.quote.substr(letterIndex, 1));
        setIncorrect((typoStreak !== 1) ? props.quote.substr(letterIndex + 1, typoStreak - 1) : '');
        setNext(props.quote.substr(useNextIndex, props.quote.length - 1));
    }, [ props.quote, letterIndex, typoStreak ]);

    useEffect(() => {
        if (!disable)
            inputElement.current?.focus();
    }, [ disable ]);

    useEffect(() => {
        if (typeof replayInput !== 'undefined') {
            setInput(replayInput);
            onChange({ target: { value: replayInput } } as ChangeEvent<HTMLInputElement>);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ replayInput ]);

    // Functions
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const currentInputLength = input.length;
        setInput(e.target.value);

        // const quoteLength = quote.length;
        const inputValue = e.target.value;
        const keystroke = inputValue.charAt(inputValue.length - 1);
        const inputLength = inputValue.length;

        // Idle Timer
        setCaretBlinker(false);
        if (caretIdle.current) clearInterval(caretIdle.current);
        caretIdle.current = setTimeout(onCaretIdle, 530);
        
        // Socket Emit
        sendKeystroke(inputValue, e.isTrusted);

        // Basic
        const currentIndex = wordIndex + inputLength;

        // General Validation
        if (inputLength === 0) {
            setTypoStreak(0);
            setLetterIndex(wordIndex);
        } else {
            if (inputLength > currentInputLength) {
                if (typoStreak !== 0 || keystroke !== quote.charAt(currentIndex - 1)) {
                    setTypoStreak(typoStreak + 1);
                } else if (typoStreak === 0 && keystroke === quote.charAt(currentIndex - 1)) {
                    setLetterIndex(currentIndex);
                    
                    // Checks if Word is Finished
                    if (keystroke === ' ' || currentIndex === quote.length) {
                        setWordIndex(currentIndex);
                        setInput('');
                        
                        if (currentIndex === quote.length) {
                            setDisable(true);
                            console.log('Text is FINISHED');
                            
                        }
                    }
                }
            } else {
                let difference = currentInputLength - inputLength;
                if (typoStreak > difference) {
                    setTypoStreak(typoStreak - difference);

                    if (inputLength === 1 && keystroke === quote.charAt(currentIndex - 1)) {
                        setTypoStreak(0);
                        setLetterIndex(currentIndex);
                    }
                } else {
                    difference -= typoStreak;
                    setTypoStreak(0);

                    if (difference > 0) 
                        setLetterIndex(letterIndex - difference);
                }
            }
            
        }
    }

    // Timers
    const updateContainerOverflow = () => {
        
        if (containerElement.current && caretElement.current && currentElement.current && letterElement.current) {
            const letterHeight = letterElement.current.offsetHeight;
            const totalLines = Math.round(containerElement.current.scrollHeight / letterHeight);
            const currentLine = Math.round(currentElement.current.offsetTop / letterHeight) + 1;

            // Initial Height
            if (containerElement.current.scrollHeight > (letterHeight * 3))
                containerElement.current.style.height = `${(letterHeight * 3)}px`;

            if (currentLine >= 3 && currentLine < totalLines) 
                containerElement.current.scrollTop = ((letterHeight * (currentLine - 2)));
        }

    }

    const onRefreshFPS = () => {
        if (caretElement.current && currentElement.current) {
            let useAnimation;

            const caretLeft = `${currentElement.current!.offsetLeft - 3}px`;
            const caretTop = `${currentElement.current!.offsetTop}px`;
            const caretHeight = `${currentElement.current!.offsetHeight || 0}px`;

            updateContainerOverflow();

            if (smoothCaret === '1' && ('animate' in caretElement.current)) {
                useAnimation = caretElement.current?.animate({ left: caretLeft, top: caretTop, height: caretHeight }, { duration: parseInt(smoothCaretSpeed, 10) || 100 });

                useAnimation.onfinish = () => {
                    if (caretElement.current) {
                        caretElement.current.style.left = caretLeft;
                        caretElement.current.style.top = caretTop;
                        caretElement.current.style.height = caretHeight;
                    }
                }
            } else {
                caretElement.current!.style.left = caretLeft;
                caretElement.current!.style.top = caretTop;
                caretElement.current!.style.height = caretHeight;
            }
        }
    }

    const onCaretIdle = () => {
        setCaretBlinker(true);
        if (caretIdle.current) {
            clearInterval(caretIdle.current);
            caretIdle.current = null;
        }
    };

    // CSS Inlines 
    // For Tailwind Purge: duration-50 duration-75 duration-100 duration-150 duration-175 duration-200
    const upscaleMatchCSS = upscaleMatch === '1' ? 'text-base sm:text-lg md:text-xl lg:text-2xl' : 'text-sm sm:text-base md:text-lg lg:text-xl';
    const matchTextTypeCSS = matchTextType === '1' ? 'match--mono' : 'font-sans';
    const colorBlindCSS = colorBlindMode === '1' ? 'bg-blue-600 bg-opacity-40 text-white' : 'bg-red-600 bg-opacity-40 text-white';
    const colorBlindInputCSS = colorBlindMode === '1' ? 'bg-blue-600 bg-opacity-10 text-white' : 'bg-red-600 bg-opacity-10 text-white';
    
    return (
        <>
            <div className="flex flex-wrap match--text w-4 opacity-0 absolute left-0 top-0 pointer-events-none">
                <div ref={letterElement} className={`match--letter ${upscaleMatchCSS || ''}`}>A</div> 
            </div>
            <div className={`${(!isReplay && matchContainerTransparent === '1') ? 'match--container-transparent' : 'match--container'}`}>
                <div ref={containerElement} className={`match--text ${matchTextTypeCSS || ''} ${upscaleMatchCSS || ''}  relative pointer-events-none overflow-y-hidden`}>
                    <div ref={caretElement} className={`${(caretBlinker && !disabled) ? 'caret-idle' : ''} absolute rounded`} style={{ width: '1.5px', height: '24px', left: 0, top: 0, transform: `scale(${caretScale})`, background: '#FB923C' }} />
                    <span className="match--letter match--correct">{correct}</span>
                    <span ref={currentElement} className={`match--letter ${typoStreak ? colorBlindCSS : 'text-gray-400'}`}>{current}</span>
                    <span className={`match--letter ${colorBlindCSS}`}>{incorrect}</span>
                    <span className="match--letter text-gray-400">{next}</span>
                </div>
                <input
                    ref={inputElement}
                    className={`match--input ${typoStreak > 0 ? colorBlindInputCSS || '' : 'bg-gray-800 border-orange-400'} ${hideInputBox === '1' ? 'absolute left-0 opacity-0' : 'relative'}`}
                    lang="en"
                    type="text"
                    name="textInput"
                    placeholder={disabled ? 'Type your text in here...' : ''}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    onChange={!isReplay ? onChange : () => false}
                    onPaste={(e) => e.preventDefault()}
                    value={input}
                    maxLength={removeLimit ? 2000 : 50}
                    formNoValidate
                    disabled={disable}
                />
            </div>
        </>
    )
}

export default MatchTextContainer;
