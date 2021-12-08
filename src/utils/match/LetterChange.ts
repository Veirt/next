import MatchContent from '../../components/Game/MatchContent';

abstract class LetterChange {
  public static before = '';

  public static next = '';

  public static after = '';

  protected matchContent: MatchContent;

  constructor(matchContent: MatchContent) {
    this.matchContent = matchContent;
  }

  /**
   * Sets the state of the Match Content to the updated values
   */
  protected update(): void {
    this.matchContent.setState({
      before: LetterChange.before,
      next: LetterChange.next,
      after: LetterChange.after,
    });
  }

  abstract change(): void;

  /**
   * Sets the {@link LetterChange.before} value
   * @returns {string}
   */
  abstract setBeforeText(): string;

  /**
   * Sets the {@link LetterChange.next} value
   * @returns {string}
   */
  abstract setNextText(): string;

  /**
   * Sets the {@link LetterChange.after} value
   * @returns {string}
   */
  abstract setAfterText(): string;
}

export default LetterChange;
