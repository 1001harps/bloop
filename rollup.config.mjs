import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "lib/index.ts",
    output: {
      file: "build/bloop.js",
      format: "es",
      sourcemap: "inline",
    },
    plugins: [typescript()],
  },
];
