import { ChangeEvent, useEffect, useRef, useState } from "react";
import useConfig from "../../../hooks/useConfig";


interface IProps {
    quote: string;
    disabled: boolean;
    removeLimit?: boolean;
    sendKeystroke: (keystroke: string, event: boolean) => void;
    sendWord: (word: string) => void;
    isSuddenDeath?: boolean;
  }

const MatchTextContainer = (props: IProps) => {

    // Props 
    const { quote, disabled, removeLimit, sendKeystroke, sendWord, isSuddenDeath } = props;

    // Refs 
    const refreshFPS = useRef<NodeJS.Timer | null>(null);
    const caretIdle = useRef<NodeJS.Timer | null>(null);
    const inputElement = useRef<HTMLInputElement | null>(null);
    const caretElement = useRef<HTMLDivElement | null>(null);
    const currentElement = useRef<HTMLDivElement | null>(null);

    // Config
    const { 
        smoothCaret, smoothCaretSpeed, 
        matchTextType, matchContainerTransparent,
        hideInputBox, colorBlindMode, 
        upscaleMatch 
    } = useConfig();

    // States
    const [ input, setInput ] = useState<string>('');
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

    // Effect State Hooks
    useEffect(() => {
        const onFocus = () => setTimeout(() => inputElement.current?.focus(), 1);

        if (!refreshFPS.current) 
            refreshFPS.current = setInterval(onRefreshFPS, 17);

        if (inputElement.current) 
            inputElement.current?.addEventListener('blur', onFocus);

        return () => {
            if (caretIdle.current) clearInterval(caretIdle.current);
            if (refreshFPS.current) clearInterval(refreshFPS.current);
            // eslint-disable-next-line
            if (inputElement.current) inputElement.current.removeEventListener('blur', onFocus);
        }
        // eslint-disable-next-line
    }, [ ]);

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
                    sendWord(inputValue.endsWith(' ') ? inputValue.slice(0, -1) : inputValue);
                } else if (typoStreak === 0 && keystroke === quote.charAt(currentIndex - 1)) {
                    setLetterIndex(currentIndex);
                    
                    // Checks if Word is Finished
                    if (keystroke === ' ' || currentIndex === quote.length) {
                        sendWord(inputValue.endsWith(' ') ? inputValue.slice(0, -1) : inputValue);
                        setWordIndex(currentIndex);
                        setInput('');
                        
                        if (currentIndex === quote.length) {
                            setDisable(true);
                            console.log('Text is FINISHED');
                            
                        }
                    }
                }
            } else {
                if (inputLength === 1) {
                    if (keystroke !== quote.charAt(currentIndex - 1)) {
                        setTypoStreak(1);
                        setLetterIndex(wordIndex);
                    } else {
                        setTypoStreak(0);
                        setLetterIndex(currentIndex);
                    }
                } else {
                    if (typoStreak > 0)
                        setTypoStreak(typoStreak - 1);
                    else 
                        setLetterIndex(letterIndex - 1);
                }
            }
            
        }
    }

    // Timers
    const onRefreshFPS = () => {
        if (caretElement.current && currentElement.current) {
            let useAnimation;

            const caretLeft = `${currentElement.current!.offsetLeft - 3}px`;
            const caretTop = `${currentElement.current!.offsetTop}px`;
            const caretHeight = `${currentElement.current!.offsetHeight || 0}px`;

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
    const matchTextTypeCSS = matchTextType === '1' ? 'font-mono' : 'font-sans';
    const colorBlindCSS = colorBlindMode === '1' ? 'bg-blue-600 bg-opacity-40 text-white' : 'bg-red-600 bg-opacity-40 text-white';
    const colorBlindInputCSS = colorBlindMode === '1' ? 'bg-blue-600 bg-opacity-10 text-white' : 'bg-red-600 bg-opacity-10 text-white';
    
    return (
        <>
            <div className={`${matchContainerTransparent === '1' ? 'match--container-transparent' : 'match--container'}`}>
                <div className={`match--text ${matchTextTypeCSS || ''} ${upscaleMatchCSS || ''}  relative pointer-events-none`}>
                    <div ref={caretElement} className={`${(caretBlinker && !disabled) ? 'caret-idle' : ''} absolute rounded`} style={{ width: '1.5px', height: '24px', left: 0, top: 0, transform: 'scale(1.3)', background: '#FB923C' }} />
                    <span className="match--letter match--correct">{correct}</span>
                    <span ref={currentElement} className={`match--letter match--letter ${typoStreak ? colorBlindCSS : 'text-gray-400'}`}>{current}</span>
                    <span className={`match--letter match--letter ${colorBlindCSS}`}>{incorrect}</span>
                    <span className="match--letter text-gray-400">{next}</span>
                </div>
                <input
                    ref={inputElement}
                    className={`match--input ${typoStreak > 0 ? colorBlindInputCSS || '' : 'bg-gray-800 border-orange-400'} ${hideInputBox === '1' ? 'absolute opacity-0' : 'relative'}`}
                    lang="en"
                    type="text"
                    name="textInput"
                    placeholder={disabled ? 'Type your text in here...' : ''}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    onChange={onChange}
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
