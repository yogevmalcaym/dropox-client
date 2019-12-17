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
// @param data {object: folderData {array}, folderPath {string}, extra {boolean}}.
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
export const download = ({ data: fileName, socket }) => {
	return new Promise((resolve, reject) => {
		// Make sure that the saving folder is exists and create writestream to the required file.
		const localSaveFolderPath = utils.joinPath(
			process.cwd(),
			config.SAVE_FOLDER_NAME
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
				console.log(consts.savedSuccesfully(localSaveFolderPath));
				socket.streaming = false;
				resolve(inquirer.askForNextCommand());
			} else {
				wstream.write(chunk);
			}
		});
		// In case of error at the writestream, ask for command form client to continue at the process.
		wstream.on("error", error => {
			console.log(error.message);
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
};

// Handles the response for help command.
// @param data {string}
export const help = ({ data }) => {
	console.log(data);
	return inquirer.askForNextCommand();
};
