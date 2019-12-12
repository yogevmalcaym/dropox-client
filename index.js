#!/usr/bin/env node

const WebSocketClient = require("websocket").client;
const client = new WebSocketClient();

const inquirer = require("./services/inquirer");
const utils = require("./shared/utils");
const messageHandlers = require("./services/messageHandlers");

//Websocket events handlers
const errorHandle = error => {
	console.log("Connection Error: " + error.toString());
};
const connectionClosedHandle = () => {
	console.log("Connection Closed");
};

// Routing the message to the appropriate function handler by the `type` property.
// Sends back to the server a response if has.
// @param message {object} -> should contain `utf8Data` property.
const messageReceivedHandle = async ({ message, connection }) => {
	try {
		const { type, ...restArgs } = utils.stringToJSON(message.utf8Data);
		const response = await messageHandlers[type](restArgs);
		if (response) connection.sendUTF(utils.JSONToString(response));
	} catch (error) {
		console.error(error);
	}
	console.log("message received: " + message.utf8Data);
};

client.on("connectFailed", errorHandle);

client.on("connect", connection => {
	connection.on("error", errorHandle);
	connection.on("close", connectionClosedHandle);
	connection.on("message", message =>
		messageReceivedHandle({ message, connection })
	);

	//Start procces after connected
	(async () => {
		try {
			//Get the folder name asked by the client
			const { mainFolderName } = await inquirer.askMainFolder();

			if (connection.connected) {
				const payload = {
					type: "mainClientFolder",
					folderName: mainFolderName
				};
				const payloadStringified = utils.JSONToString(payload);
				connection.sendUTF(payloadStringified);
			}
		} catch (error) {
			console.error(error);
		}
	})();
});

client.connect("ws://localhost:8080/", "echo-protocol");
