#!/usr/bin/env node
import colors from "colors";
import { RUN_EXPRESS_SRC } from "../constants";
import {
  hasExistAnyFile,
  commander,
  getInput,
  isSameFolderExist,
  updatePackageName,
  Logger,
  pathResolver,
  shellType,
} from "./utils";

const openProject = (projectName: string) => {
  let hasCode: boolean = false;
  let commands: string = "";

  try {
    hasCode = commander("code -v");

    switch (shellType) {
      case "powershell":
        commands = hasCode ? `code .` : `Start-Process .`;
        break;
      case "cmd":
        commands = hasCode ? `code .` : `start .`;
        break;
      case "bash":
        commands = hasCode ? `code .` : `open .`;
        break;
      default:
        commands = "";
    }

    let oppened = commander(commands);

    if (oppened) {
      return Logger.success("Project opened successfully!");
    } else {
      Logger.warning("Faild to opened project! Try to open project manually!");
    }
  } catch (error) {
    Logger.warning("Faild to opened project! Try to open project manually!");
  }

  Logger.info(
    `Try these commands to open project:\n\n⚡️ cd ${projectName}\n🔧 npm install\n💻 ${commands}\n`
  );
};

const sanitizeProject = (projectName: string) => {
  try {
    let commands: string = "";

    switch (shellType) {
      case "powershell":
        commands = `powershell -Command Push-Location ${projectName}; Remove-Item -Path '.git' -Recurse -Force; Remove-Item -Path 'cli' -Recurse -Force; npm install; Pop-Location`;
        break;
      case "bash":
        commands = `cd ${projectName} && rm -rf .git && rm -rf cli && npm install`;
        break;
      case "cmd":
        commands = `cd /d ${projectName} && rmdir /S /Q .git && rmdir /S /Q cli && npm install`;
        break;
      default: {
        commands = "";
        Logger.warning(
          "Unsupported shell type! Consider to open project manually! and run npm install commands to install necessary dependencies."
        );
      }
    }

    Logger.success(
      "Project sanitized and installed dependencies successfully!"
    );
    commands && commander(commands) && openProject(projectName);
  } catch (error) {
    Logger.warning("Project sanitization failed!");
  }
};

const cloneRunExprss = (projectName: string) => {
  let cloned = commander(`git clone ${RUN_EXPRESS_SRC} ${projectName}`);
  if (cloned) {
    Logger.success("Project cloned successfully!");
    updatePackageName(pathResolver(projectName, "package.json"));
    Logger.success(
      `Package name updated to ${colors.bold(projectName).underline}`
    );
  }
  sanitizeProject(projectName);
};

const initialize = (projectName: string) => {
  if (projectName === "." && hasExistAnyFile())
    return Logger.error(
      "Current diretory is not empty! Please consider using a unique name for your project."
    );

  if (isSameFolderExist(projectName))
    return Logger.error(
      "Already a folder exist with the same name! Please consider using a unique name for your project."
    );

  cloneRunExprss(projectName);
};

getInput("Enter project name: ", (answer) => {
  const projectName = answer.trim();
  initialize(projectName);
});
