import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  outDir: "dist",
  splitting: false,
  clean: true,
  minify: true,
  dts: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
