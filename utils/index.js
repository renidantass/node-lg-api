const utils = {
    isFunction: (signature) => {
        return typeof signature === 'function';
    },
    extractIpFromHost(host) {
        const separator = ':';
        return host.split(separator)[0];
    }
}

export default utils;