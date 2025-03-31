#!/usr/bin/env node
import colors from "colors";
import { RUN_EXPRESS_SRC } from "../constants";
import {
  hasExistAnyFile,
  commander,
  getInput,
  isSameFolderExist,
  updatePackageName,
  logger,
  pathResolver,
  shellType,
} from "./utils";

const openProject = async (projectName: string) => {
  let hasCode: boolean = false;
  let commands: string = "";

  logger.start("Opening project...");

  try {
    hasCode = await commander("code -v", { suppressWarning: true });

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

    let oppened = await commander(`cd ${projectName} && ${commands}`, {
      suppressWarning: true,
    });

    if (oppened) {
      return logger.success("Project opened successfully!");
    } else {
      logger.warning("Faild to opened project! Try to open project manually!");
    }
  } catch (error) {
    logger.warning("Faild to opened project! Try to open project manually!");
  }

  logger.info(
    `Try these commands to open project:\n\n⚡️  ${colors.bold(
      `cd ${projectName}`
    )}\n🔧  ${colors.bold(`npm install`)}\n💻  ${colors.bold(commands)}\n`
  );
  logger.appriciation();
};

const sanitizeProject = async (projectName: string) => {
  logger.start("Sanitizing and install dependencies for project...");
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
        logger.warning(
          "Unsupported shell type! Consider to open project manually! and run npm install commands to install necessary dependencies."
        );
      }
    }

    let sanitized = await commander(commands, { suppressWarning: true });

    if (sanitized) {
      logger.success(
        "Project sanitized successfully! and install dependencies."
      );
      openProject(projectName);
    } else {
      logger.warning(
        "Faild to sanitize project! Try to sanitize project manually!"
      );
    }
  } catch (error) {
    logger.warning("Project sanitization failed!");
  }
};

const cloneRunExprss = async (projectName: string) => {
  logger.start("Cloning project...");
  let cloned = await commander(`git clone ${RUN_EXPRESS_SRC} ${projectName}`, {
    suppressWarning: true,
  });
  if (cloned) {
    logger.success("Project cloned successfully!");
    updatePackageName(pathResolver(projectName, "package.json"));
    logger.success(
      `Package name updated to ${colors.bold(projectName).underline}`
    );
  }
  sanitizeProject(projectName);
};

const initialize = (projectName: string) => {
  logger.start("Initializing project...");
  if (projectName === "." && hasExistAnyFile())
    return logger.error(
      "Current diretory is not empty! Please consider using a unique name for your project."
    );

  if (isSameFolderExist(projectName))
    return logger.error(
      "Already a folder exist with the same name! Please consider using a unique name for your project."
    );

  cloneRunExprss(projectName);
};

getInput("Enter project name: ", (answer) => {
  const projectName = answer.trim();
  initialize(projectName);
});
