import React, { ChangeEvent, Component, ReactNode } from 'react';
import MatchInput from './MatchInput';
import NextLetterChange from '../../utils/match/NextLetterChange';
import PreviousLetterChange from '../../utils/match/PreviousLetterChange';
import NextLetterTypoChange from '../../utils/match/NextLetterTypoChange';
import PreviousLetterTypoChange from '../../utils/match/PreviousLetterTypoChange';
import LetterChange from '../../utils/match/LetterChange';
import ConfigService from '../../services/ConfigService';

interface MatchQuoteProps {
  quote: string;
  disabled: boolean;
  removeLimit?: boolean;
  sendKeystroke: (keystroke: string, event: boolean) => void;
  sendWord: (word: string) => void;
  isSuddenDeath?: boolean;
}

interface MatchQuoteState {
  before: string;
  next: string;
  after: string;
  idle: boolean;
}

class MatchContent extends Component<MatchQuoteProps, MatchQuoteState> {
  state = {
    before: '',
    // eslint-disable-next-line react/destructuring-assignment
    next: this.props.quote.charAt(0),
    // eslint-disable-next-line react/destructuring-assignment
    after: this.props.quote.substr(1),
    idle: true,
  };

  public input!: MatchInput;

  private lastCharHeight = 0;

  private nextIndex = 0;

  private typoIndex = 0;

  private quoteIndex = 0;

  private nextLetterChange = new NextLetterChange(this);

  private nextLetterTypoChange = new NextLetterTypoChange(this);

  private previousLetterChange = new PreviousLetterChange(this);

  private previousLetterTypoChange = new PreviousLetterTypoChange(this);

  private idleTimeout: NodeJS.Timeout | undefined;

  private caretAnimation!: Animation;

  public componentDidMount(): void {
    const { before, next, after } = this.state;

    LetterChange.before = before;
    LetterChange.next = next;
    LetterChange.after = after;

    setTimeout(() => this.resetCaret(), 100);

    if (window)
      window.addEventListener('resize', this.onResize);
  }

  public componentDidUpdate(prevProps: Readonly<MatchQuoteProps>, prevState: Readonly<MatchQuoteState>): void {
    if (this.state.after !== prevState.after || this.state.before !== prevState.before)
      this.updateCaret();

    if (prevProps.quote !== this.props.quote) {
      const { quote } = this.props;
      this.setState({
        before: '',
        next: quote.charAt(0),
        after: quote.substr(1),
      });

      if (this.input) this.input.setState({ content: '' });

      this._nextIndex = 0;
      this.nextIndex = 0;
      this.typoIndex = 0;
      this.quoteIndex = 0;

      LetterChange.before = '';
      LetterChange.next = quote.charAt(0);
      LetterChange.after = quote.substr(1);

      setTimeout(() => this.resetCaret(), 100);
    }
  }

  public componentWillUnmount() {
    if (this.idleTimeout) clearInterval(this.idleTimeout);

    window.removeEventListener('resize', this.onResize);
  }

  /**
   * Event Listener for Screen Resize
   */
  public onResize = () => {
    console.log('called');
    this.updateCaret(true);
  }

  /**
   * Sets nextIndex and typoIndex to a given index
   * @param {number} index
   */
  private set _nextIndex(index: number) {
    this.nextIndex = this.typoIndex = index;
  }

  /**
   * Called when the player unsuccessfully types a letter.
   * Only shifts the {@link this.state.next} text one letter right.
   */
  private nextLetterTypo = () => {
    // Do not shift if this is the first typo in a row.
    if (this.typoIndex - this.nextIndex <= 1) {
      // Force re-render to show the red background behind the 'next' span.
      this.forceUpdate();
      return;
    }

    this.nextLetterTypoChange.change();
  };

  /**
   * Called when the player successfully types a letter.
   * Shifts the text one letter right.
   */
  private nextLetter = () => {
    this._nextIndex = this.nextIndex + 1;
    this.quoteIndex++;

    this.nextLetterChange.change();
  };

  /**
   * Called when the player deletes a letter.
   * Shifts the text one letter left.
   */
  private previousLetter = () => {
    this.nextIndex--;
    this.typoIndex--;
    this.quoteIndex--;

    // Update caret
    this.previousLetterChange.change();
  };

  /**
   * Called when the player deletes a letter while being in a typo streak.
   * Only shifts the {@link this.state.next} text one letter left.
   */
  private previousLetterTypo = () => {
    this.typoIndex--;

    // Do not shift if this is the last typo in the streak to be deleted.
    if (this.typoIndex !== this.nextIndex) {
      this.previousLetterTypoChange.change();
    } else {
      // Force re-render to remove the red background behind the 'next' span.
      this.forceUpdate();
    }
  };

  /**
   * Called when a player deletes letter(s).
   * Loops for the number of deleted letters, and calls the according method
   */
  private deletedLetters = (amount: number) => {
    for (let i = 0; i < amount; i++) {
      if (!this.props.quote[this.quoteIndex - this.nextIndex + this.typoIndex - 1]) {
        // The User made typos after the quote ended
        this.typoIndex--;
      } else if (this.typoIndex > this.nextIndex) {
        // The player is in a typo streak.
        this.previousLetterTypo();
      } else {
        // The player deleted a correct letter.
        this.previousLetter();
      }
    }
  };

