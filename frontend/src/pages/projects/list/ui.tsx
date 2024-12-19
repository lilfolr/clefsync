import { useEffect, useMemo, useState } from "react";
import { parseArrayBuffer } from "midi-json-parser";
import { MidiVisualizer } from "../../../components/midiVisualizer";
import type { IMidiFile } from "midi-json-parser-worker";
import { NoteDisplayCanvas } from "../../../components/musicBarComponent";
import { NoteSequence, Note } from "../../../types";
import { NoteUtils } from "../../../utils/notes";
import * as Tone from "tone";
import { MusicPlayer } from "../../../music/playback";
import { Button } from "antd";

export function ProjectList() {
  const [playHeadPosition, setPlayheadPosition] = useState(0);
  const [bpm, setBpm] = useState(100);
  const [data, setData] = useState<IMidiFile>();
  const [notes, setNotes] = useState<Note[]>([]);

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

  const musicPlayer = useMemo(() => {
    return new MusicPlayer({ bpm })
  }, [bpm]);


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
  };

  useEffect(() => {
    setInterval(() => {
      const transportSeconds = musicPlayer.getPlaybackTimeSeconds;
      if (transportSeconds) {
        const transportBeats = noteUtils.secondsToBeats(transportSeconds)
        setPlayheadPosition(transportBeats);
      }
    }, 200);
  }, [])

  const onPlayNote = (note: Note) => {
    musicPlayer.playNote(note);
  };

  const playSong = async () => {
    console.log("Play");
    const seq: NoteSequence = {
      notes,
    }
    await musicPlayer.start(seq);
  };

  const stopSong = async () => {
    console.log("Stop");
    await musicPlayer.stop();
    setPlayheadPosition(0);
  }

  return (
    <div>
      <Button onClick={() => init()}>Init</Button>
      <Button onClick={() => playSong()}>Play</Button>
      <Button onClick={() => stopSong()}>Stop</Button>
      <input type="file" onChange={handleChange} />
      {data && <MidiVisualizer midiFile={data} />}
    </div>
  );
}
