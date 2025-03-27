import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  dts: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
