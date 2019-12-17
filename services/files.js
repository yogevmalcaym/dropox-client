import fs from "fs";

// Exports.
// Handles any interation with the fs module.
export const isExists = path => fs.existsSync(path);
export const createFolder = path => fs.mkdirSync(path);
export const getWriteStream = path => fs.createWriteStream(path);
