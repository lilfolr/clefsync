import { TNote } from "../types";

export interface NoteUtilsProps {
  /**
   * Beats per minute
   */
  bpm: number;
  /**
   * How many pixels each beat is.
   * Basically the "zoom"
   */
  pixelsPerBeat: number;
  /**
   * How high each bar is
   */
  barHeightPixels: number;
  /**
   * Time Signature
   */
  timeSignature: {
    /**
     * How many beats in each measure/bar
     */
    beatsPerMeasure: number;
    /**
     * What note value is a "beat"?
     * 2 = Half
     * 4 = quarter
     */
    beatNoteValue: number;
  };

  /**
   * The highest note on the scale.
   * This is used to calculate co-ordinates
   */
  highestNote: number;
}
export class NoteUtils {
  private readonly bpm: number;
  private readonly highestNote: number;
  private readonly pixelsPerBeat: number;
  private readonly barHeightPixels: number;
  private readonly timeSignature: NoteUtilsProps["timeSignature"];

  constructor(props: NoteUtilsProps) {
    this.bpm = props.bpm;
    this.pixelsPerBeat = props.pixelsPerBeat;
    this.barHeightPixels = props.barHeightPixels;
    this.timeSignature = props.timeSignature;
    this.highestNote = props.highestNote;
  }

  /**
   * How many pixels between major grid lines
   * Major should be per bar
   */
  public get majorGridLinesResolution(): number {
    return this.pixelsPerBeat * this.timeSignature.beatsPerMeasure;
  }
  /**
   * How many pixels between minor grid lines
   * Minor should be per beat
   */
  public get minorGridLinesResolution(): number {
    return this.majorGridLinesResolution / this.timeSignature.beatNoteValue;
  }

  public noteAndTickToCoordinate(temporalNote: TNote): {
    x: number;
    y: number;
    width: number;
  } {
    const { note, duration, delta } = temporalNote;
    const y = (this.highestNote - note) * this.barHeightPixels;
    const x = Math.floor(delta * this.pixelsPerBeat);
    const width = Math.floor(duration * this.pixelsPerBeat);
    return { x, y, width };
  }

  /**
   * Convert pixels to Temporal Note
   * @param x: x co-ordinate in pixels
   * @param y: y co-ordinate in pixels
   */
  public coordinateToNoteAndTick(x: number, y: number, width: number): TNote {
    // x dictates the time; y the note
    const delta = Math.floor(x / this.pixelsPerBeat);
    const note = this.highestNote - Math.floor(y / this.barHeightPixels);
    const duration = Math.floor(width / this.pixelsPerBeat);
    return { note, delta, duration };
  }

  public static midiNoteToMusicalString(midiNote: number): string | null {
    // Check for valid MIDI note number range (0-127)
    if (midiNote < 0 || midiNote > 127) {
      console.error("Invalid midi note " + midiNote);
      return null;
    }

    const noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];

    // Calculate octave based on integer division by 12
    const octave = Math.floor(midiNote / 12) - 2;

    // Calculate note name index using modulo by 12 (0-based)
    const noteIndex = midiNote % 12;

    // Combine note name and octave
    return noteNames[noteIndex] + octave.toString();
  }
}
