const Discord = require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');
const { executionAsyncResource } = require('async_hooks');
const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require('constants');

const player = require('/home/tkringel/git/personal/DemocrattyBot/libs/player.js');

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
    if (!message.content.startsWith(prefix)) return;

    player.run(message);
});

