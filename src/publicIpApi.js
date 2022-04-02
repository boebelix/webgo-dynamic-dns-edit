'use strict';

const axios = require("axios");

/**
 * Get the public Ip address from api.ipify.org
 * @function getPublicIp
 * @public
 * @return {String} Public Ip Address
 */
const getPublicIp = async () => {
    try {
        const response = await axios.get('https://api.ipify.org/');
        const publicIp = response.data;
        console.debug("Current public ip: " + publicIp);
        return publicIp;
    } catch (error) {
        console.error("Error while fetch Ip from ipify.org" + error);
    }
};

module.exports = {
    getPublicIp,
}