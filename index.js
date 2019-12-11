#!/usr/bin/env node

const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();

const inquirer = require('./lib/inquirer');

//Websocket events handlers
const errorHandle = error => {
    console.log('Connect Error: ' + error.toString());
};
const connectionClosedHandle = () => {
    console.log('Connection Closed');
};
const messageReceivedHandle = message => {
    console.log("message received: " + message.utf8Data);
};

client.on('connectFailed', errorHandle);

client.on('connect', async connection => {
    console.log('WebSocket Client Connected');
    connection.on('error', errorHandle);
    connection.on('close', connectionClosedHandle);
    connection.on('message', messageReceivedHandle);

    //Get the user's name
    const {username} = await inquirer.askForName();

    //Let the server know that we are connected.
    if (connection.connected)
        connection.sendUTF(username);

});

client.connect('ws://localhost:8080/', 'echo-protocol');