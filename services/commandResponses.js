const inquirer = require("./inquirer");
const chalk = require("chalk");
const consts = require("../shared/consts");
const writeStream = require("./writeStream");
const utils = require("../shared/utils");
const config = require("../config.json");

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
	},
	// Handles download operation responses.
	// @param done {boolean}
	// @param socket {net.Socket instance}
	download: ({ data: { done } = {}, socket }) => {
		// Gets the path to save the file
		const localSavePath = utils.joinPath(
			process.cwd(),
			config.localSaveFolderPath
		);
		//TODO make it done by the writeable stream instead by the writable
		// When the server done reading the file it sends payload with `done` set to true.
		if (done) {
			console.log(
				chalk`{green Download done successfully, saved to ${localSavePath}}`
			);
			return inquirer.askForNextCommand();
		}
		//TODO make sure that this stream is closed or at least not causes a memory leak
		const wstream = writeStream(localSavePath);
		socket.pipe(wstream);
		// wstream.close();
		// wstream.on("end", () => {
		// 	console.log("end");
		// });
		// wstream.on("close", () => {
		// 	console.log("Stream closed");
		// });
		wstream.on("error", error => {
			console.error(error);
		});
	}
};
