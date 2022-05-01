import ssdp from '@achingbrain/ssdp';
import logger from '../logger/index.js';
import utils from '../utils/index.js';

const discover = {
    devices: [],
    bus: null,
    async getInstance() {
        if(discover.bus === null) {
            discover.bus = await ssdp();
        }

        return discover.bus;
    },
    getFirstDevice: () => {
        return discover.devices[0];
    },
    getAllDevices: () => {
        return discover.devices;
    },
    LGTV: () => {
        return {
            run: async function() {
                const term = 'webOS TV';

                await discover.getInstance();

                const typeOfService = 'urn:schemas-upnp-org:device:MediaRenderer:1';

                for await(const service of discover.bus.discover(typeOfService)) {
                    if(service.details.device.friendlyName.indexOf(term) > -1) {
                        discover.devices.push({
                            device: service.details.device,
                            ip: utils.extractIpFromHost(service.location.host)
                        });
                    }
                }
                
                logger.info('Devices discovered: ', discover.devices);
            
                return discover;
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