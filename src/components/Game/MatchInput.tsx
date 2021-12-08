import { Component, ClipboardEvent, ChangeEvent, ReactNode } from 'react';

interface MatchInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled: boolean;
  removeLimit?: boolean;
  isLearn?: boolean;
}

interface MatchInputState {
  content: string;
}

class MatchInput extends Component<MatchInputProps, MatchInputState> {
  state = {
    content: '',
  };

  public input!: HTMLInputElement;

  onPaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
  };

  onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { onChange, isLearn } = this.props;

    e.target.value = e.target.value.trimStart();
    if (isLearn)
      e.target.value = e.target.value.replaceAll(',', '.');

    this.setState({ content: e.target.value });
    onChange(e);
  };

  componentDidUpdate(prevProps: MatchInputProps) {
    if (prevProps.disabled === this.props.disabled)
      return;
    else
      this.input.focus();

  }

  componentDidMount() {
    if (this.input)
        this.input.addEventListener("blur", this.onFocus);
  }

  componentWillUnmount() {
      if (this.input)
          this.input.removeEventListener("blur", this.onFocus);
  }

  onFocus = () => {
    setTimeout(() => this.input.focus(), 1);
  }

  render(): ReactNode {
    const { content } = this.state;
    const { disabled, className, removeLimit } = this.props;

    return (
      <input
        className={`match--input ${className}`}
        lang="en"
        type="text"
        name="textInput"
        placeholder={disabled ? 'Type your text in here...' : ''}
        autoComplete="nope"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={this.onChange}
        onPaste={this.onPaste}
        value={content}
        maxLength={removeLimit ? 2000 : 50}
        formNoValidate
        disabled={disabled}
        ref={(input: HTMLInputElement) => (this.input = input)}
      />
    );
  }
}

export default MatchInput;
