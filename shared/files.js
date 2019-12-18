import fs from "fs";

// Exports.
// Handles any interation with the fs module.
export const isExists = path => fs.existsSync(path);
// Creates new folder. 
// @param path {string}.
// @param {recursive} boolean -> optionally.
export const createFolder = (path, recursive) =>
	fs.mkdirSync(path, { recursive: recursive });
export const getWriteStream = path => fs.createWriteStream(path);
