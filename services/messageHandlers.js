const inquirer = require("./inquirer");
const chalk = require("chalk");

const commands = require("./commands");
const consts = require("../shared/consts");

const askForNextCommand = async () => {
	try {
		const { command } = await inquirer.askNext();
		const [commandName, ...commandDataSplitted] = command.split(" ");
		const commandData = { name: commandName, data: commandDataSplitted };
		const payload = { type: "command", commandData };
		return payload;
	} catch (error) {
		console.error(error);
	}
};

const askClientForPassword = async () => {
	try {
		const { clientPassword } = await inquirer.askForPassword();
		const payload = { type: "validatePasswordByFolder", clientPassword };
		return payload;
	} catch (error) {
		console.error(error);
	}
};

const askForMainClientFolder = async question => {
	try {
		const { mainFolderName } = await inquirer.askMainFolder(question);
		const payload = {
			type: "mainClientFolder",
			folderName: mainFolderName
		};
		return payload;
	} catch (error) {
		console.error(error);
	}
};

const startWorkingLog = successMessage => {
	console.log(chalk.green(successMessage));
	console.log(consts.HELP);
};

//This module handles all the messages that arrive from the server and returns an appropriate payload object.
//payload allways consist from `type` property and optionally additional properties.
module.exports = {
	// Folder name that have chosen by the client already exists.
	// @param isExists {boolean}.
	mainFolderExistance: async ({ isExists }) => {
		try {
			if (isExists) {
				const { isClientOwn } = await inquirer.askIfOwn();
				if (isClientOwn) {
					const payload = askClientForPassword();
					if (payload) return payload;
				} else {
					console.log(chalk.red(consts.SELECT_ANOTHER_FOLDER));
					const payload = askForMainClientFolder(consts.WELCOME_MESSAGE);
					if (payload) return payload;
				}
			}
		} catch (error) {
			console.error(error);
		}
	},

	//New folder created for the client at the server.
	clientFolderCreated: async () => {
		try {
			console.log(chalk.green(consts.FOLDER_CREATED));
			const { clientPassword } = await inquirer.askForPassword();
			const payload = {
				type: "newClientPassword",
				clientPassword
			};
			return payload;
		} catch (error) {
			console.error(error);
		}
	},

	//New folder password reserved succesfully.
	passwordReserved: () => {
		startWorkingLog(consts.PASSWORD_RESERVED);
		const payload = askForNextCommand();
		if (payload) return payload;
	},

	//Response after validation check.
	validationRespond: async ({ isValidate }) => {
		try {
			if (isValidate) {
				startWorkingLog(consts.VALIDATE_SUCCESFULLY);
				const payload = askForNextCommand();
				if (payload) return payload;
			} else {
				const { confirmed } = await inquirer.askForPasswordAgain();
				if (confirmed) {
					const payload = askClientForPassword();
					if (payload) return payload;
				} else {
					const payload = askForMainClientFolder(consts.SELECT_ANOTHER_FOLDER);
					if (payload) return payload;
				}
			}
		} catch (error) {
			console.error(error);
		}
	},

	//Routes command responces to their appropriate function handlers.
	commandResponse: ({ name, ...restResponseData }) => {
		//For continues commands, the response should contain the 'type' property.
		const response = commands[name](restResponseData);
		if (response) return response;
	}
};
