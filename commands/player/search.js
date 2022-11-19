const axios = require("axios");
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder,SelectMenuBuilder } = require("discord.js");
const voice = require("@discordjs/voice");
const neteaseAPI = require("../../libs/neteaseSynced")
const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("next")
            .setLabel('Next Page')
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("back")
            .setLabel('Back Page')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("play")
            .setLabel('Play Audio')
            .setStyle(3),
        new ButtonBuilder()
            .setCustomId("sync")
            .setLabel('Synced Lyrics( Beta )')
            .setStyle(4),


    );

async function loadAPM(word,index,callback){
    console.log("Requesting API...")
    axios({
        method: 'post',
        url: 'https://api.apmmusic.com/search/tracks',
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": "BASNjbQeR0ibnmamJ1UE1xF3iL2UNRI6Za-5FYBeQyA",
            "x-sundrop-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W3sidHlwZSI6ImNvbXBvc2l0ZSIsImZpZWxkIjoidXNlcmluZm8iLCJ2YWx1ZSI6W3sidHlwZSI6InRleHQiLCJ2YWx1ZSI6IjAiLCJmaWVsZCI6InVzZXJpZCIsIm9wZXJhdGlvbiI6ImluY2x1ZGUifV0sIm9wZXJhdGlvbiI6ImluY2x1ZGUifSx7InR5cGUiOiJ0YWciLCJ2YWx1ZSI6IlVTIiwiZmllbGQiOlsicmVzdHJpY3RlZF90byJdLCJvcGVyYXRpb24iOiJtdXN0In1d.N4wYVgW8VnoKSZApYYjGqS2T3Tud_f4oHDCcKrBqPqg",
        },
        data: `{"limit":25,"offset":0,"sort":"relevancy_base","terms":[{"type":"text","field":["tags","track_title","track_description","album_title","album_description","sound_alikes","lyrics","library","composer"],"value":"${word}","operation":"must"}]}`

    }).then((result) => {
        console.log("Requested " + index)
        let item = result.data.rows[index]

        let embed = new EmbedBuilder()
        embed.setTitle(`${index} / ${result.data.rows.length}`)
        embed.addFields(
            {name: "Title 📝", value: item.trackTitle, inline: true},
            {name: "Album 💿", value: item.albumCode, inline: true},
            {name: "Library  📕", value: item.libraryName, inline: true},
            {name: "Download ⬇️", value: item.audioUrl, inline: false}
        )
        embed.setImage(item.albumArtLargeUrl)
        callback(embed)
        return embed
    }).catch(() => {
        let embed = new EmbedBuilder();
        embed.setTitle(`Something Went Wrong!`);
        callback(embed)
        return embed
    })
}

module.exports = {
    name: 'search',
    description: "Search Something and Listen it in APM Music.",
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        console.log("Searching..")
        let splited = message.content.split(" ")
        let query = splited.slice(1).join("+")
        axios({
            method: 'post',
            url: 'https://api.apmmusic.com/search/tracks',
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": "BASNjbQeR0ibnmamJ1UE1xF3iL2UNRI6Za-5FYBeQyA",
                "x-sundrop-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W3sidHlwZSI6ImNvbXBvc2l0ZSIsImZpZWxkIjoidXNlcmluZm8iLCJ2YWx1ZSI6W3sidHlwZSI6InRleHQiLCJ2YWx1ZSI6IjAiLCJmaWVsZCI6InVzZXJpZCIsIm9wZXJhdGlvbiI6ImluY2x1ZGUifV0sIm9wZXJhdGlvbiI6ImluY2x1ZGUifSx7InR5cGUiOiJ0YWciLCJ2YWx1ZSI6IlVTIiwiZmllbGQiOlsicmVzdHJpY3RlZF90byJdLCJvcGVyYXRpb24iOiJtdXN0In1d.N4wYVgW8VnoKSZApYYjGqS2T3Tud_f4oHDCcKrBqPqg",
            },
            data: `{"limit":25,"offset":0,"sort":"relevancy_base","terms":[{"type":"text","field":["tags","track_title","track_description","album_title","album_description","sound_alikes","lyrics","library","composer"],"value":"${query}","operation":"must"}]}`

        }).then(async (result) => {

            let item = result.data.rows[0]
            console.log(item)
            let embed = new EmbedBuilder()
            embed.setTitle(`1 / ${result.data.rows.length}`)
            embed.addFields(
                {name: "Title 📝", value: item.trackTitle, inline: true},
                {name: "Album 💿", value: item.albumTitle, inline: true},
                {name: "Library  📕", value: item.libraryName, inline: true},
                {name: "Download ⬇️", value: item.audioUrl, inline: false}
            )

            embed.setImage(item.albumArtLargeUrl)
            let reply = await message.reply({embeds: [embed], components: [row]})
            let collector = reply.createMessageComponentCollector({
                filter: (i) => i.user.id === message.author.id,
            })
            let index = 1
            collector.on('collect', async (i) => {
                if (index < 0) {
                    index = 0
                }
                if (index <= result.data.rows.length){
                    index = 0
                }
                if (i.customId == 'next'){
                    index += 1
                    let it = await loadAPM(query,index,async (embed) => {

                        await i.update({
                            embeds: [embed],
                            components: [row]
                        })
                    })



                } else if (i.customId == 'back'){
                    index -= 1
                    let it = await loadAPM(query,index,async (embed) => {

                        await i.update({
                            embeds: [embed],
                            components: [row]
                        })
                    })
                } else if (i.customId == 'play') {
                    if (i.member.voice.channel){
                        let channel = voice.joinVoiceChannel({
                            channelId: i.member.voice.channelId,
                            guildId: i.guild.id,
                            adapterCreator: i.guild.voiceAdapterCreator,
                        })
                        let player = voice.createAudioPlayer({
                            behaviors: {
                                noSubscriber: voice.NoSubscriberBehavior.Pause,
                            }
                        })
                        let resouces = voice.createAudioResource(result.data.rows[index].audioUrl)
                        player.play(resouces)
                        channel.subscribe(player)
                        let it = await loadAPM(query,index,async (embed) => {

                            await i.update({
                                content: "Song Playing!",
                                embeds: [embed],
                                components: [row]
                            })
                        })

                    } else {

                        let it = await loadAPM(query,index,async (embed) => {

                            await i.update({
                                content: "You need to be in a voice channel to play music!",
                                embeds: [embed],
                                components: [row]
                            })
                        })


                    }

                } else if (i.customId == 'sync') {
                   /*
                    neteaseAPI.search(result.data.rows[index].trackTitle,async (lyrics) => {

                        let compo = new ActionRowBuilder()
                            .addComponents()
                        let smb = new SelectMenuBuilder()
                            smb.setCustomId('selectLyrics')
                            smb.setPlaceholder('will select default one.')
                        for (let i = 0; i < lyrics.length; i++) {
                            let description = "Artists: "
                            if (Array.isArray(lyrics[i].artists)) {
                                console.log(lyrics[i].artists[1])
                                description = description +  lyrics[i].artists[0].name.toString()
                            } else {
                                description = lyrics[i].artists.name
                            }

                            smb.addOptions({
                                label: lyrics[i].name,
                                description: description,
                                value: i.toString()
                            })



                        }
                        await i.update({
                            components: [compo, row],
                            content: "List of Lyrics"
                        })
                    })
                    */
                    await i.update({
                        content: "This feature broken so i removed it."
                    })
                }

            })
    }).catch((reason) => {
        message.reply("HTTP Error ❌ - " + reason.code)
        })
}}



