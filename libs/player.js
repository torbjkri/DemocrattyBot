const Discord = require('discord.js');
const ytdl =  require('ytdl-core');

const {
    prefix,
    token,
} = require('../config.json');

const queue  = new Map();


async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel =  message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );

    const permissions =  voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need permission to join and speak in your channel :)"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            let connection = await voiceChannel.join();
            queueConstruct.connection =  connection;
            play(message, queueConstruct.songs[0]);
        }
        catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    }
    else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.chnnael.send(
            "You have to be in a voice channel to skip song."
        );

    if (!serverQueue)
        return message.channel.send(
            "There is no song to skip, it's in your head ;)"
        );

    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in the voice channel to stop the music"
        );

    if (!serverQueue)
        return message.channel.send(
            "There is no song to stop!"
        );


    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(message, song) {
    const serverQueue =  queue.get(message.guild.id);
    if (!song) {
        message.channel.send("My queue has endeded I'll leave you alone for now :)");
        queue.delete(message.guild.id);
        return;
    }

    const dispatcher =  serverQueue.connection
          .play(ytdl(song.url))
          .on("finish", () => {
              serverQueue.songs.shift();
              play(message, serverQueue.songs[0]);
          })
          .on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing **${song.title}**`);
}


module.exports = {
    run: function(message) {
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
    }
};
