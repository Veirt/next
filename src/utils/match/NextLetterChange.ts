import LetterChange from './LetterChange';

class NextLetterChange extends LetterChange {
  public change(): void {
    LetterChange.before = this.setBeforeText();
    LetterChange.next = this.setNextText();
    LetterChange.after = this.setAfterText();

    this.update();
  }

  public setBeforeText(): string {
    const { before, next } = LetterChange;

    return before + next;
  }

  public setNextText(): string {
    const { after } = LetterChange;

    return after.charAt(0);
  }

  public setAfterText(): string {
    const { after } = LetterChange;

    return after.substr(1);
  }
}

export default NextLetterChange;
