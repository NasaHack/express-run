#!/usr/bin/env node
import { RUN_EXPRESS_SRC } from "../constants";
import {
  commander,
  getInput,
  hasCode,
  isSameFolderExist,
  platform,
  updatePackageName,
} from "./utils";

const executeCommand = (command: string, successMsg: string): boolean => {
  let isSuccess = false;

  commander(command, (error: Error, isSuccessFlag: boolean) => {
    if (!error && isSuccessFlag) {
      console.log(successMsg);
      isSuccess = true;
    } else {
      isSuccess = false;
    }
  });

  return isSuccess;
};

const openProject = (projectName: string) => {
  updatePackageName(projectName);
  const command =
    platform === "win32"
      ? hasCode
        ? `cd ${projectName} && rm -rf .git && rm -rf cli  && npm install && code .`
        : `cd ${projectName} && rm -rf .git && rm -rf cli && start .`
      : hasCode
      ? `cd ${projectName} && rm -rf .git && rm -rf cli && npm install && code .`
      : `cd ${projectName} && rm -rf .git && rm -rf cli && open .`;

  let open = executeCommand(command, `🎉 Project opened successfully. 🚀`);

  if (!open) {
    console.log(`\n🚧 cd ${projectName}\n🔧 npm install\n💻 open .`);
  }
};

const cloneRepository = (projectName: string) => {
  if (!isSameFolderExist(projectName)) {
    executeCommand(
      `git clone ${RUN_EXPRESS_SRC} ./${projectName}`,
      `🎉 Project '${projectName}' cloned successfully! 🚀`
    );
    openProject(projectName);
  } else {
    console.log(
      `❌ Project '${projectName}' already exists. Please choose a different name. 🔄`
    );
  }
};

getInput("🔍 Enter project name: ", (name: string) => {
  cloneRepository(name.trim());
});
