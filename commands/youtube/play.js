var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Command = require('discord.js-commando').Command;
var _a = require('discord.js'), MessageEmbed = _a.MessageEmbed, Message = _a.Message;
var YouTube = require('simple-youtube-api');
var ytdl = require('ytdl-core');
var youtubeAPI = require('../../config.json').youtubeAPI;
var youtube = new YouTube(youtubeAPI);
var Song = /** @class */ (function () {
    function Song(url, title, duration, thumbnail, voiceChannel) {
        this.url = url;
        this.title = title;
        this.duration = duration;
        this.thumbnail = thumbnail;
        this.voiceChannel = voiceChannel;
        this.votes = 0;
    }
    return Song;
}());
module.exports = /** @class */ (function (_super) {
    __extends(PlayCommand, _super);
    function PlayCommand(client) {
        return _super.call(this, client, {
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
                    validate: function (text) {
                        return text.length < 200 && text.length >= 0;
                    }
                },
            ]
        }) || this;
    }
    PlayCommand.prototype.run = function (message, _a) {
        var query = _a.query;
        return __awaiter(this, void 0, void 0, function () {
            var voiceChannel, playlist_1, videosObj, i, video_1, url, title, duration, thumbnail, song, err_1, url, id, video_2, title, duration, thumbnail, song, err_2, videos, vidNameArr, i, embed, songEmbed, response, videoIndex, err_3, video, err_4, url, title, duration, thumbnail, song, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        voiceChannel = message.member.voice.channel;
                        if (!voiceChannel) {
                            return [2 /*return*/, message.say("You need to be in a voice channel to play music.")];
                        }
                        if (!query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) return [3 /*break*/, 8];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        youtube.getPlaylist(query)
                            .then(function (pl) { playlist_1 = pl; })["catch"](function (err) {
                            console.error(err);
                            return message.say("Playlist is either private or does not exist");
                        });
                        return [4 /*yield*/, playlist_1.getVideos()];
                    case 2:
                        videosObj = _b.sent();
                        i = 0;
                        _b.label = 3;
                    case 3:
                        if (!(i < videosObj.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, videosObj[i].fetch()];
                    case 4:
                        video_1 = _b.sent();
                        url = "https://www.youtube.com/watch?v=" + video_1.raw.id;
                        title = video_1.raw.snippet.title;
                        duration = this.formatDuration(video_1.duration);
                        thumbnail = video_1.thumbnails.high.url;
                        if (duration == '00:00')
                            duration = 'Live Stream';
                        song = new Song(url, title, duration, thumbnail, voiceChannel);
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (message.guild.musicData.isPlaying == false) {
                            message.guild.musicData.isPlaying = true;
                            message.guild.musicData.currentPlaying = song;
                            return [2 /*return*/, this.playSong(message.guild.musicData.currentPlaying, message)];
                        }
                        else if (message.guild.musicData.isPlaying) {
                            message.guild.musicData.queue.push(song);
                            return [2 /*return*/, message.say("Playlist - :musical_note: " + playlist_1.title + " :musical_note: has been added to queue!")];
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _b.sent();
                        console.error(err_1);
                        return [2 /*return*/, message.say("Playlist is either private or does not exist")];
                    case 8:
                        if (!query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) return [3 /*break*/, 12];
                        url = query;
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 11, , 12]);
                        query = query
                            .replace(/(>|<)/gi, '')
                            .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                        id = query[2].split(/[^0-9a-z_\-]/i)[0];
                        return [4 /*yield*/, youtube.getVideoByID(id)];
                    case 10:
                        video_2 = _b.sent();
                        title = video_2.title;
                        duration = this.formatDuration(video_2.duration);
                        thumbnail = video_2.thumbnails.high.url;
                        if (duration == '00:00')
                            duration = "Live Stream";
                        song = new Song(url, title, duration, thumbnail, voiceChannel);
                        message.guild.musicData.queue.push(song);
                        if (message.guild.musicData.isPlaying == false || typeof message.guild.musicData.isPlaying == 'undefine') {
                            message.guild.musicData.isPlaying = true;
                            message.guild.musicData.currentPlaying = song;
                            return [2 /*return*/, this.playSong(message.guild.musicData.currenPlaying, message)];
                        }
                        else if (message.guild.musicData.isPlaying) {
                            return [2 /*return*/, message.say(song.title + " added to queue")];
                        }
                        return [3 /*break*/, 12];
                    case 11:
                        err_2 = _b.sent();
                        console.error(err_2);
                        return [2 /*return*/, message.say('Something went wrong, please try again')];
                    case 12:
                        youtube.searchVideos(query, 5)
                            .then(function (result) {
                            message.say(result.length);
                            videos = result;
                        })["catch"](function (error) {
                            console.error(error);
                            return message.say("Something went wrong while quering for videos");
                        });
                        if (videos.length < 5) {
                            return [2 /*return*/, message.say("I had some trouble finding what you were looking for, please try a better search")];
                        }
                        vidNameArr = [];
                        for (i = 0; i < videos.length; i++) {
                            vidNameArr.push(i + 1 + ": " + videos[i].title);
                        }
                        vidNameArr.push('exit');
                        embed = new MessageEmbed()
                            .setColor("#e9f931")
                            .setTitle('Choose a song by commenting a number between 1 and 5')
                            .addField('Song 1', vidNameArr[0])
                            .addField('Song 2', vidNameArr[1])
                            .addField('Song 3', vidNameArr[2])
                            .addField('Song 4', vidNameArr[3])
                            .addField('Song 5', vidNameArr[4])
                            .addField('Exit', 'exit');
                        songEmbed = message.say({ embed: embed });
                        _b.label = 13;
                    case 13:
                        _b.trys.push([13, 22, , 23]);
                        _b.label = 14;
                    case 14:
                        _b.trys.push([14, 16, , 17]);
                        return [4 /*yield*/, message.channel.awaitMessages(function (msg) { return (msg.content > 0 && msg.content < 6) || msg.content === 'exit'; }, {
                                max: 1,
                                maxProcessed: 1,
                                time: 60000,
                                errors: ['time']
                            })];
                    case 15:
                        response = _b.sent();
                        videoIndex = parseInt(response.first().content);
                        return [3 /*break*/, 17];
                    case 16:
                        err_3 = _b.sent();
                        console.error(err_3);
                        songEmbed["delete"]();
                        return [2 /*return*/, message.say('Please try again and enter a number between 1 and 5 or exit')];
                    case 17:
                        if (response.first().contet === 'exit')
                            return [2 /*return*/, songEmbed["delete"]()];
                        _b.label = 18;
                    case 18:
                        _b.trys.push([18, 20, , 21]);
                        return [4 /*yield*/, youtube.getVideoByID(videos[videoIndex - 1].id)];
                    case 19:
                        video = _b.sent();
                        return [3 /*break*/, 21];
                    case 20:
                        err_4 = _b.sent();
                        console.error(err_4);
                        songEmbed["delete"]();
                        return [2 /*return*/, message.say('An error occured whern trying to get the video ID from youtube')];
                    case 21:
                        url = "https://www.youtube.com/watch?v=" + video.raw.id;
                        title = video.title;
                        duration = this.formatDuration(video.duration);
                        thumbnail = video.thumbnails.high.url;
                        if (duration == '00:00')
                            duration = 'Live Stream';
                        song = new Song(url, title, duration, thumbnail, voiceChannel);
                        songEmbed["delete"]();
                        message.guild.musicData.queue.push(song);
                        if (message.guild.musicData.isPlaying === false) {
                            message.guild.musicData.isPlaying = true;
                            message.guild.musicData.currentPlaying = song;
                            return [2 /*return*/, playSong(message.guild.musicData.currentPlaying, message)];
                        }
                        else {
                            return [2 /*return*/, message.say(song.title + " added to queue")];
                        }
                        return [3 /*break*/, 23];
                    case 22:
                        err_5 = _b.sent();
                        console.error(err_5);
                        if (songEmbed) {
                            songEmbed["delete"]();
                        }
                        return [2 /*return*/, message.say('Something went wrong with searching the video you requested :(')];
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    PlayCommand.prototype.playSong = function (song, message) {
        var _this = this;
        var voiceChannel = song.voiceChannel;
        var musicData = message.guild.musicData;
        voiceChannel.join()
            .then(function (connection) {
            var dispatcher = connection
                .play()
                .ytdl(song.url, {
                quality: 'highestaudio',
                highWaterMark: 1024 * 1024 * 10
            })
                .on('start', function () {
                musicData.songDispatcher = dispatcher;
                dispatcher.setVolume(musicData.volume);
                var videoEmbed = new MessageEmbed()
                    .setThumbnail(song.thumbnail)
                    .setColor('#e9f931')
                    .addField('Now playing:', song.title)
                    .addField('Duration:', song.duration);
                return message.say(videoEmbed);
            })
                .on('finish', function () {
                if (musicData.queue.length > 0) {
                    musicData.currentPlaying = musicData.queue.shift();
                    return _this.playSong(musicData.currentPlaying, message);
                }
                else {
                    message, guild.musicData.isPlaying = false;
                    return voiceChannel.leave();
                }
            })
                .on('error', function (e) {
                message.say('Cannot play song');
                message.guild.musicData.isPlaying = false;
                message.guild.musicData.queue.length = 0;
                console.error(e);
                message.guild.musicData.nowPlaying = null;
                return voiceChannel.leave();
            });
        })["catch"](function (err) {
            console.error(err);
            return voiceChannel.leave();
        });
    };
    PlayCommand.prototype.formatDuration = function (durationObj) {
        var duration = "" + (durationObj.hours ? durationObj.hours + ':' : '') + (durationObj.minutes ? durationObj.minutes : '00') + ":" + (durationObj.seconds < 10
            ? '0' + durationObj.seconds
            : durationObj.seconds
                ? durationObj.seconds
                : '00');
        return duration;
    };
    return PlayCommand;
}(Command));
