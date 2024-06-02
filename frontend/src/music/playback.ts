import * as Tone from "tone";
import { Note, NoteSequence } from "../types";

interface MusicPlayerProps {
  bpm: number;
}
export class MusicPlayer {
  private currentPart: Tone.Part | undefined;
  private readonly synth = new Tone.Synth().toDestination();

  constructor(props: MusicPlayerProps) {
    const transport = Tone.getTransport();
    transport.bpm.value = props.bpm;
    transport.timeSignature = 4;
    transport.debug = true;
  }

  private get playerState() {
    return Tone.getTransport().state;
  }

  public get getPlaybackTimeSeconds(): number | null {
    const transport = Tone.getTransport();
    if (!this.currentPart) {
      return null;
    }
    return transport.seconds;
  }

  public async stop() {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    transport.position = 0;
  }

  public async start(seq: NoteSequence, offset?: number) {
    const transport = Tone.getTransport();
    const bpm = transport.bpm.value; // Note: This wont work with changing BPM in song
    console.log(seq);
    if (this.playerState === "started") {
      transport.stop();
      transport.cancel();
      console.warn("Already started");
      return;
    } else if (this.playerState === "paused") {
      console.warn("Cannot `start()` a paused player; use `resume()`.");
      return;
    }
    if (transport.state !== "stopped") {
      throw new Error(
        "Cannot start playback while `Tone.Transport` is in use.",
      );
    }

    const thisPart = new Tone.Part(
      (time: number, { note }) => {
        // Stop playback is part removed
        if (this.currentPart !== thisPart) {
          return;
        }
        console.log("Playing");

        this.playNote(time, note);
      },
      seq.notes.map((n) => ({ time: (n.start / bpm) * 60, note: n })),
    );

    thisPart.loop = 0;
    this.currentPart = thisPart;

    this.currentPart.start(undefined, offset);
    if ((transport.state as string) !== "started") {
      transport.start();
    }

    // return new Promise((resolve) => {
    //   this.scheduledStop = transport.schedule(() => {
    //     this.stop();
    //     resolve();
    //     if (this.callbackObject) {
    //       this.callbackObject.stop();
    //     }
    //   }, `+${seq.totalTime}`);
    // });
  }

  public playNote(note: Note) {
    const duration = note.end - note.start;
    const freq = Tone.Frequency(note.note, "midi").toFrequency();
    this.synth.triggerAttackRelease(freq, duration);
  }
}
