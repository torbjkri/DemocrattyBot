const { MessageFlags } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class StopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'youtube',
            memberName: 'stop',
            description: 'Admin command: stops music player',
            ownerOnly: true,
            clientPermissions: ['SPEAK', 'CONNECT'],
        });
    }

    run(message) {
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("you need to be in the voice channel to interact with the bot.")
        }
        if (message.guild.musicData.songDispatcher === null) {
            return message.reply("there is no music to stop, it's in your head!");
        }
        const queue =  message.guild.musicData.queue;
    }
};