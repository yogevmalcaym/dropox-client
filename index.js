#!/usr/bin/env node

import net from "net";
import config from "./config.json";

// Connect to server.
const socket = net.connect({
	port: config.REMOTE_PORT,
	host: config.REMOTE_HOST
});

import chalk from "chalk";
import * as inquirer from "./services/inquirer.js";
import * as utils from "./shared/utils.js";
import * as acquaintance from "./services/acquaintance.js";
import * as commands from "./services/commands.js";
import * as consts from "./shared/consts.js";

//Initialize process when the connection is ready to use.
const init = async () => {
	try {
		const response = await acquaintance.getMainFolderName(
			consts.WELCOME_MESSAGE
		);
		const payload = { ...response, type: "acquaintance" };

		socket.write(utils.JSONToString(payload));
	} catch (error) {
		console.error(error);
	}
};

// Routing the data to the appropriate function handler by the `type` property.
// Sends back to the server a payload if has.
// @param data {string}.
const dataReceivedHandle = async data => {
	console.log("data received: " + data);
	//TODO dont forget it when fixing download operation
	if (socket.streaming) return;
	try {
		let payload;
		const { type, name, errorMessage, ...restProps } = utils.stringToJSON(data);
		console.log(restProps);
		// In case of an error received, log it and ask for next command.
		if (errorMessage) {
			console.log(chalk`{red ${errorMessage}}`);
			payload = await inquirer.askForNextCommand();
		} else {
			// payloads which typed 'command' should activate thier appropriate function in 'commands' module.
			if (type === "command") {
				// Routes commands to their appropriate function handlers.
				const { ...restArrivedData } = restProps;
				// TODO Change it to be not like this
				if (name === "download") restArrivedData.socket = socket;
				payload = await commands[name](restArrivedData);
			}
			//If a type property arrived, pass it to the appropriate handler.
			if (type === "acquaintance") {
				const basePayload = await acquaintance[name](restProps);
				// The 'type' property might return from  an acquaintance method as 'command'.
				payload = basePayload.type ? basePayload : { ...basePayload, type };
			}
		}
		// Writes to the socket connection in case there is a payload.
		if (payload) socket.write(utils.JSONToString(payload));
	} catch (error) {
		console.error(error);
	}
};
const connectionClosedHandle = () => console.log("Connection Closed");
const connectionErrorHandle = error =>
	console.log("Error: " + error.toString());

// socket connection event listeners.
socket.on("error", connectionErrorHandle);
socket.on("close", connectionClosedHandle);
socket.on("data", dataReceivedHandle);
socket.on("ready", init);
