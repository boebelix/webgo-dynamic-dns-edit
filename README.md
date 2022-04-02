# Use Webgo as a Dynamic DNS service
This script use Puppeteer for change the DNS entrie of on Ip address in the web gui of webgo.de.
Puppeteer is a Google Chromium application for server side automation in Nodejs.
The script get the public ip of on third party public servive and change the DNS settings at webgo.de
The side is not very comfortable to script. THis script only works as long as Webgo doesn't change there website.

## Requirements
- Nodejs

## Prepare
Copy and rename the ```env.example``` file to ```.env```.
If you have do the first step, you can change the values in the file to your preferences.
```
For example sub.domain.example
Username: vip01
Password: changeMe
```

Should be look like this.

```
USER_NAME="vip01"
USER_PASSWORD="changeMe"
SUB_DOMAIN="sub"
DOMAIN="domain.example"
WEBGO_LOGIN_PAGE="https://login.webgo.de/login"
WEBGO_DOMAIN_PAGE="https://login.webgo.de/domains"
```

## Installation
Download this Git reprository and extract the file in a location of your choice. And run

```
npm install
npm start
```

## Further tasks:
- Uses the fritz.box native tool to detect IP address changes
- Dockerize this nodejs application