  public resetCaret = () => {
    const element: HTMLElement = (document.getElementById('caret') as HTMLElement);
    const letterHeight: HTMLElement = (document.getElementsByClassName('match--letter')[0] as HTMLElement);
    if (letterHeight) {
      const { offsetHeight } = letterHeight;

      element.style.left = `-2px`;
      element.style.top = `5px`;
      element.style.height = `${offsetHeight}px`;
    }
  };

  public updateCaret = (overrideHeight: boolean = false) => {
    const smoothCaretSpeed: number = parseInt(ConfigService.getSmoothCaretSpeed());
    const isSmooth: boolean = ConfigService.getSmoothCaret() === '1';

    const element = document.getElementById('caret');
    const matchCaret = (document.getElementsByClassName('match--caret')[0] as HTMLElement);

    if (element && matchCaret) {
      const { offsetLeft, offsetTop, offsetHeight } = matchCaret;

      const newLeft = `${offsetLeft - 2}px`;
      const newTop = `${offsetTop + 1}px`;
      const newHeight = `${(this.lastCharHeight !== 0 && this.lastCharHeight < offsetHeight) ? this.lastCharHeight : offsetHeight}px`;

      this.lastCharHeight = (!overrideHeight && this.lastCharHeight !== 0 && this.lastCharHeight < offsetHeight) ? this.lastCharHeight : offsetHeight;

      element.style.height = newHeight;

      if (isSmooth) {
        // Create animation
        this.caretAnimation = element.animate({ left: newLeft, top: newTop, }, { duration: smoothCaretSpeed });

        this.caretAnimation.onfinish = () => {
          element.style.left = newLeft;
          element.style.top = newTop;
        };
      } else {
        element.style.left = newLeft;
        element.style.top = newTop;
      }
    }
  };

  public onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { sendKeystroke, sendWord } = this.props;
    const { value } = e.target;

    // Handle cursor blink1
    if (this.idleTimeout) {
      clearInterval(this.idleTimeout);
    }
    this.idleTimeout = setInterval(() => this.onIdle(), 530);

    this.setState({ idle: false });

    sendKeystroke(value, e.isTrusted);

    const valueLengthDelta = this.typoIndex - value.length;
    if (valueLengthDelta > 0) {
      // The player deleted letter(s)

      // Whether or not to add a one character offset to the deletedLetters call.
      // This is true when the User does not delete the entire word.
      // The offset is used to ignore the letters the User did not delete, and only acknowledge them later throughout this function's stack
      const addOffset = !!value.length;
      this.deletedLetters(valueLengthDelta + (addOffset ? 1 : 0));
    }

    const letter = value[this.nextIndex];
    if (!letter) return;

    if (LetterChange.next === letter) {
      // The written letter matches the next letter

      // Continue to the next letter
      this.nextLetter();

      if (letter === ' ' || this.quoteIndex === this.props.quote.length) {
        // The typed letter is a space
        // Continue to the next word
        sendWord(value.endsWith(' ') ? value.slice(0, -1) : value);
        this.input.setState({ content: '' });
        this._nextIndex = 0;
      }
    } else {
      // send word to server, server will filter
      sendWord(value.endsWith(' ') ? value.slice(0, -1) : value);

      // The written letter does not Game the next letter - typo
      this.typoIndex++;
      this.nextLetterTypo();
    }
  };

  private onIdle(): void {
    this.setState({ idle: true });
  }

  render(): ReactNode {
    const getHideInputBox = ConfigService.getHideInputBox();

    const { before, next, after, idle } = this.state;
    const { disabled, quote, removeLimit, isSuddenDeath } = this.props;

    let newDisabled = disabled;

    // Check for last text
    if (!next) {
      newDisabled = true;
    }

    const matchTextType = ConfigService.getMatchTextType();
    const upscaleMatch = ConfigService.getUpscaleMatch();
    const colorBlindMode = ConfigService.getColorBlindMode();

    let matchTextCSS = 'text-sm sm:text-base md:text-lg lg:text-xl';

    if (upscaleMatch === '1')
      matchTextCSS = 'text-base sm:text-lg md:text-xl lg:text-2xl';

    return quote ? (
      <div>
        <div className="relative pointer-events-none">
          <div
            id="caret"
            style={{ width: '2px',  left: '-2px', top: '5px', transform: 'scale(1.3)' }}
            className={`${idle && !disabled ? 'caret-idle' : ''} absolute rounded bg-orange-400`}
          />
          <div className={`match--text ${matchTextCSS} ${matchTextType === '0' ? 'font-sans' : 'font-mono'}`}>
            <span className="match--letter match--correct">{before}</span>
            <span className={`match--caret match--letter ${this.typoIndex !== this.nextIndex ? (colorBlindMode === '1' ? 'bg-blue-600 bg-opacity-40 text-white' : 'bg-red-600 bg-opacity-40 text-white') : 'text-gray-400'} `}>
              {next}
            </span>
            <span className="match--letter text-gray-400">{after}</span>
          </div>
        </div>
        <div className={getHideInputBox === '1' ? 'absolute opacity-0' : 'relative'}>
          <MatchInput
            ref={(ref: MatchInput) => (this.input = ref)}
            onChange={this.onChange}
            removeLimit={removeLimit}
            className={this.typoIndex !== this.nextIndex ? (colorBlindMode === '1' ? 'bg-blue-600 bg-opacity-10 border-blue-400' : 'bg-red-600 bg-opacity-10 border-red-400') : 'bg-gray-800 border-orange-400'}
            disabled={(isSuddenDeath && this.typoIndex !== this.nextIndex) || newDisabled}
          />
        </div>
      </div>
    ) : <></>;
  }
}

export default MatchContent;
