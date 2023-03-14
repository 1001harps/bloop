import { Bloop } from "./build/bloop.js";

const patch = `
0:x---x---
1:---x--x-
2:--xx
e:ffaecfaf
f:0--0--0-3--3--3-a--a--a-5--5--5-

*f:3

`;

const bloop = new Bloop();
const result = await bloop.playPatch(patch);
if (!result.ok) {
  console.error(result.error);
}
