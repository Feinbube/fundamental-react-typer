import { IConstantMap } from "./interfaces";

const typeMap: { [key: string]: string } = {
  "PropTypes\\.func": "anyFunction",
  "PropTypes\\.string": "string",
  "PropTypes\\.bool": "boolean",
  "PropTypes\\.any": "any",
  "PropTypes\\.number": "number",
  "PropTypes\\.node": "React.ReactNode",
  "PropTypes\\.element": "React.ReactNode",
  "PropTypes\\.object": "any",
  "PropTypes\\.instanceOf\\(Date\\)": "Date",
  "PropTypes\\.array": "any[]",
  "CustomPropTypes\\.range\\(.*?\\)": "number"
};

export const propTypesToTypeScript = (
  content: string,
  constants: IConstantMap
) => {
  var result = content;

  result = replaceArrays(result);
  result = replaceShapes(result);
  result = replaceOneOfType(result);
  result = replaceTypes(result);
  result = replaceOneOf(result, constants);
  result = replaceI18n(result);
  result = replaceIsRequired(result);

  return result;
};

const replaceArrays = (result: string): string =>
  result
    .replace(
      /: PropTypes\.arrayOf\(\s*PropTypes\.shape\((.*?)\).isRequired\s*\)/gms,
      (_match, value) => `?: ${value}[]`
    )
    .replace(
      /: PropTypes\.arrayOf\((.*?)\),/gms,
      (_match, value) => `: ${value}[]`
    );

const replaceShapes = (result: string): string =>
  result
    .replace(/: PropTypes\.shape\((.*?)\)/gms, (_match, value) => `?: ${value}`)
    .replace(/PropTypes\.shape\((.*?)\)/gms, (_match, value) => `${value}`);

const replaceOneOfType = (result: string): string =>
  result.replace(
    /: PropTypes\.oneOfType\(\[(.*?)\]\)/gms,
    (_match, value) =>
      `?: ${value
        .split(",")
        .map((x: string) => typeMap[x.replace(".", "\\.").trim()])
        .join(" | ")}`
  );

const replaceTypes = (result: string): string => {
  Object.keys(typeMap).forEach(key => {
    result = result.replace(new RegExp(`: ${key}`, "gm"), `?: ${typeMap[key]}`);
  });
  return result;
};

const replaceOneOf = (result: string, constants: IConstantMap): string =>
  result.replace(
    /: PropTypes\.oneOf\((.*?)\)/gm,
    (_match, value) => `?: ${constants[value].join(" | ")}`
  );

const replaceI18n = (result: string): string =>
  result.replace(
    /: CustomPropTypes\.i18n\({(.*?)}\)/gms,
    (_match, value) => `?: {${value}}`
  );

const replaceIsRequired = (result: string): string =>
  result
    .replace(/\?: (.*?)\.isRequired/gm, (_match, value) => `: ${value}`)
    .replace(/\?: (\{.*?\})\.isRequired/gms, (_match, value) => `: ${value}`)
    .replace(
      /\?: (\{.*?\}\[\])\.isRequired/gms,
      (_match, value) => `: ${value}`
    );
