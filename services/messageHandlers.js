const inquirer = require("./inquirer");
const chalk = require("chalk");
const consts = require("../shared/consts");

const getPasswordFromClient = async () => {
	try {
		const { clientPassword } = await inquirer.askForPassword();
		const payload = { type: "validatePasswordByFolder", clientPassword };
		return payload;
	} catch (error) {
		console.error(error);
	}
};

// Ask for the main folder name from client.
// @param question {string}
const getMainFolderName = async question => {
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

// Log to the client that he connected sucessfully.
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
					const payload = getPasswordFromClient();
					if (payload) return payload;
				} else {
					console.log(chalk.red(consts.SELECT_ANOTHER_FOLDER));
					const payload = getMainFolderName(consts.WELCOME_MESSAGE);
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
		return inquirer.askForNextCommand();
	},

	//Response after validation check.
	validationRespond: async ({ isValid }) => {
		try {
			if (isValid) {
				startWorkingLog(consts.VALIDATE_SUCCESFULLY);
				return inquirer.askForNextCommand();
			} else {
				const { confirmed } = await inquirer.askForPasswordAgain();
				if (confirmed) return getPasswordFromClient();
				else return getMainFolderName(consts.SELECT_ANOTHER_FOLDER);
			}
		} catch (error) {
			console.error(error);
		}
	}
};
