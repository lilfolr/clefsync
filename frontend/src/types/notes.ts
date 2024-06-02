export interface Note {
  /**
   * Note as a midi number
   */
  note: number;
  /**
   * Time from the note starts in beats
   * offset from start of song
   */
  start: number;
  /**
   * Time from the note ends in beats
   * offset from start of song
   */
  end: number;
}

export interface NoteSequence {
  notes: Note[];
}
