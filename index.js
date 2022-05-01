import discoverService from './services/discover.js';
import socket_wrapper from './services/websocket.js';
import lg_handshaker from './services/lg_handshaker.js';
import logger from './logger/index.js';
import eventEmitter from './services/eventEmitter.js';

const device = {ip: '192.168.15.61'}

socket_wrapper.configure(lg_handshaker);
await socket_wrapper.init(`ws://${device.ip}:3000`);

eventEmitter.on('ws_ready_to_send_command', async function(response) {

    if(response) {
        console.log('Ready to send commands');
        const command = {
            'id': 'command_1',
            'type': 'request',
            'uri': 'ssap://audio/getVolume',
        };
        
        await socket_wrapper.send(JSON.stringify(command));
    }

})


process.on('SIGINT', async () => {
    await discover.LGTV().shutdown();
});