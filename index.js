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
client.on('message', async function(msg){  
    //don't scan dms
    if (msg.channel.type == "dm"){
        return;
    }

    let deleted = await processMessage(msg);
    //if not deleted, observe it for reactions to allow uers
    //to have a message manually scanned
    if (!deleted){
        msg.awaitReactions((reaction, user) => {
            //the reaction filter
            //in this case accept all reactions
            return true;
        },{max:1,time:300000,errors:[]}).then(async function(collected){
            let deleted = await processMessage(msg);
            //if message is clean
            if (!deleted){
                msg.react("✅").catch(()=>{});
            }
        });
    }
});

async function processMessage(msg){
    let removed = false;
    if (msg.attachments.array().length > 0){
        removed = await processAttachments(msg);
        return true;
    }
    if (!removed && msg.embeds.length > 0){
        return await processEmbeds(msg);
    }
}

/**
 * Process a message's attachments and delete the message if it contains QR codes
 * @param {Discord.Message} msg the message object to check
 */
async function processAttachments(msg){
    for (let attachment of msg.attachments.array()){
        let res = await Scanner.scanURL(attachment.url);
        if (res){
            msg.channel.send(deleteMsg(msg)).catch(()=>{});
            return true;
        }
    }
}

/**
 * Process a message's embeds and delete the message if it contains QR codes
 * @param {Discord.Message} msg the message object to check
 */
async function processEmbeds(msg){
    for (let embed of msg.embeds){
        let res = await Scanner.scanURL(embed.url);
        if (res){
            msg.channel.send(deleteMsg(msg)).catch(()=>{});
            return true;
        }
    }
}

/**
 * Deletes an offending message and sends a message stating that it worked
 * @param {Discord.Message} message 
 */
function deleteMsg(message){
    //play a mad-libs game to assemble the response
    const verbs = ["sneak","pass","smuggle","throw","drive","slip"];
    const adjectives = ["fastest","quickest","most skillful", "acclaimed"];
    const adjectives2 = ["type","stuff","garbage"];
    const places = ["land","world","country","sea","server","internet"];
    const verbs2 = ["spott","destroy","snip","sniff","roast","eat"]
    const greetings = ["Hey", "Oy", "Whoa", "Stop"];
    const affirmations = ["like","enjoy","allow","take","upvote","accept"]
    const directions = ["past","through","under"];

    const responses = [
        `${rand(greetings)} <@${message.author.id}>! That's a QR Code! We don't ${rand(affirmations)} that ${rand(adjectives2)} around here!`,
        `<@${message.author.id}> thought they could ${rand(verbs)} QR codes ${rand(directions)} me, but no dice.`,
        `<@${message.author.id}>, I'm the ${rand(adjectives)} QR code ${rand(verbs2)}er in the ${rand(places)}, and I just ${rand(verbs2)}ed yours.`,
    ];
    message.delete().catch(() => {message.channel.send("(Hey mods! I need perms to delete that!)").catch(()=>{})});
    return responses[Math.floor(Math.random()*responses.length)];
}


/**
 * @returns Returns a random element in an array
 * @param {[]} array array to use
 */
function rand(array){
    return array[Math.floor(Math.random()*array.length)];
}

client.login(process.env.TOKEN).then(delete process.env.TOKEN);