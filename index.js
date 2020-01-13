//bot invite link:  https://discordapp.com/oauth2/authorize?client_id=666309507105816586&scope=bot&permissions=8192

//local vs hosted switch
if (!process.env.hasOwnProperty("TOKEN")){
    process.env = require("./env.json");
}

const Scanner = require('./scanner.js');
const Discord = require('discord.js'); 

//configure Discord
const client = new Discord.Client();  
client.on('ready', () => {   
    console.log(`Logged in as ${client.user.tag}`); 
});
client.on('message', msg => {  
    if (msg.attachments.array().length > 0){
        msg.channel.send(`message attachments: ${msg.attachments.array().length}`);
    }
    if (msg.embeds.length > 0){
        msg.channel.send(`message embeds: ${msg.embeds.length}`);
        Scanner.scanURL(msg.embeds[0].url);
    }
});

client.login(process.env.TOKEN).then(delete process.env.TOKEN);