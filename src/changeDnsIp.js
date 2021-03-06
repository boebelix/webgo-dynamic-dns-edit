'use strict';

const puppeteer = require('puppeteer');
const publicIpApi = require('./publicIpApi');

require('dotenv').config();


const isDebbug = false;


/**
 * Get the link for DNS editor for specific subdomain.
 * How to pass parameter into puppeteer evalute
 * https://stackoverflow.com/a/46098448/14755959
 * @function makeInits
 * @privateprivate
 * @param  {String} page        Injection of puppeteer object
 * @param  {String} subdomain   The subdomain to change.
 * @return {String}             Link from DNS Editor from Webgo 
 */
const getDnsEditorLink = async ({ page, subdomain = '' }) => {

  try {
    if (subdomain == '') throw 'Subdomain is empty';

    return await page.evaluate(function (subdomain) {
      const dnsTable = document.querySelector('.alltable');
      let domainElement;
      let availabledSubdomain;


      for (i = 0; i < dnsTable.rows.length; i++) {
        domainElement = dnsTable.rows.item(i).cells;
        availabledSubdomain = domainElement.item(0);

        if (availabledSubdomain.textContent === subdomain) {
          return linkToDnsEdit = domainElement.item(5).childNodes.item(0).href;
        }
      }

      throw `Subdomain not found ${subdomain}`;

    }, subdomain);
  } catch (error) {
    console.error(error);
  }
}


/**
 * Get the link for DNS editor for specific subdomain.
 * This link changes with every change.
 * @function getDnsZoneLink
 * @private
 * @param  {String} page        Injection of puppeteer object
 * @param  {String} domain      The domain to change.
 * @return {String}             Link from DNS editor zone from Webgo 
 */
const getDnsZoneLink = async ({ page, domain = '' }) => {
  try {
    if (domain == '') throw 'Domain is empty';
    if (isDebbug) await page.screenshot({ path: './screenshots/getDnsZone.png' });

    return await page.evaluate(function (domain) {
      const dnsTable = document.querySelector('.alltable');
      let domainElement;
      let availabledDomain;


      for (i = 1; i < dnsTable.rows.length; i++) {
        domainElement = dnsTable.rows.item(i).cells;
        availabledDomain = domainElement.item(1);

        if (availabledDomain.textContent === domain) {
          return linkToDnsZoneEdit = domainElement.item(5).childNodes.item(2).href;
        }
      }

      throw `Domain not found ${domain}`;

    }, domain);
  } catch (error) {
    console.error(error);
  }
}


/**
 * Puppeteer script for change the DNS entrie of on Ip address in the web gui of webgo.de
 * The script get the public ip of on third party public servive.
 * The side is not very comfortable to script.
 */
const run = async (newIp) => {

  // Initialize puppeteer
  const browser = await puppeteer.launch({
    // This arguments is necessary for container runtime like docker 
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
  });

  const page = await browser.newPage();


  await page.goto(process.env.WEBGO_LOGIN_PAGE);

  // Load credentials from enviroment file
  await page.type('#UserUsername', process.env.USER_NAME);
  await page.type('#UserPassword', process.env.USER_PASSWORD);

  // Wait until side is loaded to be continue
  await Promise.all([
    page.waitForNavigation(),
    page.click("button[type=submit]"),

  ]);


  if (isDebbug) await page.screenshot({ path: './screenshots/exampleLogin.png' });

  await page.goto(process.env.WEBGO_DOMAIN_PAGE);


  // Get changeable link for DNS zone 
  const linkDnsZoneEdit = await getDnsZoneLink({
    page: page,
    domain: process.env.DOMAIN,
  });

  console.debug("Link to DNS zone edit: " + linkDnsZoneEdit);

  await page.goto(linkDnsZoneEdit);



  // Get changeable link for DNS edit
  const linkDnsEdit = await getDnsEditorLink({
    page: page,
    subdomain: process.env.SUB_DOMAIN,
  });

  console.debug("Link DNS Edit: " + linkDnsEdit);

  await page.goto(linkDnsEdit);

  if (isDebbug) await page.screenshot({ path: './screenshots/exampleGotoEditDns.png' });


  const dnsSettingsSelector = await page.$('#DnsSettingValue');

  // Doesn't work
  // dnsSettingsSelector.value = getPublicIp();
  // Work arround, 3 times click for mark the text and change type ip in the input field
  await dnsSettingsSelector.click({ clickCount: 3 });
  if (isDebbug) await page.screenshot({ path: './screenshots/click3times.png' });
  await dnsSettingsSelector.type(newIp);
  if (isDebbug) await page.screenshot({ path: './screenshots/exampleNewIp.png' });

  // Submit new Ip address
  await Promise.all([
    page.waitForNavigation(),
    page.click("input[type=submit]"),
  ]);

  if (isDebbug) await page.screenshot({ path: './screenshots/submitIp.png' });

  // Get confirm link by string manipulation
  const commitLink = linkDnsZoneEdit.split("/");
  commitLink[4] = "domainDnsDo";
  commitLink.push("ok");


  // Confirm the changes
  await Promise.all([
    page.waitForNavigation(),
    await page.goto(commitLink.join("/")),
  ]);

  if (isDebbug) await page.screenshot({ path: './screenshots/confirmChanges.png' });

  await browser.close();
};

module.exports = {
  run,
}

