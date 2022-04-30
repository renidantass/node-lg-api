import ssdp from '@achingbrain/ssdp';
import logger from '../logger/index.js';

const discover = {
    LGTV: () => {
        return {
            run: async function() {
                const bus = await ssdp();
                const term = 'webos';
                
                let devices = [];

                for await(const service of bus.discover()) {
                    if(service.uniqueServiceName.indexOf(term) > -1) {
                        devices.push(service);
                    }
                }
                
                logger.info('Devices discovered: ', devices);
            
                return devices;
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