const inquirer = require("inquirer");
const consts = require("../shared/consts");

// A simple validation that the input is not empty.
// @param failMessage {string}.
const notEmptyValidation = ({ value, failMessage }) => {
	if (value.length) return true;
	else return failMessage;
};

//Asks for the next commant from the client.
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

// Module that holds the questions.
// The methods returns promises.
module.exports = {
	askMainFolder: questionsMessage => {
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
	},
	askIfOwn: () => {
		const questions = [
			{
				name: "isClientOwn",
				type: "confirm",
				message: consts.FOLDER_NAME_EXISTS
			}
		];
		return inquirer.prompt(questions);
	},
	askForPassword: () => {
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
	},
	askIfPasswordAgain: () => {
		const questions = [
			{
				name: "confirmed",
				type: "confirm",
				message: consts.WRONG_PASSWORD
			}
		];
		return inquirer.prompt(questions);
	},
	// Ask for the next command. returns payload typed 'command'.
	askForNextCommand: async () => {
		try {
			const { command } = await askNext();
			const [name, data] = command.split(" ");
			const commandData = { name, data };
			const payload = { type: "command", commandData };
			return payload;
		} catch (error) {
			console.error(error);
		}
	}
};
