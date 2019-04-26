# fundamental-react-typer

This tool creates a Typescript type definition from the *fundamental-react* sources.

In order to make this work you have to update the `fundamental_react_src_folder` in `src/index.ts` to point to the `src` folder of the *fundamental-react* clone you want to type:

```
const fundamental_react_src_folder =
  "./fundamental-react-sources/fundamental-react-0.5.1/src";
```

Just run the start script afterwards (either using `npm start` or `yarn`):

```
yarn
yarn start
```

This will create a `fundamental-react.d.ts` in the root folder.

**Since the file will be quite messy, please run a auto-fixing linter over it.**