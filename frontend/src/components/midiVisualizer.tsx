import type { IMidiFile } from "midi-json-parser-worker";
import { isNoteOffEvent, isNoteOnEvent } from "./midiEventIdentifiers";
import { useEffect, useState } from "react";
import { MusicBarProps, NoteDisplayCanvas } from "./musicBarComponent";

export interface MidiVisualizerProps {
  midiFile: IMidiFile;
}

export function MidiVisualizer(props: MidiVisualizerProps) {
  const [, setMaxTicks] = useState(0);
  const [noteData, setNoteData] = useState<Map<string, MusicBarProps["notes"]>>(
    new Map(),
  );
  const { midiFile } = props;
  const { division, tracks } = midiFile;

  useEffect(() => {
    console.log("Processing");
    if (division < 4096) {
      console.log("metrical timing. Timing=", division, "pulsePerQuaterNote");
    } else {
      console.warn("timecode timing. Not implemented", division);
    }

    let maxTicks = 0;

    const _noteData: typeof noteData = new Map();

    tracks.forEach((track, i) => {
      let trackTickCount = 0;
      // {Note: start}
      const openNotes: { [note: number]: number } = {};
      track.forEach((event) => {
        trackTickCount += event.delta;
        if (isNoteOnEvent(event)) {
          openNotes[event.noteOn.noteNumber] = trackTickCount;
        }
        if (isNoteOffEvent(event)) {
          const note = event.noteOff.noteNumber;
          const channel = event.channel;
          const start = openNotes[note];
          const trackName = i;
          if (start) {
            const key = `T${trackName} C${channel}`;
            const notesKey = _noteData.get(key) ?? [];
            notesKey.push({
              note,
              on: start,
              off: trackTickCount,
            });
            _noteData.set(key, notesKey);
          } else {
            console.warn("Missing start note");
          }
        }
      });
      maxTicks = Math.max(maxTicks, trackTickCount);
    });

    setMaxTicks(maxTicks);
    setNoteData(_noteData);
  }, []);

  console.log(noteData);
  return <NoteDisplayCanvas />;
}
