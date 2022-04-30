import ssdp from '@achingbrain/ssdp';
import logger from '../logger/index.js';

const discover = {
    devices: [],
    instance: null,
    getInstance() {
        if(discover.instance === undefined) {
            discover.instance = await ssdp();
        }
    },
    LGTV: () => {
        return {
            run: async function() {
                const term = 'webos';
                
                discover.getInstance();

                for await(const service of discover.instance.discover()) {
                    if(service.details.device.friendlyName.indexOf(term) > -1) {
                        discover.devices.push(service.details.device);
                    }
                }
                
                logger.info('Devices discovered: ', devices);
            
                return discover.devices;
            },
            shutdown: async function() {
                discover.instance.stop(error => {
                    process.exit(error ? 1 : 0);
                });
            }
        }
    }
}

export default discover;