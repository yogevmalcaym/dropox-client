import chalk from "chalk";

export const WELCOME_MESSAGE =
	"Welcome to Dropox! What folder would you like to work on?";
export const SELECT_ANOTHER_FOLDER = chalk`{red Please select another folder name}`;
export const VALIDATE_SUCCESFULLY = chalk`Validate succesfully, you can start working`;
export const PASSWORD_RESERVED = chalk`{green Password reserved!}\nyou can start working`;
export const FOLDER_CREATED = chalk`{green New folder created for you} please choose a password`;
export const HELP = "For help enter `help`";
export const FOLDER_NAME_NOT_VALID =
	"Please type a valid command, for more information type `help`";
export const FOLDER_NAME_NOT_EMPTY = "Folder name cannot be empty";
export const FOLDER_NAME_EXISTS = "This folder is already exists, you own it?";
export const PASSWORD_NOT_EMPTY = "password cannot be empty";
export const WRONG_PASSWORD = chalk`{bold.red Wrong password.}\nwould you like to try again?`;
export const FOLDER_IS_EMPTY = "This folder is empty";
export const OK = chalk`{bold.green OK}`;
export const SAVED_SUCCESSFULLY = chalk`{green Download done successfully!}`;
export const DISCONNECTED = chalk`{red You are disconnected}`;
export const DOWNLOAD_SUCCESS = chalk`{green Download complete}`;
export const startDownloadLog = path =>
	chalk`{green.bold Start downloading to: ${path}}`;
export const savedSuccessfullyLog = path =>
	chalk`green.bold Saved successfully to ${path}`;
export const downloadErrorLog = message =>
	chalk`red.bold An error occured while saving the file: ${message}`;
