import { useMemo, useState } from "react";
import { parseArrayBuffer } from "midi-json-parser";
import { MidiVisualizer } from "../../../components/midiVisualizer";
import type { IMidiFile } from "midi-json-parser-worker";
import { NoteDisplayCanvas } from "../../../components/musicBarComponent";
import { TNote } from "../../../types";
import { NoteUtils } from "../../../utils/notes";
import * as Tone from "tone";
import { Button } from "@chakra-ui/react";

export function ProjectList() {
  const [playHeadPosition, setPlayheadPosition] = useState(0);
  const [bpm, setBpm] = useState(100);
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
  const pixelsPerBeat = 20;
  const barHeightPixels = 15;
  const highestNote = 85;

  const noteUtils = useMemo(() => {
    return new NoteUtils({
      timeSignature: {
        beatsPerMeasure: 4,
        beatNoteValue: 4
      },
      bpm: bpm,
      pixelsPerBeat,
      barHeightPixels,
      highestNote
    });
  }, [bpm, highestNote]);

  const onPlayNote = (note: TNote) => {
    const noteStr = NoteUtils.midiNoteToMusicalString(note.note);
    if (noteStr) {
      synth?.triggerAttackRelease(noteStr, note.duration);
      console.log("PLAY", noteStr);
    }
  };

  const stop = async () => {
    const tone = Tone.getTransport();
    tone.stop()
    tone.cancel()
    tone.position = 0
    setPlayheadPosition(0)
  }

  const playSong = async () => {
    console.log("Play");
    await stop()
    const tone = Tone.getTransport();
    Tone.Sequence
    const part = new Tone.Part(
      (time, { note }) => {
        const noteStr = NoteUtils.midiNoteToMusicalString(note.note);
        if (noteStr) {
          console.log("Scheduled", time)
          synth?.triggerAttackRelease(noteStr, note.duration, time);
        }
      },
      notes.map((n) => ({ time: n.delta, note: n })),
    );
    console.log(notes)
    part.loop = false;
    part.start(0);
    tone.start();
    tone.scheduleRepeat((time) => {
      const transportSeconds = tone.toSeconds(tone.ticks + "i")
      const transportBeats = noteUtils.secondsToBeats(transportSeconds)
      setPlayheadPosition(transportBeats);
    }, "8n")
  };

  return (
    <div>
      <Button onClick={() => init()}>Init</Button>
      <Button onClick={() => playSong()}>Play</Button>
      <Button onClick={() => stop()}>Stop</Button>
      <input type="file" onChange={handleChange} />
      <NoteDisplayCanvas
        playHeadTime={playHeadPosition}
        notes={notes}
        setNotes={setNotes}
        onPlayNote={onPlayNote}
        bpm={bpm}
        timeSignature={{
          beatsPerMeasure: 4,
          beatNoteValue: 4,
        }}
      />
      {data && <MidiVisualizer midiFile={data} />}
    </div>
  );
}
