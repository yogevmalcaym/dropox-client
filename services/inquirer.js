const inquirer = require("inquirer");

// A simple validation that the input is not empty.
// @param failMessage {string}.
const notEmptyValidation = ({ value, failMessage }) => {
	if (value.length) return true;
	else return failMessage;
};

module.exports = {
	askMainFolder: (questionsMessage) => {
		const questions = [
			{
				name: "mainFolderName",
				type: "input",
				message: questionsMessage,
				validate: value =>
					notEmptyValidation({
						value,
						failMessage: "Folder name cannot be empty"
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
				message: "This folder is already exists, you own it?"
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
						failMessage: "password cannot be empty"
					})
			}
		];
		return inquirer.prompt(questions);
	},
	//Asks for the next commant from the client.
	askNext: () => {
		const questions = [
			{
				name: "command",
				type: "input",
				mask: true,
				message: ":",
				validate: value =>
					notEmptyValidation({
						value,
						failMessage:
							"Please type a valid command, for more information type `help`"
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
				message:
					"This is not the appropriate password for this folder. whould you like to try again?"
			}
		];
		return inquirer.prompt(questions);
	}
};
