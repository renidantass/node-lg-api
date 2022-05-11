import { EventEmitter } from 'events';
import socket_wrapper from './websocket.js';
import logger from '../logger/index.js';

const eventEmitter = new EventEmitter();

const listenForCommands = async() => {
    eventEmitter.on('ws_ready_to_send_command', async function(response) {
        if(response) {
            eventEmitter.on('sendCommand', async function(command) {
                logger.info(`Sending command ${JSON.stringify(command)}`);
    
                if(typeof command !== 'object') {
                    command = {
                        'id': command,
                        'type': 'request',
                        'uri': `ssap://${command}`,
                    };
                }
                
                await socket_wrapper.send(JSON.stringify(command));
            });
    
            eventEmitter.on('sendButton', async function(button) {
                logger.info(`Sending button ${button}`);
                
                await socket_wrapper.sendButton(button);
            });
    
            socket_wrapper.initPointerSocket();
        }
    })
}

export { 
    eventEmitter,
    listenForCommands
 };