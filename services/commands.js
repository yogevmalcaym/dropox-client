import chalk from "chalk";
import config from "../config.json";
import * as inquirer from "./inquirer.js";
import * as consts from "../shared/consts.js";
import * as files from "./files.js";
import * as utils from "../shared/utils.js";

// Exports
// Commands handlers that arrives from the server.
// The methods returns promises for next command.

// Handles server's response of `dir` command.
// @param folderData {array}.
// @param folderPath {string}.
// @param extra {boolean}-> optionally.
export const dir = ({ data: { folderData, folderPath, extra } }) => {
	let commandMessage;
	const tab = `\t`;
	const depthStageIndent = `${tab}${tab}`;
	const enter = `\n`;
	const noneFileType = " - ";
	const baseDataFlow = `Data flow: name, file type, file\\dir`;
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
};

// Handles server's response of `cd` command.
export const cd = () => {
	console.log(consts.OK);
	return inquirer.askForNextCommand();
};

// Handles download operation responses.
// @param done {boolean}
// @param socket {net.Socket instance}
export const download = ({ data: { fileName, done }, socket }) => {
	// Returns a promise which will be resolved/rejected once the download stream ends.
	return new Promise((resolve, reject) => {
		// Make sure that the saving folder is exists and create writestream to the required file.
		const localSaveFolderPath = utils.joinPath(
			process.cwd(),
			config.SAVE_FOLDER_NAME
		);
		if (!files.isExists(localSaveFolderPath))
			files.createFolder(localSaveFolderPath);
		const localSaveFilePath = utils.joinPath(localSaveFolderPath, fileName);

		console.log("start saving to " + localSaveFilePath);
		// Creates write stream to the requested file.
		const wstream = files.getWriteStream(localSaveFilePath);
		//mark socket as 'fileStreaming' to prevent from the main 'data' handler try
		socket.fileStreaming = true;
		socket.on("data", container => {
			let data;
			data = container.split("\n");
			data.forEach(lineChunk => {
				const { chunk, done } = utils.stringToJSON(lineChunk);
				if (done) {
					socket.fileStreaming = false;
					wstream.close();
					resolve(inquirer.askForNextCommand());
				} else {
					if (chunk) wstream.write(Buffer.from(chunk));
				}
			});
		});

		wstream.on("finish", () => {
			console.log(consts.SAVED_SUCCESSFULLY);
		});

		// In case of error at the writestream, ask for command form client to continue at the process.
		wstream.on("error", error => {
			console.log(consts.DOWNLOAD_ERROR);
			console.log("[wstream] error - " + error.message);
			socket.streaming = false;
			reject(inquirer.askForNextCommand());
		});
		wstream.on("end", () => {
			console.log("[wstream] - end");
		});
	});
};

// Handles the response for help command.
// @param data {string}
export const help = ({ data }) => {
	console.log(data);
	return inquirer.askForNextCommand();
};
