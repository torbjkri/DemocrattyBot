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
var MessageFlags = require('discord.js').MessageFlags;
var Command = require('discord.js-commando').Command;
module.exports = /** @class */ (function (_super) {
    __extends(StopCommand, _super);
    function StopCommand(client) {
        return _super.call(this, client, {
            name: 'stop',
            group: 'youtube',
            memberName: 'stop',
            description: 'Admin command: stops music player',
            ownerOnly: true,
            clientPermissions: ['SPEAK', 'CONNECT']
        }) || this;
    }
    StopCommand.prototype.run = function (message) {
        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("you need to be in the voice channel to interact with the bot.");
        }
        if (message.guild.musicData.songDispatcher === null) {
            return message.reply("there is no music to stop, it's in your head!");
        }
        var queue = message.guild.musicData.queue;
    };
    return StopCommand;
}(Command));
