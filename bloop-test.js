import { Bloop } from "./build/bloop.js";

const patch = `
0:x---x---
1:---x--x-
2:--xx
e:ffaecfaf
f:0--0--0-3--3--3-a--a--a-5--5--5-
`;

const bloop = new Bloop();
const parsedPatch = bloop.loadPatch(patch);

console.log("parsedPatch", parsedPatch);
