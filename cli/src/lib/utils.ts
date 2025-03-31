import colors from "colors";
import { exec, execSync } from "child_process";
import readline from "readline";
import os from "os";
import fs from "fs";
import path from "path";
import ora, { Ora } from "ora";
import { RUN_EXPRESS_SRC } from "../constants";

export const Root: string = process.cwd();

class Logger {
  private spinner: Ora;
  protected hyperLink: string;

  constructor() {
    this.spinner = ora({
      spinner: "dots",
      color: "yellow",
    });
  }

  start = (message: string) => {
    this.spinner.start(`  ${colors.bold("[LOADING]").red} : ${message}`);
  };

  info = (message: string) => {
    this.spinner.stopAndPersist({
      symbol: "",
      text: `ℹ️   ${colors.blue("[INFO]")}    : ${message}`,
    });
  };

  success = (message: string) => {
    this.spinner.stopAndPersist({
      symbol: "",
      text: `✅  ${colors.green("[SUCCESS]")} : ${message}`,
    });
  };

  warning = (message: string) => {
    this.spinner.stopAndPersist({
      symbol: "",
      text: `⚠️   ${colors.yellow("[WARNING]")} : ${message}`,
    });
  };

  error = (message: string) => {
    this.spinner.stopAndPersist({
      symbol: "",
      text: `❌  ${colors.red("[ERROR]")}   : ${message}`,
    });
  };

  appriciation = () => {
    this.spinner.stopAndPersist({
      symbol: "",
      text: `\n🎉 Dear friends! 🎉\nIf you found this helpful, a ⭐ STAR ⭐ would be ${colors.bold(
        "GREATLY APPRECIATED"
      )}! 🥰 \n━━\x1b]8;;${RUN_EXPRESS_SRC}\x07🚀 ${colors.bold(
        "STAR ON GITHUB"
      )} 🚀\x1b]8;;\x07━━\n`,
    });
  };
}

export const logger = new Logger();

type TC_Wrapper = <T extends any[], R>(
  handler: (...args: T) => any
) => (...args: T) => R;

export const tcWrapper: TC_Wrapper = (handler) => {
  return (...args) => {
    try {
      const returnValue = handler(...args);
      return returnValue;
    } catch (error) {
      logger.error(error instanceof Error ? error.message : "unknown error");
      return false;
    }
  };
};

export const pathResolver = tcWrapper<string[], string>((...paths) => {
  return path.join(Root, ...paths);
});

type Commander = (
  commands: string,
  options?: { suppressWarning?: boolean }
) => Promise<boolean>;

export const commander: Commander = (
  command: string,
  options = { suppressWarning: false }
) => {
  return new Promise((resolve) => {
    exec(command, { encoding: "utf-8" }, (error, stdout, stderr) => {
      if (error) {
        if (!options.suppressWarning) console.error(stderr);
        return resolve(false);
      }
      resolve(true);
    });
  });
};

export const getInput = tcWrapper<[string, (answer: string) => void], void>(
  (question, callback) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`✒️   ${colors.blue("[INPUT]")}   : ${question}`, (answer) => {
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
