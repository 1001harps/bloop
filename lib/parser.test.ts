import { parsePatch } from "./parser";
import { Patch, rest, note } from "./types";

describe("parser", () => {
  test("parses empty patch", () => {
    const patch = "";
    const parsedPatch = parsePatch(patch);
    if (!parsedPatch.ok) {
      throw `error parsing patch: ${parsedPatch.error}`;
    }

    const expectedPatch: Patch = {
      patterns: [],
    };

    expect(parsedPatch.value).toMatchObject(expectedPatch);
  });

  test("parses commented out line", () => {
    const patch = "// 0:-";
    const parsedPatch = parsePatch(patch);
    if (!parsedPatch.ok) {
      throw `error parsing patch: ${parsedPatch.error}`;
    }

    const expectedPatch: Patch = {
      patterns: [],
    };

    expect(parsedPatch.value).toMatchObject(expectedPatch);
  });

  test("parses rest step", () => {
    const patch = "0:-";
    const parsedPatch = parsePatch(patch);
    if (!parsedPatch.ok) {
      throw `error parsing patch: ${parsedPatch.error}`;
    }

    const expectedPatch: Patch = {
      patterns: [{ channel: 0, steps: [rest()] }],
    };

    expect(parsedPatch.value).toMatchObject(expectedPatch);
  });

  test("parses note step", () => {
    const patch = "0:8";
    const parsedPatch = parsePatch(patch);
    if (!parsedPatch.ok) {
      throw `error parsing patch: ${parsedPatch.error}`;
    }

    const expectedPatch: Patch = {
      patterns: [{ channel: 0, steps: [note(8)] }],
    };

    expect(parsedPatch.value).toMatchObject(expectedPatch);
  });

  test("parses 'x' step as middle C", () => {
    const patch = "0:x";
    const parsedPatch = parsePatch(patch);
    if (!parsedPatch.ok) {
      throw `error parsing patch: ${parsedPatch.error}`;
    }

    const expectedPatch: Patch = {
      patterns: [{ channel: 0, steps: [note(60)] }],
    };

    expect(parsedPatch.value).toMatchObject(expectedPatch);
  });

  test("parses multi step patch", () => {
    const patch = "5:1--2-3---4-";
    const parsedPatch = parsePatch(patch);
    if (!parsedPatch.ok) {
      throw `error parsing patch: ${parsedPatch.error}`;
    }

    const expectedSteps = [
      note(1),
      rest(),
      rest(),
      note(2),
      rest(),
      note(3),
      rest(),
      rest(),
      rest(),
      note(4),
      rest(),
    ];

    const expectedPatch: Patch = {
      patterns: [{ channel: 5, steps: expectedSteps }],
    };

    expect(parsedPatch.value).toMatchObject(expectedPatch);
  });

  test("parses multi channel multi step patch", () => {
    const patch = `
    0:1-2-3
    1:2-3-4
    2:4-5-6
    `;

    const parsedPatch = parsePatch(patch);
    if (!parsedPatch.ok) {
      throw `error parsing patch: ${parsedPatch.error}`;
    }

    const expectedPatch: Patch = {
      patterns: [
        { channel: 0, steps: [note(1), rest(), note(2), rest(), note(3)] },
        { channel: 1, steps: [note(2), rest(), note(3), rest(), note(4)] },
        { channel: 2, steps: [note(4), rest(), note(5), rest(), note(6)] },
      ],
    };

    expect(parsedPatch.value).toMatchObject(expectedPatch);
  });

  test("returns error for invalid channel", () => {
    const patch = "g:-";
    const parsedPatch = parsePatch(patch);
    expect(parsedPatch.ok).toBe(false);
    if (!parsedPatch.ok) {
      expect(parsedPatch.error).toContain("not a valid channel");
    }
  });
});
