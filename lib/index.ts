import { getMidiOutput, triggerNote } from "./midi";
import { parsePatch } from "./parser";
import { AsyncResult, Err, Ok } from "./types";

export class Bloop {
  bpm = 120;
  bpms = this.bpm / 60 / 1000;
  interval = 1 / this.bpms / 4;
  currentStep = 0;

  async playPatch(patch: string): AsyncResult<boolean, string> {
    const parsedPatch = parsePatch(patch);
    if (!parsedPatch.ok) {
      return Err(parsedPatch.error);
    }

    const midiOutput = await getMidiOutput();

    const interval = setInterval(() => {
      const patterns = parsedPatch.value.patterns;

      // get length of longest pattern
      const sequenceLength = Math.max(...patterns.map((x) => x.steps.length));

      for (let p of patterns) {
        const i = this.currentStep % p.steps.length;

        const step = p.steps[i];
        if (step.type === "NOTE") {
          try {
            triggerNote(midiOutput, p.channel, step.note);
          } catch (error) {
            console.error(error);
            clearInterval(interval);
          }
        }
      }

      this.currentStep++;
      if (this.currentStep >= sequenceLength) {
        this.currentStep = 0;
      }
    }, this.interval);

    return Ok(true);
  }
}
