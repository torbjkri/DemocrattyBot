const { Command } = require('discord.js-commando');
const { MessageEmbed, Message } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const { youtubeAPI } = require('../../config.json');
const youtube = new YouTube(youtubeAPI);

class Song {
    constructor(url, title, duration, thumbnail, voiceChannel) {
        this.url = url;
        this.title = title;
        this.duration = duration;
        this.thumbnail = thumbnail;
        this.voiceChannel = voiceChannel;
        this.votes = 0;
    }
}

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            memberName: 'play',
            aliases: ['add'],
            group: 'youtube',
            description: 'Play song or playlist from youtube',
            throttling: {
                usages: 1,
                duration: 10
            },
            clientPermissions: ['SPEAK', 'CONNECT'],
            args: [
                {
                    key: 'query',
                    prompt: 'What song or playlist do you want to listen to?',
                    type: 'string',
                    error: 'Give me a valid youtube URL to add to playlist',
                    validate: text => {
                        return text.length < 200 && text.length >= 0;
                    },
                },
            ],
        });
    }

    async run(message, {query}) {
        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.say("You need to be in a voice channel to play music.")
        }
        if (query.match( /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/ )) {
            try {
                let playlist;
                youtube.getPlaylist(query)
                    .then(pl => {playlist = pl;})
                    .catch(err => {
                          console.error(err);
                           return message.say("Playlist is either private or does not exist");
                    }
                );
                const videosObj =  await playlist.getVideos();

                for (let i = 0; i < videosObj.length; i++) {
                    const video = await videosObj[i].fetch();
                    const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                    const title = video.raw.snippet.title;
                    let duration = this.formatDuration(video.duration);
                    const thumbnail = video.thumbnails.high.url;
                    if (duration == '00:00') duration = 'Live Stream';

                    const song = new Song(url, title, duration, thumbnail, voiceChannel);

                }
                if (message.guild.musicData.isPlaying == false) {
                    message.guild.musicData.isPlaying = true;
                    message.guild.musicData.currentPlaying = song;
                    return this.playSong(message.guild.musicData.currentPlaying,message);
                } else if (message.guild.musicData.isPlaying) {
                    message.guild.musicData.queue.push(song);
                    return message.say(
                        `Playlist - :musical_note: ${playlist.title} :musical_note: has been added to queue!`
                    );
                }
            } catch (err) {
                console.error(err);
                return message.say("Playlist is either private or does not exist");
            }
        }
        if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
            const url = query;
            try {
                query = query
                        .replace(/(>|<)/gi, '')
                        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                const id = query[2].split(/[^0-9a-z_\-]/i)[0];
                const video = await youtube.getVideoByID(id);
                const title = video.title;
                let duration = this.formatDuration(video.duration);
                const thumbnail = video.thumbnails.high.url;
                if (duration == '00:00') duration = "Live Stream";
                const song = new Song(url, title, duration, thumbnail, voiceChannel);

                message.guild.musicData.queue.push(song);
                if (message.guild.musicData.isPlaying == false || typeof message.guild.musicData.isPlaying == 'undefine') {
                    message.guild.musicData.isPlaying = true;
                    message.guild.musicData.currentPlaying = song;
                    return this.playSong(message.guild.musicData.currenPlaying, message);
                } else if (message.guild.musicData.isPlaying) {
                    return message.say(`${song.title} added to queue`);
                }
            } catch (err) {
                console.error(err);
                return message.say('Something went wrong, please try again');
            }
        }
        let videos;
        youtube.searchVideos(query, 5)
            .then(result => {
                message.say(result.length);
                videos = result;
            })
            .catch(error => {
                console.error(error);
                return message.say("Something went wrong while quering for videos");
            });
        if (videos.length < 5) {
            return message.say(
                `I had some trouble finding what you were looking for, please try a better search`
            );
        }
        const vidNameArr = [];
        for (let i = 0; i < videos.length; i++) {
            vidNameArr.push(`${i + 1}: ${videos[i].title}`);
        }
        vidNameArr.push('exit');
        const embed = new MessageEmbed()
              .setColor(`#e9f931`)
              .setTitle('Choose a song by commenting a number between 1 and 5')
              .addField('Song 1', vidNameArr[0])
              .addField('Song 2', vidNameArr[1])
              .addField('Song 3', vidNameArr[2])
              .addField('Song 4', vidNameArr[3])
              .addField('Song 5', vidNameArr[4])
              .addField('Exit', 'exit');
        var songEmbed = message.say({ embed });
        try {

            try {
                var response =  await message.channel.awaitMessages(
                    msg => (msg.content > 0 && msg.content < 6) || msg.content === 'exit', {
                        max: 1,
                        maxProcessed: 1,
                        time: 60000,
                        errors: ['time']
                    }
                );
                var videoIndex = parseInt(response.first().content);
            } catch (err) {
                console.error(err);
                songEmbed.delete();
                return message.say(
                    'Please try again and enter a number between 1 and 5 or exit'
                );
            }
            if (response.first().contet === 'exit') return songEmbed.delete();
            try {
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                console.error(err);
                songEmbed.delete();
                return message.say(
                    'An error occured whern trying to get the video ID from youtube'
                );
            }
            const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
            const title = video.title;
            let duration = this.formatDuration(video.duration);
            const thumbnail = video.thumbnails.high.url;
            if (duration == '00:00') duration = 'Live Stream';
            const song = new Song(url, title, duration, thumbnail, voiceChannel);
            songEmbed.delete();

            message.guild.musicData.queue.push(song);
            if (message.guild.musicData.isPlaying === false) {
                message.guild.musicData.isPlaying = true;
                message.guild.musicData.currentPlaying = song;
                return playSong(message.guild.musicData.currentPlaying, message);
            } else {
                return message.say(`${song.title} added to queue`);
            }
        } catch (err) {
            console.error(err);
            if (songEmbed) {
                songEmbed.delete();
            }
            return message.say(
                'Something went wrong with searching the video you requested :('
            );
        }
    }

    playSong(song, message) {

        let voiceChannel = song.voiceChannel;
        let musicData = message.guild.musicData;
        voiceChannel.join()
            .then(connection => {
                const dispatcher = connection
                      .play()
                      .ytdl(song.url, {
                          quality: 'highestaudio',
                          highWaterMark: 1024 * 1024 * 10
                      })
                      .on('start', () => {
                          musicData.songDispatcher = dispatcher;
                          dispatcher.setVolume(musicData.volume);
                          const videoEmbed = new MessageEmbed()
                                .setThumbnail(song.thumbnail)
                                .setColor('#e9f931')
                                .addField('Now playing:', song.title)
                                .addField('Duration:', song.duration);
                          return message.say(videoEmbed);
                      })
                      .on('finish', () => {
                          if (musicData.queue.length > 0) {
                              musicData.currentPlaying = musicData.queue.shift();
                              return this.playSong(musicData.currentPlaying, message);
                          } else {
                              message,guild.musicData.isPlaying = false;
                              return voiceChannel.leave();
                          }
                      })
                      .on('error', e => {
                          message.say('Cannot play song');
                          message.guild.musicData.isPlaying = false;
                          message.guild.musicData.queue.length = 0;
                          console.error(e);
                          message.guild.musicData.nowPlaying = null;
                          return voiceChannel.leave();
                      })
            })
            .catch(err => {
                console.error(err);
                return voiceChannel.leave();
            });

    }

    formatDuration(durationObj) {
        const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
            durationObj.minutes ? durationObj.minutes : '00'
        }:${
            durationObj.seconds < 10
            ? '0' + durationObj.seconds
            : durationObj.seconds
            ? durationObj.seconds
            : '00'
        }`
        return duration;
    }

}
