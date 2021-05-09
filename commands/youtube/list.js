const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class ListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'list',
            aliases: ['ls'],
            group: 'youtube',
            memberName: 'list',
            description: 'List songs in current playlist',
            throttling: {
                usages: 1,
                duration: 10
            },
            clientPermissions: ['SPEAK', 'CONNECT'],
        });
    }

    run(message) {
        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("you need to be in the voice channel to interact with the bot.");
        }
        if (message.guild.musicData.songDispatcher === null) {
            return message.say("There is currently no active playlist. !help to getting assistance in creating one.");
        }
        const queue = message.guild.musicData.queue;
        const listEmbed = new MessageEmbed()
                .setTitle('Playlist queue')
                .setColor('#1ab23b');
        var numSongs = queue.length;
        for (var i = 0; i < numSongs; i++) {
            listEmbed.addField(`[${i}]`, queue[i].title);
        }
        return message.say(listEmbed);
    }
};