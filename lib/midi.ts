const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

// very simple implementation to get started
// returns the first midi output it can find
export const getMidiOutput = async (): Promise<WebMidi.MIDIOutput> => {
  const midiAccess = await navigator.requestMIDIAccess();

  console.log("midiAccess", midiAccess);

  const outputs = midiAccess.outputs.values();

  for (let output of outputs) {
    return output;
  }

  throw "failed to get midi output";
};

// very simple note trigger, note on with immediate note off
export const triggerNote = function (
  midiOutput: WebMidi.MIDIOutput,
  channel: number,
  note: number
) {
  if (!midiOutput) {
    throw "no midi output";
  }

  midiOutput.send([NOTE_ON | channel, note, 127]);

  setTimeout(() => {
    midiOutput.send([NOTE_OFF | channel, note, 127]);
  }, 1);
};
