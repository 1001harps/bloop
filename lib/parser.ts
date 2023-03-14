import { Pattern, PatternStep, settings, Patch, PatternSettings } from "./patches";
import { Ok, Err, Result } from "./types";

const hexDigits = "0123456789abcdef".split("");

const parsePattern = (line: string): Result<Pattern, string> => {
  const [channelText, sequenceText] = line.split(":");

  const channel = parseInt(channelText, 16);
  if (channel.toString() === "NaN") {
    return Err(`parsePattern: '${channelText}' is not a valid channel, at ${line}`);
  }

  const steps = sequenceText.split("").map<PatternStep>((x) => {
    if (hexDigits.includes(x)) {
      const note = parseInt(x, 16);
      return { type: "NOTE", note };
    } else if (x === "x") {
      // x is an alias for note 0
      return { type: "NOTE", note: 0 };
    }

    return { type: "REST" };
  });

  return Ok({ channel, settings: settings(), steps });
};

const parseSettings = (line: string): Result<[number, PatternSettings], string> => {
  const [channelText, settingsText] = line.split(":");

  const channel = parseInt(channelText[1], 16);
  if (channel.toString() === "NaN") {
    return Err(`parseSettings: '${channelText}' is not a valid channel, at ${line}`);
  }

  const octaveText = settingsText[0];
  const octave = parseInt(settingsText[0], 16);
  if (octave.toString() === "NaN") {
    return Err(`parseSettings: '${octaveText}' is not a valid octave, at ${line}`);
  }

  return Ok([channel, settings(octave)]);
};

export const parsePatch = (patchText: string): Result<Patch, string> => {
  const patch: Patch = {
    patterns: [],
  };

  const lines = patchText
    .split("\n")
    .map((x) => x.trim())
    // ignore empty string
    .filter((x) => !!x)
    // ignore commented out lines
    .filter((x) => !x.startsWith("//"));

  const parsedSettings: [number, PatternSettings][] = [];

  for (const line of lines) {
    if (line.startsWith("*")) {
      const settingsResult = parseSettings(line);

      if (settingsResult.ok) {
        parsedSettings.push(settingsResult.value);
      } else {
        return Err(settingsResult.error);
      }

      continue;
    }

    const patternResult = parsePattern(line);

    if (patternResult.ok) {
      patch.patterns.push(patternResult.value);
    } else {
      return Err(patternResult.error);
    }
  }

  // apply settings
  for (const [channel, settings] of parsedSettings) {
    const pattern = patch.patterns.find((x) => x.channel === channel);
    if (!pattern) continue;

    pattern.settings = settings;
  }

  return Ok(patch);
};
