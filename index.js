const puppeteer = require('puppeteer');


// How to pass parameter into puppeteer evalute
// https://stackoverflow.com/a/46098448/14755959
async function getDnsEditorLink({page, subdomain = ''}) {

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


async function getDnsZoneLink({page, domain = ''})  {

  try {
    if (domain == '') throw 'Domain is empty';
    await page.screenshot({ path: './screenshots/getDnsZone.png' });

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


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://login.webgo.de/login');

  await page.type('#UserUsername', {{username}});
  await page.type('#UserPassword', {{password}});

  await Promise.all([
    page.waitForNavigation(),
    page.click("button[type=submit]"),

  ]);


  await page.screenshot({ path: './screenshots/exampleLogin.png' });
  await page.goto('https://login.webgo.de/domains');

  const linkDnsZoneEdit = await getDnsZoneLink({
    page: page,
    domain: 'boebelix.de',
  });

  console.log(linkDnsZoneEdit);


  await page.goto(linkDnsZoneEdit);




  const linkDnsEdit = await getDnsEditorLink({
    page: page,
    subdomain: 'web1',
  });

  console.log(linkDnsEdit);




  await page.screenshot({ path: './screenshots/exampleGotoEditDns.png' });

  await browser.close();
})();
