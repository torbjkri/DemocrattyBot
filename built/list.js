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
var Command = require('discord.js-commando').Command;
var MessageEmbed = require('discord.js').MessageEmbed;
module.exports = /** @class */ (function (_super) {
    __extends(ListCommand, _super);
    function ListCommand(client) {
        return _super.call(this, client, {
            name: 'list',
            aliases: ['ls'],
            group: 'youtube',
            memberName: 'list',
            description: 'List songs in current playlist',
            throttling: {
                usages: 1,
                duration: 10
            },
            clientPermissions: ['SPEAK', 'CONNECT'],
        }) || this;
    }
    ListCommand.prototype.run = function (message) {
        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("you need to be in the voice channel to interact with the bot.");
        }
        if (message.guild.musicData.songDispatcher === null) {
            return message.say("There is currently no active playlist. !help to getting assistance in creating one.");
        }
        var queue = message.guild.musicData.queue;
        var listEmbed = new MessageEmbed()
            .setTitle('Playlist queue')
            .setColor('#1ab23b');
        var numSongs = queue.length;
        for (var i = 0; i < numSongs; i++) {
            listEmbed.addField("[" + i + "]", queue[i].title);
        }
        return message.say(listEmbed);
    };
    return ListCommand;
}(Command));
