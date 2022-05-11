import express from 'express';
import 'express-group-routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import arp from 'node-arp'
import discoverService from './services/discover.js';
import socket_wrapper from './services/websocket.js';
import lg_handshaker from './services/lg_handshaker.js';
import { listenForCommands } from './services/eventEmitter.js';
import logger from './logger/index.js';
import sendCommandController from './controllers/sendCommandController.js';
import sendButtonController from './controllers/sendButtonController.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const device = {ip: '192.168.15.61'}

socket_wrapper.configure(lg_handshaker);
await socket_wrapper.init(`ws://${device.ip}:3000`)
await listenForCommands();

arp.getMAC(device.ip, function(err, mac) {
    if(!err) {
        socket_wrapper.mac = mac;
    }
})

app.group('/command', (router) => {
    router.get('/', sendCommandController.sendCommandWithoutPayload);
    router.post('/', sendCommandController.sendCommandWithPayload);
});

app.group('/button', (router) => {
    router.get('/', sendButtonController.sendButton);
    router.get('/toggleOnOff', sendButtonController.toggleOnOff);
});

app.listen(3000, function() {
    logger.info('🚀 API is running 🚀');
});

process.on('SIGINT', async () => {
    await discover.LGTV().shutdown();
    socket_wrapper.closePointerSocket();
});