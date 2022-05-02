import eventEmitter from "../services/eventEmitter.js";
import logger from "../logger/index.js";

let commandCounter = 0;

const sendCommandWithoutPayload = (req, res) => {
    const command = req.query.command;
    eventEmitter.emit('sendCommand', command);
    commandCounter++;
    res.end(`Command [${command}] sended`);
};

const sendCommandWithPayload = (req, res) => {
    let data = req.body;

    logger.info(JSON.stringify(data));

    let command = {
        'id': 'command_1',
        'type': 'request',
        'uri': `ssap://${data.command}`,
        'payload': JSON.stringify(data.payload)
    };

    eventEmitter.emit('sendCommand', command);
    commandCounter++;
    res.end(`Command [${command}] sended`);
};

export default {
    sendCommandWithoutPayload,
    sendCommandWithPayload
};