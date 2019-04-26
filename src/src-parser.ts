import { IComponent, IFile } from "./interfaces";

interface IPropTypes {
  name: string;
  propTypeContent: string;
}

// EXPORTS #####################################################################

export const parseFiles = (files: IFile[]): IComponent[] => {
  const basePropTypes = files
    .map(f => getPropTypes("basePropTypes", f.content))
    .filter(Boolean) as IPropTypes[];
  return files.map(f => ({
    name: f.name,
    displayName: parseName(f.name, f.content),
    content: parseContent(f.content, basePropTypes),
    bodyContent: ""
  }));
};

// HELPERS #####################################################################

// find and return "basePropTypes" or "propTypes"
const getPropTypes = (
  propTypesString: "basePropTypes" | "propTypes",
  content: string
) => {
  const match = new RegExp(
    `([A-Za-z]*?).${propTypesString} = {(.*?)};`,
    "gms"
  ).exec(content);
  return match ? { name: match[1], propTypeContent: match[2] } : null;
};

// basePropTypes look like this: ...Calendar.basePropTypes,
// => will be replaced here
const injectBaseTypes = (
  propTypeContent: string,
  basePropTypes: IPropTypes[]
): string =>
  propTypeContent.replace(/\.\.\.(.*?)\.basePropTypes/gm, (_match, name) => {
    const matchingBaseProp = basePropTypes.find(x => x.name === name);
    if (matchingBaseProp) return matchingBaseProp.propTypeContent;
    else throw new Error(`${name} not found!`);
  });

// all files contain propTypes, some also contain basePropTypes (e.g. Calendar)
const parseContent = (content: string, basePropTypes: IPropTypes[]): string => {
  const propTypes = getPropTypes("propTypes", content);
  return propTypes
    ? injectBaseTypes(propTypes.propTypeContent, basePropTypes)
    : "";
};

// MenuItem.displayName = 'Menu.Item'; => "Menu.Item"
const parseName = (filename: string, content: string): string => {
  const match = new RegExp(`${filename}\.displayName = '(.*?)'`, "gm").exec(
    content
  );
  if (!match) {
    console.log(`WARNING: No displayName found for ${filename}.`);
  }
  return match ? match[1] : filename;
};
