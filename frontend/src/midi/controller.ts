import { WebMidi } from "webmidi";
export async function playNote() {
  console.log("Start");
  await WebMidi.enable({ sysex: true, software: true });

  WebMidi.inputs.forEach((input) => console.log(input.name, input));

  // Outputs
  WebMidi.outputs.forEach((output) => console.log(output.name, output));

  const input = WebMidi.getInputByName("out");
  input?.addListener("noteon", (e) => {
    console.log(e.note.identifier);
  });
  console.log("End");
}
