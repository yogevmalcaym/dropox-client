import inquirer from "inquirer";
import * as consts from "../shared/consts.js";

// @param failMessage {string}.
const notEmptyValidation = ({ value, failMessage }) => {
	if (value.length) return true;
	else return failMessage;
};

//Asks next command from the client.
const askNext = () => {
	const questions = [
		{
			name: "command",
			type: "input",
			mask: true,
			message: ":",
			validate: value =>
				notEmptyValidation({
					value,
					failMessage: consts.FOLDER_NAME_NOT_VALID
				})
		}
	];
	return inquirer.prompt(questions);
};

// Exports.
// All the questions stored here.
// The methods returns promises.

// Ask the client for main folder name.
export const askMainFolder = questionsMessage => {
	const questions = [
		{
			name: "mainFolderName",
			type: "input",
			message: questionsMessage,
			validate: value =>
				notEmptyValidation({
					value,
					failMessage: consts.FOLDER_NAME_NOT_EMPTY
				})
		}
	];
	return inquirer.prompt(questions);
};

// Ask if the client own the requested folder.
export const askIfOwn = () => {
	const questions = [
		{
			name: "isClientOwn",
			type: "confirm",
			message: consts.FOLDER_NAME_EXISTS
		}
	];
	return inquirer.prompt(questions);
};

export const askForPassword = () => {
	const questions = [
		{
			name: "clientPassword",
			type: "password",
			mask: true,
			message: "Enter password",
			validate: value =>
				notEmptyValidation({
					value,
					failMessage: consts.PASSWORD_NOT_EMPTY
				})
		}
	];
	return inquirer.prompt(questions);
};

// After client typed wrong password, ask if he want to try again.
export const askIfPasswordAgain = () => {
	const questions = [
		{
			name: "confirmed",
			type: "confirm",
			message: consts.WRONG_PASSWORD
		}
	];
	return inquirer.prompt(questions);
};

// Ask for the next command. returns payload typed 'command'.
export const askForNextCommand = async () => {
	try {
		const { command } = await askNext();
		const [name, ...data] = command.split(" ");
		const payload = { type: "command", name, pdata: data };
		return payload;
	} catch (error) {
		console.error(error);
	}
};
