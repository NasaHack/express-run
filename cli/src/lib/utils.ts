import { execSync } from "child_process";
import readline from "readline";
import os from "os";
import fs from "fs";
import path from "path";

export const commander = (commands: string, callback: Function) => {
  try {
    execSync(commands, { stdio: "inherit" });
    callback(null, true);
  } catch (error) {
    callback(error);
  }
};

export const getInput = (question: string, callback: Function) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(question, (answer) => {
    callback(answer);
    rl.close();
  });
};

export const platform: "win32" | "linux" | "darwin" = (() => {
  switch (os.platform()) {
    case "win32":
      return "win32";
    case "linux":
      return "linux";
    case "darwin":
      return "darwin";
    default:
      return "linux";
  }
})();

export const hasCode: Boolean = (() => {
  try {
    execSync("code -v");
    return true;
  } catch (_) {
    return false;
  }
})();

export const isSameFolderExist = (projectName?: string): boolean => {
  return projectName
    ? fs.existsSync(path.join(process.cwd(), projectName))
    : false;
};

export const updatePackageName = (projectName: string): void => {
  const packageJsonPath = path.join(process.cwd(), projectName, "package.json");
  const packageJson = fs.readFileSync(packageJsonPath, "utf8");
  let line = packageJson.split("\n");

  line = line.map((line) => {
    if (line.includes("name")) {
      return `  "name": "${projectName}",`;
    } else if (line.includes("version")) {
      return `  "version": "1.0.0",`;
    } else {
      return line;
    }
  });

  fs.writeFileSync(packageJsonPath, line.join("\n"));
};
