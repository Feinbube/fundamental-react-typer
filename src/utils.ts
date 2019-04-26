export const removeTrailingComma = (text: string) =>
  text.endsWith(",") ? text.slice(0, -1) : text;
