const inquirer = require("./inquirer");
const chalk = require("chalk");
const consts = require("../shared/consts");
// Module that handles responses of commands that arrives from the server.
// The method returns promise for next command.
module.exports = {
	// Handles server's response of `dir` command.
	// @param data {object: folderData {array}, folderPath {string}}.
	dir: ({ data: { folderData, folderPath } }) => {
		let commandMessage;
		const tab = `\t`;
		const depthStageIndent = `${tab}${tab}`;
		const enter = `\n`;
		const noneFileType = " - ";
		const startComment = `Folder: ${folderPath}${enter}Content:`;
		// In case of empty folder.
		if (folderData.length === 0)
			commandMessage = chalk`${startComment}${enter}{red ${consts.FOLDER_IS_EMPTY}}`;
		// Structures the command's result data by `folderData` array.
		else
			commandMessage = folderData.reduce((acc, { type, name, fileType }) => {
				acc += `${enter}${depthStageIndent}${name}${tab}${fileType ||
					noneFileType}${tab}${type}`;
				return acc;
			}, startComment);

		console.log(commandMessage);
		return inquirer.askForNextCommand();
	},
	// Handles server's response of `cd` command.
	cd: () => {
		console.log(chalk`{bold.green OK}`);
		return inquirer.askForNextCommand();
	}
};
