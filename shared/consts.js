import chalk from "chalk";

export const WELCOME_MESSAGE =
	"Welcome to Dropox! What folder would you like to work on?";
export const SELECT_ANOTHER_FOLDER = "Please select another folder name";
export const VALIDATE_SUCCESFULLY =
	"Validate succesfully, you can start working";
export const PASSWORD_RESERVED = "Password reserved! you can start working";
export const FOLDER_CREATED =
	"New folder created for you, please choose a password";
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
export const DOWNLOAD_ERROR = chalk`{red An error occured while downloading. there migh be missing data.}`
