import express from 'express';
import 'express-group-routes';
import bodyParser from 'body-parser';
import discoverService from './services/discover.js';
import socket_wrapper from './services/websocket.js';
import lg_handshaker from './services/lg_handshaker.js';
import eventEmitter from './services/eventEmitter.js';
import logger from './logger/index.js';
import sendCommandController from './controllers/sendCommandController.js';

const app = express();

app.use(bodyParser.json());

const device = {ip: '192.168.15.61'}

socket_wrapper.configure(lg_handshaker);
await socket_wrapper.init(`ws://${device.ip}:3000`);

eventEmitter.on('ws_ready_to_send_command', async function(response) {
    if(response) {
        eventEmitter.on('sendCommand', async function(command) {
            logger.info(`Sending command ${JSON.stringify(command)}`);

            if(typeof command !== 'object') {
                command = {
                    'id': 'command_1',
                    'type': 'request',
                    'uri': `ssap://${command}`,
                };
            }
            
            await socket_wrapper.send(JSON.stringify(command));
        });

        socket_wrapper.initPointerSocket();
    }
})


app.group('/command', (router) => {
    router.get('/', sendCommandController.sendCommandWithoutPayload);
    router.post('/', sendCommandController.sendCommandWithPayload);
})

app.listen(3000, function() {
    logger.info('🚀 API is running 🚀');
});

process.on('SIGINT', async () => {
    await discover.LGTV().shutdown();
    socket_wrapper.closePointerSocket();
});