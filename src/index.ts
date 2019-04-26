import fs from "fs";
import { parseFiles } from "./src-parser";
import { loadConstants, loadFiles } from "./src-reader";
import { createTypeDef } from "./typedef-creator";

const fundamental_react_src_folder =
  "./fundamental-react-sources/fundamental-react-0.5.1/src";

const main = () => {
  const constants = loadConstants(fundamental_react_src_folder);
  const files = loadFiles(fundamental_react_src_folder);

  const components = parseFiles(files);

  const typeDef = createTypeDef("fundamental-react", components, constants);

  fs.writeFileSync("fundamental-react.d.ts", typeDef);
};

main();
