const inquirer = require("./inquirer");
const chalk = require("chalk");
const consts = require("../shared/consts");
const files = require("./files");
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
	download: ({ data: fileName, socket }) => {
		return new Promise((resolve, reject) => {
			// Make sure that the saving folder is exists and create writestream to the required file.
			const localSaveFolderPath = utils.joinPath(
				process.cwd(),
				process.env.SAVE_FOLDER_NAME
			);
			if (!files.isExists(localSaveFolderPath))
				files.createFolder(localSaveFolderPath);
			const localSaveFilePath = utils.joinPath(localSaveFolderPath, fileName);
			const wstream = files.getWriteStream(localSaveFilePath);

			socket.streaming = true;
			console.log("start saving to " + localSaveFilePath);
			// socket.pipe(wstream);
			// Handles the file data that arrives.
			// @param chunk {string}. (TODO should be Buffer)
			socket.on("data", chunk => {
				console.log("chunk arraived: " + chunk);
				if (chunk === "done") {
					wstream.close();
					console.log(
						chalk`{green Download done successfully, saved to ${localSavePath}}`
					);
					socket.streaming = false;
					resolve(inquirer.askForNextCommand());
				} else {
					wstream.write(chunk);
				}
			});
			// In case of error at the writestream, ask for command form client to continue at the process.
			wstream.on("error", error => {
				console.error(error);
				reject(inquirer.askForNextCommand());
			});
			wstream.on("end", () => {
				console.log("stream end");
			});

			wstream.on("finish", () => {
				socket.streaming = false;
				socket.unpipe(wstream);
				console.log("write stream finished");
			});
			wstream.on("close", () => {
				console.log("Write steam cloased");
			});
		});
	},
	// Handles the response for help command.
	// @param data {string}
	help: ({ data }) => {
		console.log(data);
		return inquirer.askForNextCommand();
	}
};
