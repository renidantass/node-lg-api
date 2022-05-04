import eventEmitter from "../services/eventEmitter.js";
import logger from "../logger/index.js";

const sendButton = (req, res) => {
    const button = req.query.keyName;
    eventEmitter.emit('sendButton', button);
    res.json({ 'message': `Button sended ${button}` });
};

const toggleOnOff = (req, res) => {
    const command = req.query.command;
    eventEmitter.emit('sendCommand', command);
    res.json({ 'message': `Toggled` });
};

export default {
    sendButton,
    toggleOnOff
};