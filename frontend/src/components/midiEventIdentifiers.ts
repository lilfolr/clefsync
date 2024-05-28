import type {
  TMidiEvent,
  IMidiNoteOnEvent,
  IMidiNoteOffEvent,
} from "midi-json-parser-worker";

export function isNoteOnEvent(event: TMidiEvent): event is IMidiNoteOnEvent {
  if (
    event.noteOn &&
    typeof event.noteOn === "object" &&
    "noteNumber" in event.noteOn
  ) {
    return true;
  }
  return false;
}
export function isNoteOffEvent(event: TMidiEvent): event is IMidiNoteOffEvent {
  if (
    event.noteOff &&
    typeof event.noteOff === "object" &&
    "noteNumber" in event.noteOff
  ) {
    return true;
  }
  return false;
}
