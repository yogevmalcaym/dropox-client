import chalk from "chalk";
import config from "../config.json";
import * as inquirer from "./inquirer.js";
import * as consts from "../shared/consts.js";
import * as files from "../shared/files.js";
import * as utils from "../shared/utils.js";

import net from 'net';
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
// @param localFilePath {string}
// @param currentFolderPath {string}
export const download = ({ data: { localFilePath, currentFolderPath } }) => {
	const localSaveFolderPath = utils.joinPath(
		process.cwd(),
		config.SAVE_FOLDER_NAME,
		currentFolderPath
	);
	const [fileName, innerPath] = utils.splitStringEndAndRest(localFilePath, "/");
	const fullInnerFolderPath = utils.joinPath(localSaveFolderPath, innerPath);
	// Make sure the the requested folder path exists.
	files.createFolder(fullInnerFolderPath, true);

	const localSaveFilePath = utils.joinPath(fullInnerFolderPath, fileName);
	console.log(consts.startDownloadLog(localSaveFilePath));
	const wstream = files.getWriteStream(localSaveFilePath);
	const fileStream = net.connect({
		port: 8081,
		host: config.REMOTE_HOST
	});
	// This payload let the Downloader details to start download.
	const startPayload = { localFilePath, currentFolderPath };
	fileStream.write(utils.toString(startPayload));

	fileStream.pipe(wstream);
	
	fileStream.on('close',(hadError)=>{
if (!hadError) console.log(consts.DOWNLOAD_SUCCESS)
	})
	wstream.on("error", error => {
		console.log(consts.downloadErrorLog(error.message));
	});

	fileStream.on("error", error => {
		console.log(consts.downloadErrorLog(error.message));
	});

	return inquirer.askForNextCommand();
};

// Handles the response for help command.
// @param data {string}
export const help = ({ data }) => {
	console.log(data);
	return inquirer.askForNextCommand();
};
