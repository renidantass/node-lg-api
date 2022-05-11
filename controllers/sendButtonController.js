import wol from "wol";
import { eventEmitter } from "../services/eventEmitter.js";
import socket_wrapper from "../services/websocket.js";
import logger from "../logger/index.js";

const sendButton = (req, res) => {
    const button = req.query.keyName;
    eventEmitter.emit('sendButton', button);
    res.json({ 'message': `Button sended ${button}` });
};

const toggleOnOff = (req, res) => {
    wol.wake(socket_wrapper.mac, function (err, result) {
        logger.info(`Response received [${result}]`);
        res.json({ 'message': `Response received [${result}]` });
    })
};

export default {
    sendButton,
    toggleOnOff
};