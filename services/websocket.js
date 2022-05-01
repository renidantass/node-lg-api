import eventEmitter from './eventEmitter.js';
import WebSocket from 'ws';
import storage from "node-persist";
import logger from '../logger/index.js';
import utils from '../utils/index.js';

await storage.init();

const socket_wrapper = {
    instance: null,
    isConnected: null,
    configure: (options) => {
        const { getHandshake, makeHandshake } = options;
        socket_wrapper.getHandshake = getHandshake;
        socket_wrapper.makeHandshake = makeHandshake;
    },
    getHandshake: () => {},
    makeHandshake: () => {},
    listenRegister: () => {
        const event = 'register_0';
        eventEmitter.on(event, async function(message) {
            logger.info(`Response received from register device ${JSON.stringify(message)}`);
        
            const clientKey = message.payload['client-key'];
            
            if(typeof clientKey === 'undefined') {
                logger.error('Client key undefined');
            }

            await storage.setItem('clientKey', clientKey);
            eventEmitter.emit('ws_ready_to_send_command', true);
        });
    },
    setConnectionStatus: (status) => {
        if(typeof status !== 'boolean') {
            return;
        }

        if(status !== socket_wrapper.isConnected) {
            socket_wrapper.isConnected = status;
        }

        return socket_wrapper;
    },
    init: async(host) => {
        socket_wrapper.instance = new WebSocket(host);

        await socket_wrapper.listenRegister();

        socket_wrapper.instance.onerror = (event) => {
            const error = event.data;
            socket_wrapper.setConnectionStatus(false);
            logger.error(`socket_wrapper:onerror error raised, connection error [${error}`);
        };
        socket_wrapper.instance.onopen = async(event) => {
            await socket_wrapper.makeHandshake(socket_wrapper.instance);
            socket_wrapper.setConnectionStatus(true);
            logger.info(`Connected to: [${host}]`);
        };
        socket_wrapper.instance.onclose = (event) => {
            socket_wrapper.setConnectionStatus(false);
            logger.info('socket_wrapper:onclose called, connection closed');
        };
        socket_wrapper.instance.onmessage = (event) => {
            const message = event.data;
            const command = JSON.parse(message);
            logger.info(`socket_wrapper:onmessage, message received [${message}]`);
            eventEmitter.emit(command.id, command);
            logger.info(`Command [${command.id}] emitted, data: ${JSON.stringify(command)}`);
        };
        
        return socket_wrapper;
    },
    send: async(message) => {
        socket_wrapper.instance.send(message);
        return socket_wrapper;
    },
};

export default socket_wrapper;