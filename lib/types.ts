// Results
export type Result<T, E = undefined> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: E;
    };

export type AsyncResult<T, E = undefined> = Promise<Result<T, E>>;

export const Ok = <T, E>(value: T): Result<T, E> => ({ ok: true, value });
export const Err = <T, E>(error: E): Result<T, E> => ({ ok: false, error });

// Patches
export type Step =
  | {
      type: "NOTE";
      note: number;
    }
  | {
      type: "REST";
    };

export const note = (note: number): Step => ({ type: "NOTE", note });
export const rest = (): Step => ({ type: "REST" });

export interface Pattern {
  channel: number;
  steps: Step[];
}

export interface Patch {
  patterns: Pattern[];
}
