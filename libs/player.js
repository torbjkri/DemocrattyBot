const Discord = require('discord.js');
const ytdl =  require('ytdl-core');

const queue  = new Map();


async function execute(message) {
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
        url: songInfo.videoDetails.video_url,
        votes: 1,
        addeded: Date.now()
    };

    serverQueue = queue.get(message.guild.id);

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            currentlyPlaying: null,
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueConstruct);

        try {
            let connection = await voiceChannel.join();
            queueConstruct.connection =  connection;
            queueConstruct.currentlyPlaying = song;
            play(message.guild, song);
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

function skip(message) {
    if (!message.member.voice.channel) {
        message.channel.send(
            "You have to be in a voice channel to skip song."
        );
        return "Fail voice";
    }

    serverQueue = queue.get(message.guild.id);

    if (!serverQueue) {
        message.channel.send(
            "There is no song to skip, it's in your head ;)"
        );
        return "Fail queue"
    }

    serverQueue.connection.dispatcher.end();
}

function stop(message) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in the voice channel to stop the music"
        );
    serverQueue = queue.get(message.guild.id);

    if (!serverQueue)
        return message.channel.send(
            "There is no song to stop!"
        );


    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher =  serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {
                serverQueue.songs.sort(function(a,b) {return b.votes - a.votes;});
                serverQueue.currentlyPlaying = serverQueue.songs.shift();
                play(guild, serverQueue.currentlyPlaying);
            })
          .on("error", error => console.error(error));

    if (serverQueue.currentlyPlaying === null) {
        play(message);
    }
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing **${serverQueue.currentlyPlaying.title}**`);
}

async function list(message, serverQueue) {
    serverQueue = queue.get(message.guild.id);
    if (!serverQueue)
        return message.channel.send("No current playlist for this channel");

    serverQueue.songs.sort(function(a,b) {
        return b.votes - a.votes;
    })
    message.channel.send(`Currently playing:\n ${serverQueue.currentlyPlaying.title}`);
    if (serverQueue.songs.length > 0) {
        listMessage = `Playlist:\n # Title: \t\t\t\t\t Votes: \n`
        for (i = 0; i < serverQueue.songs.length; i++) {
            listMessage += `[${i}] \t${serverQueue.songs[i].title} \t\t\t ${serverQueue.songs[i].votes} votes\n`;
        }
        return message.channel.send(listMessage);
    }
    return 1;
}

function addVote(message) {
    serverQueue = queue.get(message.guild.id);
    if (!serverQueue)
        return message.channel.send("There is no current playlist for this channel");

    if (!message.member.voice.channel)
        return message.channel.send("You need to be in a voice channel with an active list to vote");

    let voteNumber = parseInt(message.content.split(" ")[1]);
    if (isNaN(voteNumber))
        return message.channel.send("Wrong voting format, vote by writing \"!vote your_number\"")

    if (voteNumber + 1 > serverQueue.songs.length || voteNumber < 1)
        return message.channel.send("Not a valid song. Type !list to get list of available songs for voting");

    serverQueue.songs[voteNumber].votes += 1;
    message.channel.send("Vote registered. \n Updated list:");
    list(message, serverQueue);
}


module.exports = {
    execute: execute,
    skip:       skip,
    stop:       stop,
    list:       list,
    addVote:    addVote
};
