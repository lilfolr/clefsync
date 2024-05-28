/**
 * A Music note and time location
 */
export type TNote = {
  /**
   * Note as a midi number
   */
  note: number;
  /**
   * Time from the start in beats
   */
  delta: number;
  /**
   * Hot long the note is played for
   * in beats
   */
  duration: number;
};
