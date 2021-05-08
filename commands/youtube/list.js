const { Command } = require('discord.js-commando');

module.exports = class ListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'list',
            group: 'youtube',
            memberName: 'list',
            description: 'List songs in current playlist',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    run(message) {
        return message.say("We are up and running!");
    }
};