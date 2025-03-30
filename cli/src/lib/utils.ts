import colors from "colors";
import { log as Print } from "console";
import { execSync } from "child_process";
import readline from "readline";
import os from "os";
import fs from "fs";
import path from "path";

export class Logger {
  static info(message: string): void {
    Print(`ℹ️  ${colors.blue("[INFO]")}    : ${message}`);
  }

  static success(message: string): void {
    Print(`✅ ${colors.green("[SUCCESS]")} : ${message}`);
  }

  static warning(message: string): void {
    Print(`⚠️  ${colors.yellow("[WARNING]")} : ${message}`);
  }

  static error(message: string): void {
    Print(`❌ ${colors.red("[ERROR]")} : ${message}`);
  }
}

type TC_Wrapper = <T extends any[], R>(
  handler: (...args: T) => any
) => (...args: T) => R;

export const tcWrapper: TC_Wrapper = (handler) => {
  return (...args) => {
    try {
      const returnValue = handler(...args);
      return returnValue;
    } catch (error) {
      Logger.error(error instanceof Error ? error.message : "unknown error");
      return false;
    }
  };
};

export const Root: string = process.cwd();

export const pathResolver = tcWrapper<string[], string>((...paths) => {
  return path.join(Root, ...paths);
});

export const commander = (commands: string) => {
  try {
    execSync(commands, { stdio: "inherit" });
    return true;
  } catch (_) {
    return false;
  }
};

export const getInput = tcWrapper<[string, (answer: string) => void], void>(
  (question, callback) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`✒️  ${colors.blue("[INPUT]")} : ${question}`, (answer) => {
      callback(answer);
      rl.close();
    });
  }
);

export const shellType: "powershell" | "cmd" | "bash" = (() => {
  const shell = (
    process.env.SHELL ||
    process.env.COMSPEC ||
    os.userInfo().shell ||
    ""
  ).toLowerCase();

  if (
    shell.includes("bash") ||
    shell.includes("zsh") ||
    shell.includes("sh") ||
    shell.includes("csh") ||
    shell.includes("dash")
  )
    return "bash";

  if (shell.includes("powershell") || shell.includes("pwsh"))
    return "powershell";

  if (shell.includes("cmd.exe")) return "cmd";

  return "bash";
})();

export const updatePackageName = tcWrapper<[string], void>(
  (packageJsonPath: string): void => {
    const packageJson = fs.readFileSync(packageJsonPath, "utf8");

    let projectName = packageJsonPath.split(/\//).reverse()[1];

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
  }
);

export const isSameFolderExist = tcWrapper<[string], boolean>(
  (projectName?: string): boolean => {
    return projectName ? fs.existsSync(pathResolver(projectName)) : false;
  }
);

export const hasExistAnyFile = tcWrapper<[], boolean>(() => {
  const files = fs.readdirSync(Root);
  return files.length > 0 ? true : false;
});
