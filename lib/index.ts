import { parsePatch } from "./parser";
import { Patch, Result } from "./types";

export class Bloop {
  loadPatch(patch: string): Result<Patch, string> {
    const parsedPatch = parsePatch(patch);
    return parsedPatch;
  }
}
