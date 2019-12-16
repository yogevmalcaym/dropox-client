#!/usr/bin/env node

const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

// const WebSocketClient = require("websocket").client;
// const client = new WebSocketClient();
const net = require("net");
const socket = net.connect({
	port: process.env.REMOTE_PORT,
	host: process.env.REMOTE_HOST
});

const chalk = require("chalk");
const inquirer = require("./services/inquirer");
const utils = require("./shared/utils");
const messageHandlers = require("./services/messageHandlers");
const commands = require("./services/commands");

//Initialize process when the connection is ready to use.
const init = async () => {
	try {
		//Ask the client for wanted main folder.
		const { mainFolderName } = await inquirer.askMainFolder();
		const payload = {
			type: "mainClientFolder",
			folderName: mainFolderName
		};
		const payloadStringified = utils.JSONToString(payload);
		socket.write(payloadStringified);
	} catch (error) {
		console.error(error);
	}
};

const connectionClosedHandle = error => {
	socket.end();
	console.log("Connection Closed");
	if (error) {
		console.log("Error: " + error.toString());
	}
};
const connectionErrorHandle = error => {
	console.log("Error: " + error.toString());
};

socket.on("pipe", src => {
	console.log("someone is piping!");
});

// Routing the data to the appropriate function handler by the `type` property.
// Sends back to the server a payload if has.
// @param data {string}.
const dataReceivedHandle = async data => {
	console.log("data received: " + data);
	if (socket.streaming) return;
	try {
		let payload;
		const { type, errorMessage, ...restProps } = utils.stringToJSON(data);
		// In case of an error, log it and ask for next command.
		if (errorMessage) {
			console.log(chalk`{red ${errorMessage}}`);
			payload = await inquirer.askForNextCommand();
		} else {
			if (type === "command") {
				// Routes commands to their appropriate function handlers.
				const { name, ...restArrivedData } = restProps;
				// TODO Change it to be not like this
				if (name === "download") restArrivedData.socket = socket;
				payload = await commands[name](restArrivedData);
			}
			//If a type property arrived, pass it to the appropriate handler.
			else if (type) {
				payload = await messageHandlers[type](restProps);
			}
		}
		console.log(payload);
		if (payload) socket.write(utils.JSONToString(payload));
	} catch (error) {
		console.error(error);
	}
};

socket.on("connect", () => {
	console.log("Connected succesfully, connection: " + socket);
});

socket.on("error", connectionErrorHandle);
socket.on("close", connectionClosedHandle);
socket.on("end", () => {
	console.log("Socket end");
});
socket.on("finish", () => {
	console.log("socket finish");
});
socket.on("data", dataReceivedHandle);
socket.on("drain", () => {
	console.log("Buffer is empty");
});
socket.on("ready", init);
