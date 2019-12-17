import path from "path";

// Exports.
// General utility methods.
export const stringToJSON = string => JSON.parse(string);
export const JSONToString = json => JSON.stringify(json);
export const joinPath = (...args) => path.join(...args);
