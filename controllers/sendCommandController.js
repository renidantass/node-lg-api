import { eventEmitter } from "../services/eventEmitter.js";
import logger from "../logger/index.js";

let commandCounter = 0;

const sendCommandWithoutPayload = (req, res) => {
    const command = req.query.command;
    eventEmitter.once(command, function(response) {
        res.json(response.payload);
    });
    eventEmitter.emit('sendCommand', command);
};

const sendCommandWithPayload = (req, res) => {
    let data = req.body;

    logger.info(JSON.stringify(data));

    let command = {
        'id': data.command,
        'type': 'request',
        'uri': `ssap://${data.command}`,
        'payload': JSON.stringify(data.payload)
    };

    eventEmitter.once(data.command, function(response) {
        res.json(response.payload);
    });

    eventEmitter.emit('sendCommand', command);
    commandCounter++;
};

export default {
    sendCommandWithoutPayload,
    sendCommandWithPayload
};