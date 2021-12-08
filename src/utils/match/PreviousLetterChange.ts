import LetterChange from './LetterChange';

class PreviousLetterChange extends LetterChange {
  public change() {
    LetterChange.after = this.setAfterText();
    LetterChange.next = this.setNextText();
    LetterChange.before = this.setBeforeText();

    this.update();
  }

  public setAfterText(): string {
    const { next, after } = LetterChange;

    return next.concat(after);
  }

  public setNextText(): string {
    const { before } = LetterChange;

    return before.charAt(before.length - 1);
  }

  public setBeforeText(): string {
    const { before } = LetterChange;

    return before.substring(0, before.length - 1);
  }
}

export default PreviousLetterChange;
