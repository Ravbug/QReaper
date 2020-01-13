//bot invite link:  https://discordapp.com/oauth2/authorize?client_id=666309507105816586&scope=bot&permissions=8192

const Discord = require('discord.js'); 
const client = new Discord.Client();  
client.on('ready', () => {   
    console.log(`Logged in as ${client.user.tag}!`); 
});
client.on('message', msg => {  
    
});
client.login('token');