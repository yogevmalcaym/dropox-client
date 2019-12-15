const inquirer = require("./inquirer");
const chalk = require("chalk");
const consts = require("../shared/consts");
const writeStream = require("./writeStream");
const utils = require("../shared/utils");

// Module that handles responses of commands that arrives from the server.
// The method returns promise for next command.
module.exports = {
	// Handles server's response of `dir` command.
	// @param data {object: folderData {array}, folderPath {string}, extra {boolean}}.
	dir: ({ data: { folderData, folderPath, extra } }) => {
		let commandMessage;
		const tab = `\t`;
		const depthStageIndent = `${tab}${tab}`;
		const enter = `\n`;
		const noneFileType = " - ";
		const baseDataFlow = `name, file type, file\\dir`;
		const extraDataFlow = `${baseDataFlow}, size(bytes), downloads count, creation time `;
		const dataFlow = extra ? extraDataFlow : baseDataFlow;
		const startComment = `Folder: ${folderPath}${enter}${dataFlow}${enter}Content:`;
		// In case of empty folder.
		if (folderData.length === 0)
			commandMessage = chalk`${startComment}${enter}{red ${consts.FOLDER_IS_EMPTY}}`;
		// Structures the command's result data by `folderData` array.
		else
			commandMessage = folderData.reduce(
				(acc, { type, name, fileType, size, downloadsCount, ctime }) => {
					acc += `${enter}${depthStageIndent}${name}${tab}${fileType ||
						noneFileType}${tab}${type}${
						extra && fileType
							? `${tab}${size}${tab}${downloadsCount}${tab}${ctime}`
							: ""
					}`;
					return acc;
				},
				startComment
			);

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
			process.env.SAVE_FOLDER_NAME
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
	},
	// Handles the response for help command. 
	// @param data {string}
	help: ({ data }) => {
		console.log(data);
		return inquirer.askForNextCommand();
	}
};
