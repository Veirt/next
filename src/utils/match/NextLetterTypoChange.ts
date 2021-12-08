import LetterChange from './LetterChange';

class NextLetterTypoChange extends LetterChange {
  public change() {
    LetterChange.next = this.setNextText();
    LetterChange.after = this.setAfterText();

    this.update();
  }

  public setBeforeText(): string {
    return '';
  }

  public setNextText(): string {
    const { next, after } = LetterChange;

    return next + after.charAt(0);
  }

  public setAfterText(): string {
    const { after } = LetterChange;

    return after.substr(1);
  }
}

export default NextLetterTypoChange;
