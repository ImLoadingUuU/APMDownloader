/*
怕DiscordTW認不出是我寫的,我在這裡標示一下MeTooIDK.
 */
const { REST, Routes , Events , Client ,Collection, ActionRowBuilder, ButtonBuilder ,GatewayIntentBits , EmbedBuilder} = require("discord.js");
const voice = require("@discordjs/voice")
const axios = require("axios")
const path = require("path")
const fs = require("fs")
let token = require("config").token
const client =  new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
})




//** Commmand Handler **//
client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.buttons = new Collection();
client.prefix = "apm!"

module.exports = client;


fs.readdirSync('./handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client)
});




client.on('messageCreate', (message) => {
    if (message.author.bot) { return };
    console.log("Message:" + message.content)

})
client.login(token)
