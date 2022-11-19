module.exports = {
    name: 'info',
    description: "About APMDownloader Info",
    aliases: ['i','info','infomation','about'],
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        const msg = await message.reply('Fetching...')
        await msg.edit(`APMDownloader 1.0, Fetched Data in! **${client.ws.ping} ms**`)
    }
};
