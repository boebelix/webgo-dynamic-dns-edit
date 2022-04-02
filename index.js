/**
 * Author: Stefan Böbel
 * Date: 2022-04-02
 * Description: Puppeteer script for change the DNS entrie of on Ip address in the web gui of webgo.de.
 * Puppeteer is a Google Chromium application for server side automation in Nodejs.
 * The script get the public ip of on third party public servive and change the DNS settings at webgo.de
 * The side is not very comfortable to script.
 */

'use strict';

const changeDnsIp = require("./src/changeDnsIp");
const publicIpApi = require('./src/publicIpApi');

let currentDnsIpEntry = "";
let publicIP = "";

/**
 * The script checks in the given time interval if the ip has changed. At the initial start
 * the script is executed once and checks from then on only if the ip has changed.
 */
setInterval(async () => {
  publicIP = await publicIpApi.getPublicIp();

  console.debug("Current Dns Ip Entry: " + currentDnsIpEntry + " publicIp: " + publicIP);

  if (currentDnsIpEntry !== publicIP) {
    console.debug("IP has changed! Current Dns Ip Entry: " + currentDnsIpEntry + " publicIp: " + publicIP);
    changeDnsIp.run(publicIP);
  }

  currentDnsIpEntry = publicIP;
}, 64 * 1000); // 60 * 1000 milsec