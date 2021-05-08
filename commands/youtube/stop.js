const { Command } = require('discord.js-commando');

module.exports = class StopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'youtube',
            memberName: 'stop',
            description: 'Admin command: stops music player',
            ownerOnly: true
        });
    }

    run(message) {
        return message.say(`${message.content.split(" ")[1]} is a pinis!`);
    }
};