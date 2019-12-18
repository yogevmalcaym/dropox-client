#!/usr/bin/env node

import net from "net";
import config from "./config.json";
import chalk from "chalk";
import * as inquirer from "./services/inquirer.js";
import * as utils from "./shared/utils.js";
import * as acquaintance from "./services/acquaintance.js";
import * as commands from "./services/commands.js";
import * as consts from "./shared/consts.js";

// Connect to server.
const socket = net.connect({
	port: config.REMOTE_PORT,
	host: config.REMOTE_HOST
});

//Initialize process when the connection is ready to use.
const init = async () => {
	try {
		const response = await acquaintance.getMainFolderName(
			consts.WELCOME_MESSAGE
		);
		const payload = { ...response, type: "acquaintance" };

		socket.write(utils.toString(payload));
	} catch (error) {
		console.log(error.message);
	}
};

// Routing the data to the appropriate function handler by the `type` property.
// Sends back to the server a payload if has.
// @param data {Buffer}.
const dataReceivedHandle = async data => {
	try {
		let payload;
		const { type, name, errorMessage, ...restProps } = utils.toJSON(data);
		// In case of an error received, log it and ask for next command.
		if (errorMessage) {
			console.log(chalk`{red ${errorMessage}}`);
			payload = await inquirer.askForNextCommand();
		} else {
			// payloads which typed 'command' should activate thier appropriate function in 'commands' module.
			if (type === "command") {
				// Routes commands to their appropriate function handlers.
				payload = await commands[name](restProps);
			}
			// payloads which typed 'acquaintance' should activate thier appropriate function in 'acquaintance' module.
			if (type === "acquaintance") {
				const basePayload = await acquaintance[name](restProps);
				// The 'type' property might return from  an acquaintance method as 'command'.
				payload = basePayload.type ? basePayload : { ...basePayload, type };
			}
		}
		// Writes to the socket connection in case there is a payload.
		if (payload) socket.write(utils.toString(payload));
	} catch (error) {
		console.log("error: " + error.message);
	}
};

// socket's 'close' event handler.
const connectionClosedHandle = () => console.log(consts.DISCONNECTED);

// socket's 'error' event handler.
const connectionErrorHandle = error =>
	console.log(chalk`{red ${error.message}}`);

// socket connection event listeners.
socket.on("error", connectionErrorHandle);
socket.on("close", connectionClosedHandle);
socket.on("data", dataReceivedHandle);
socket.on("ready", init);
