import LetterChange from './LetterChange';

class PreviousLetterTypoChange extends LetterChange {
  public change() {
    LetterChange.after = this.setAfterText();
    LetterChange.next = this.setNextText();

    this.update();
  }

  public setAfterText(): string {
    const { next, after } = LetterChange;

    return next.charAt(next.length - 1).concat(after);
  }

  public setNextText(): string {
    const { next } = LetterChange;

    return next.substr(0, next.length - 1);
  }

  public setBeforeText(): string {
    return '';
  }
}

export default PreviousLetterTypoChange;
