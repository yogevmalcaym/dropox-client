#!/usr/bin/env node

const path = require('path');
 require("dotenv").config({path: path.resolve(process.cwd(), '.env')});

// const WebSocketClient = require("websocket").client;
// const client = new WebSocketClient();
const net = require("net");
console.log(process.env.REMOTE_PORT)
const socket = net.connect({ port: process.env.REMOTE_PORT, host: process.env.REMOTE_HOST });

const inquirer = require("./services/inquirer");
const utils = require("./shared/utils");
const messageHandlers = require("./services/messageHandlers");

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
// Routing the data to the appropriate function handler by the `type` property.
// Sends back to the server a response if has.
// @param data {string} -> utf8 encoded.
const dataReceivedHandle = async data => {
	console.log("data received: " + data);
	try {
		const { type, ...restArgs } = utils.stringToJSON(data);
		// TODO Change it to be not like this
		if (restArgs.commandName === "download") restArgs.socket = socket;
		const response = await messageHandlers[type](restArgs);
		if (response) socket.write(utils.JSONToString(response));
	} catch (error) {
		console.error(error);
	}
};

socket.on("connect", () => {
	console.log("Connected succesfully, connection: " + socket);
	socket.setEncoding("utf8");
});

socket.on("error", connectionErrorHandle);
socket.on("close", connectionClosedHandle);
socket.on("data", dataReceivedHandle);
socket.on("drain", () => {
	console.log("Buffer is empty");
});
socket.on("ready", init);
