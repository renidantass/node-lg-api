import ssdp from '@achingbrain/ssdp';
import logger from '../logger/index.js';

const discover = {
    instance: null,
    LGTV: async() => {
        discover.bus = await ssdp();

        const term = 'webos';
        const services = await discover.bus.discover();
        const devices = services
                .filter(service => service.device.friendlyName.contains(term));
        
        logger.info('Devices discovered: ', devices);
    
        return devices;
    },
    shutdown: () => {
        discover.bus.stop(error => {
            process.exit(error ? 1 : 0);
        });
    },
}

export default discover;