# QReaper

Recently, Discord added the ability to scan a QR code with their mobile app to log in. 
It's convenient, but it has a massive flaw. Attackers have been gaining access to other people's accounts simply by
sending them a Direct Message containing a login QR code but accompanying it with a message like "Scan this QR code to
redeem your Nitro gift!"

To combat these scams, I created this Discord Bot which scans messages for QR codes and deletes any messages containing them.

## How to Use
This bot has no settings and begins working as soon as it has been added to a server. It scans all attachments and embedded images.
If it fails to scan a message, you can make it re-scan the message by adding any reaction to the message.

To get this information simply tag the bot in any channel that it has post-messages access to. 

## Invite to your server
To invite the bot to your server, visit the bot's page here: [https://qreaper.glitch.me](https://qreaper.glitch.me)

## Self-hosting
If you would like to host this bot yourself instead of using my hosted version, follow these instructions. 
They assume you have created an Application and registered a Bot account with Discord's Developer Portal. 
1. Download and install [Node.JS](https://nodejs.org/en/)
2. Download this repository as a zip.
3. Unzip the downloaded archive
4. In the root folder, create `env.json` and fill it with the following contents: 
```json
{
  "TOKEN": "your-bot-token-here"
}
```
5. Open a new terminal window at the root folder and run `npm install`
6. Run `node index.js` to start the bot. It will print to the console the port it's running on. Visit `localhost:port-here` to view the bot's webpage.
