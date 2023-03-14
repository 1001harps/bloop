import { Patch, Pattern, Step, Ok, Err, Result } from "./types";

const hexDigits = "0123456789abcdef".split("");

const parseLine = (line: string): Result<Pattern, string> => {
  const [channelText, sequenceText] = line.split(":");

  const channel = parseInt(channelText, 16);
  if (channel.toString() === "NaN") {
    return Err(`'${channelText}' is not a valid channel, at ${line}`);
  }

  const steps = sequenceText.split("").map<Step>((x) => {
    if (hexDigits.includes(x)) {
      const note = parseInt(x, 16);
      return { type: "NOTE", note };
    } else if (x === "x") {
      // x note becomes middle C - note number 60
      return { type: "NOTE", note: 60 };
    }

    return { type: "REST" };
  });

  return Ok({ channel, steps });
};

export const parsePatch = (patchText: string): Result<Patch, string> => {
  const patch: Patch = {
    patterns: [],
  };

  const lines = patchText
    .split("\n")
    // ignore whitespace
    .filter((x) => !x.match(/^\s*$/))
    // ignore commented out lines
    .filter((x) => !x.startsWith("//"));

  for (const line of lines) {
    const patternResult = parseLine(line);

    if (patternResult.ok) {
      patch.patterns.push(patternResult.value);
    } else {
      return Err(patternResult.error);
    }
  }

  return Ok(patch);
};
