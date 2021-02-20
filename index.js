const Discord = require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const { executionAsyncResource } = require('async_hooks');
const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require('constants');

const client = new Discord.Client();
client.login(token);

client.once('ready', () => {
    console.log('Ready!');
})

client.once('reconnecting', () => {
    console.log('Reconecting!');
})
client.once('disconnect', () => {
    console.log('Disconnect!');
})

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.context.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    } else {
        message.channel.send("You need to enter a valid command!");
    }
})

const queue = new Map();

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    }
}