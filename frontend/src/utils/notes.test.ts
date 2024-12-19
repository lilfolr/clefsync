import { describe, expect, it } from "vitest";
import { NoteUtils } from "./notes";

describe("Grid lines", () => {
  it("Should return grid line resolution", () => {
    const utils = new NoteUtils({
      timeSignature: {
        beatsPerMeasure: 4,
        beatNoteValue: 4,
      },
      pixelsPerBeat: 100,
      barHeightPixels: 50,
      bpm: 100,
      highestNote: 96,
    });

    expect(utils.minorGridLinesResolution).toEqual(100);
    expect(utils.majorGridLinesResolution).toEqual(100 * 4);
  });
  it("Should use signature in grid line resolution", () => {
    const utils = new NoteUtils({
      timeSignature: {
        beatsPerMeasure: 3,
        beatNoteValue: 5,
      },
      pixelsPerBeat: 100,
      barHeightPixels: 50,
      bpm: 100,
      highestNote: 96,
    });

    expect(utils.minorGridLinesResolution).toEqual(60); // 300 beats per measure.
    expect(utils.majorGridLinesResolution).toEqual(100 * 3);
  });

  it("Should calculate note correctly", () => {
    const utils = new NoteUtils({
      timeSignature: {
        beatsPerMeasure: 4,
        beatNoteValue: 4,
      },
      pixelsPerBeat: 100,
      barHeightPixels: 50,
      bpm: 100,
      highestNote: 96,
    });
    const [x, y, width] = [200, 500, 200];
    const expectedStart = 2; // 200 px => 2 beats
    const expectedNote = 86;
    const expectedDuration = 2; //2 beats

    const result = utils.coordinateToNoteAndTick(x, y, width);
    expect(result.start).toEqual(expectedStart);
    expect(result.note).toEqual(expectedNote);
    expect(result.duration).toEqual(expectedDuration);

    const pixelResult = utils.noteAndTickToCoordinate({
      note: 86,
      start: 2,
      duration: 0,
    });
    expect(pixelResult.y).toEqual(y);
    expect(pixelResult.x).toEqual(x);
  });

  it("Should calculate note correctly 2", () => {
    const utils = new NoteUtils({
      timeSignature: {
        beatsPerMeasure: 4,
        beatNoteValue: 4,
      },
      pixelsPerBeat: 100,
      barHeightPixels: 50,
      bpm: 100,
      highestNote: 96,
    });
    const [x, y, width] = [200, 0, 300];
    const expectedStart = 2; // 200 px => 2 beats
    const expectedNote = 96;
    const expectedDuration = 3;

    const noteResult = utils.coordinateToNoteAndTick(x, y, width);
    expect(noteResult.start).toEqual(expectedStart);
    expect(noteResult.note).toEqual(expectedNote);
    expect(noteResult.duration).toEqual(expectedDuration);

    const pixelResult = utils.noteAndTickToCoordinate({
      note: 96,
      start: 2,
      duration: 0,
    });
    expect(pixelResult.y).toEqual(y);
    expect(pixelResult.x).toEqual(x);
  });

  it("Should convert midi notes to string", () => {
    const knownConversions: [x: number, y: string][] = [
      [0, "C-2"],
      [50, "D2"],
      [34, "A#0"],
      [111, "D#7"],
    ];

    knownConversions.forEach(([note, noteStr]) => {
      expect(NoteUtils.midiNoteToMusicalString(note)).toEqual(noteStr);
    });
  });

  it("should convert from bpm", () => {
    const utils = new NoteUtils({
      timeSignature: {
        beatsPerMeasure: 4,
        beatNoteValue: 4,
      },
      pixelsPerBeat: 100,
      barHeightPixels: 50,
      bpm: 100,
      highestNote: 96,
    });

    expect(utils.secondsToBeats(60)).toEqual(100);
    expect(utils.secondsToBeats(120)).toEqual(200);
  });
});
