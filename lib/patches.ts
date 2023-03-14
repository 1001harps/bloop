export const DEFAULT_OCTAVE = 5;

export type PatternStep =
  | {
      type: "NOTE";
      note: number;
    }
  | {
      type: "REST";
    };

export const note = (note: number): PatternStep => ({ type: "NOTE", note });
export const rest = (): PatternStep => ({ type: "REST" });

export interface PatternSettings {
  octave: number;
}

export const settings = (octave: number = DEFAULT_OCTAVE): PatternSettings => ({ octave });

export interface Pattern {
  channel: number;
  settings: PatternSettings;
  steps: PatternStep[];
}

export interface Patch {
  patterns: Pattern[];
}
