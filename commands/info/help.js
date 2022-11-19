const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: 'help',
    description: "help",
    aliases: ['h','help','commands','helpme'],
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
       let embed = new EmbedBuilder()
        embed.setTitle("Need some help?")
        embed.addFields({name: "Prefix 🔨", value: "`apm!`", inline: true},
        {name: "Info 📝", value: "`help` ,`info`", inline: true},
            {name: "Main 📈", value: "`search`", inline: false})

        message.reply({
            embeds: [embed]
        })
    }
};
