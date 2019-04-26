import fs from "fs";
import * as _ from "lodash";
import { IConstantMap, IFile } from "./interfaces";
import { removeTrailingComma } from "./utils";

// EXPORTS #####################################################################

// extract component information from index.js and source folders
export const loadFiles = (fundamental_react_src_folder: string): IFile[] => {
  const components = [
    ...getComponentListFromIndex(fundamental_react_src_folder),
    ...getAdditionalComponentsFromFolders(fundamental_react_src_folder)
  ];

  // load file contents
  const contents = components.map(c =>
    fs.readFileSync(`${fundamental_react_src_folder}/${c.file}.js`, "utf-8")
  );

  // result
  return components.map((c, i) => ({
    name: c.name,
    content: contents[i]
  }));
};

// extract constant lists from constants.js
export const loadConstants = (
  fundamental_react_src_folder: string
): IConstantMap => {
  const result: IConstantMap = {};

  const constantsFile = fs.readFileSync(
    `${fundamental_react_src_folder}/utils/constants.js`,
    "utf-8"
  );
  const regex = /export const (.*?) = \[(.*?)\];/gms;

  let match;
  while ((match = regex.exec(constantsFile)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    if (match) {
      const key = match[1];
      const constantList = match[2]
        .split("\n")
        .map(x => removeTrailingComma(x.trim()))
        .filter(Boolean);
      result[key] = constantList;
    }
  }
  return result;
};

// HELPERS #####################################################################

// extract component name and file path for each entry in index.js
const getComponentListFromIndex = (
  fundamental_react_src_folder: string
): { name: string; file: string }[] =>
  fs
    .readFileSync(`${fundamental_react_src_folder}/index.js`, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(x => {
      const match = /as (.*?) } from '(.*?)';/gm.exec(x);
      return match ? { name: match[1], file: match[2] } : undefined;
    })
    .filter(Boolean) as { name: string; file: string }[];

// add additional Files: e.g. src/ActionBar/_ActionBarActions.js
const getAdditionalComponentsFromFolders = (
  fundamental_react_src_folder: string
): { name: string; file: string }[] => {
  const componentsPerFolder = fs
    .readdirSync(`${fundamental_react_src_folder}`)
    .map((folder: string) =>
      folder.indexOf(".js") === -1
        ? getAdditionalComponentsFromFolder(
            fundamental_react_src_folder,
            folder
          )
        : undefined
    )
    .filter(Boolean) as { name: string; file: string }[][];
  return _.flatten(componentsPerFolder);
};

const getAdditionalComponentsFromFolder = (
  fundamental_react_src_folder: string,
  folder: string
): { name: string; file: string }[] =>
  fs
    .readdirSync(`${fundamental_react_src_folder}/${folder}`)
    .map(file =>
      file.indexOf("_") === 0 &&
      file.indexOf(".js") !== -1 &&
      file.indexOf(".test.js") === -1
        ? {
            name: file.slice(1, file.length - 3),
            file: `${folder}/${file.slice(0, file.length - 3)}`
          }
        : undefined
    )
    .filter(Boolean) as { name: string; file: string }[];
