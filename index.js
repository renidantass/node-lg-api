import discover from './services/discover.js';
import socket_wrapper from './services/websocket.js';
import lg_handshaker from './services/lg_handshaker.js';

const device = await discover.LGTV()[0];
socket_wrapper.configure(lg_handshaker);
socket_wrapper.init('ws://192.168.15.61:3000');
socket_wrapper.send('')


process.on('SIGINT', () => {
    discover.shutdown();
});