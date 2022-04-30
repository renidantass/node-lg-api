import websocket from 'ws';
import logger from '../logger/index.js';
import utils from '../utils/index.js';
import EventEmitter from 'events';

const eventsEmitter = new EventEmitter();

const socket_wrapper = {
    instance: null,
    isConnected: null,
    configure: (options) => {
        let { getHandshake, makeHandshake, ...rest } = options;
        socket_wrapper.getHandshake = getHandshake;
        socket_wrapper.makeHandshake = makeHandshake;
    },
    hasHandshaker: () => {
        return utils.isFunction(socket_wrapper.getHandshake) &&
        utils.isFunction(socket_wrapper.makeHandshake);     
    },
    setConnectionStatus: (status) => {
        if(status !== socket_wrapper.isConnected) {
            socket_wrapper.isConnected = status;
        }

        return socket_wrapper;
    },
    init: async(host) => {
        socket_wrapper.instance = new websocket(host);

        socket_wrapper.instance.onerror = (event) => {
            const error = event.data;
            socket_wrapper.setConnectionStatus(false);
            logger.error(`socket_wrapper:onerror error raised, connection error [${error}`);
        };
        socket_wrapper.instance.onopen = async(event) => {
            socket_wrapper.setConnectionStatus(true);
            logger.info(`Connected to: [${host}]`);
            logger.info(`Making handshake`);

            if(socket_wrapper.hasHandshaker) {
                await socket_wrapper.makeHandshake(ws);
            }
        };
        socket_wrapper.instance.onclose = (event) => {
            socket_wrapper.setConnectionStatus(false);
            logger.info('socket_wrapper:onclose called, connection closed');
        };
        socket_wrapper.instance.onmessage = (event) => {
            const message = event.data;
            const json = JSON.parse(message);
            logger.info(`socket_wrapper:onmessage, message received [${message}]`);
            eventsEmitter.emit(json.id, json);
        };

        return socket_wrapper;
    },
    send: (message) => {
        if(!socket_wrapper.isConnected) {
            logger.error('socket_wrapper:send not working, websocket not connected');
        }

        socket_wrapper.instance.send(message);

        return socket_wrapper;
    },
};

export default socket_wrapper;