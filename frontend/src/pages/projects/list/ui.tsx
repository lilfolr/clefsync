import { useState } from "react";
import { parseArrayBuffer } from "midi-json-parser";
import { MidiVisualizer } from "../../../components/midiVisualizer";
import type { IMidiFile } from "midi-json-parser-worker";
import { NoteDisplayCanvas } from "../../../components/musicBarComponent";
import { TNote } from "../../../types";
import { NoteUtils } from "../../../utils/notes";
import * as Tone from "tone";
import { Button } from "@chakra-ui/react";

export function ProjectList() {
  // const [playHeadPosition, setPlayheadPosition] = useState(0);
  // const [bpm, setBpm] = useState(100);
  const [data, setData] = useState<IMidiFile>();
  const [notes, setNotes] = useState<TNote[]>([]);
  const [synth, setSynth] = useState<null | Tone.Synth<Tone.SynthOptions>>(
    null,
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const file = event.target?.files?.item(0);
    if (file) {
      const buffer = await file.arrayBuffer();
      const data = await parseArrayBuffer(buffer);
      setData(data);
    }
  };

  const init = async () => {
    await Tone.start();
    if (synth) {
      synth.dispose();
    }
    const _synth = new Tone.Synth().toDestination();
    _synth.sync();
    setSynth(_synth);
  };

  const onPlayNote = (note: TNote) => {
    const noteStr = NoteUtils.midiNoteToMusicalString(note.note);
    if (noteStr) {
      synth?.triggerAttackRelease(noteStr, note.duration);
      console.log("PLAY", noteStr);
    }
  };

  const playSong = async () => {
    console.log("Play");
    const tone = Tone.getTransport();
    const part = new Tone.Part(
      (time, { note }) => {
        const noteStr = NoteUtils.midiNoteToMusicalString(note.note);
        if (noteStr) {
          synth?.triggerAttackRelease(noteStr, note.duration, time);
        }
      },
      notes.map((n) => ({ time: n.delta, note: n })),
    );
    part.loop = false;
    part.start(0);
    tone.start();
    // tone.scheduleOnce(() => {
    //   tone.stop();
    //   part.dispose()
    // },)
  };

  return (
    <div>
      <Button onClick={() => init()}>Init</Button>
      <Button onClick={() => playSong()}>Play</Button>
      <input type="file" onChange={handleChange} />
      <NoteDisplayCanvas
        notes={notes}
        setNotes={setNotes}
        onPlayNote={onPlayNote}
        bpm={120}
        timeSignature={{
          beatsPerMeasure: 4,
          beanNoteValue: 4,
        }}
      />
      {data && <MidiVisualizer midiFile={data} />}
    </div>
  );
}
