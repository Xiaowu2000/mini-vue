const pkg = require("./package.json");
const typescript = require("@rollup/plugin-typescript");
module.exports = {
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: pkg.main,
    },
    {
      format: "es",
      file: pkg.module,
    },
  ],
  plugins: [typescript()],
};
