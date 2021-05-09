const {CommandoClient}= require('discord.js-commando');
const { Structures } = require('discord.js');
const path = require('path');
const {
    prefix,
    token,
    owners,
} = require('./config.json');

Object.keys(CommandoClient).forEach((prop) => console.log(prop));

Structures.extend('Guild', Guild => {
    class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.musicData = {
                queue: [],
                isPlaying: false,
                volume: 1,
                songDispatcher: null
            }
        }
    }
     return MusicGuild;
});

const client = new CommandoClient({
    commandPrefix: '!',
    owner: owners
});

client.registry
    .registerDefaults()
    .registerGroups([
        ['youtube', 'Music Player']
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('i Rassen');
});

