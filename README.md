# Use Webgo as a Dynamic DNS service
This script uses Puppeteer to change the DNS entry of an IP address in the webgui of webgo.de. Puppeteer is a Google Chromium application for server-side automation in Nodejs. The script fetches the public IP of a third party and changes the DNS settings at webgo.de. The page is not very comfortable to script. The script only works as long as webgo does not change its website.


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
- [ ] Uses the fritz.box native tool to detect IP address changes
- [ ] Dockerize this nodejs application
- [x] Check for new Ip every minute