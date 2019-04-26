import { IComponent, IConstantMap } from "./interfaces";
import { propTypesToTypeScript } from "./proptypes-to-typescript";

// EXPORTS #####################################################################

export const createTypeDef = (
  name: string,
  components: IComponent[],
  constants: IConstantMap
): string =>
  fillModuleTemplate(
    name,
    linkParentsToChildren(components).map(c =>
      fillClassTemplate(
        c.name,
        propTypesToTypeScript(c.content, constants),
        c.bodyContent
      )
    )
  );

// TEMPLATES ###################################################################

const fillModuleTemplate = (name: string, list: string[]): string => `
declare module "${name}" {
  import React from 'react';

  type anyFunction = (...args: any[]) => any;

${list.join("\n\n")}
}
`;

const fillClassTemplate = (
  name: string,
  content: string,
  bodyContent: string
): string => `
  export class ${name} extends React.Component<{
    [key: string]: any,
    style?: React.CSSProperties;
    ${content}
  }>{
    ${bodyContent}
  };
`;

const fillLinkTemplate = (name: string, displayName: string) => `
  static ${displayName.slice(
    displayName.indexOf(".") + 1
  )}: typeof ${name} = ${name};`;

// HELPERS #####################################################################

const findParentComponent = (components: IComponent[], displayName: string) =>
  components.find(
    x => x.displayName === displayName.slice(0, displayName.indexOf("."))
  );

// create static Item: typeof MenuItem = MenuItem;
// in extension part of the parent class
const linkParentsToChildren = (components: IComponent[]): IComponent[] => {
  components
    .filter(c => c.displayName.indexOf(".") !== -1)
    .forEach(c => {
      const parent = findParentComponent(components, c.displayName);
      if (parent) parent.bodyContent += fillLinkTemplate(c.name, c.displayName);
      else throw new Error(`Parent for ${c.displayName} not found!`);
    });
  return components;
};
