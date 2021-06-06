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
var CommandoClient = require('discord.js-commando').CommandoClient;
var Structures = require('discord.js').Structures;
var path = require('path');
var _a = require('./config.json'), prefix = _a.prefix, token = _a.token, owners = _a.owners;
Object.keys(CommandoClient).forEach(function (prop) { return console.log(prop); });
Structures.extend('Guild', function (Guild) {
    var MusicGuild = /** @class */ (function (_super) {
        __extends(MusicGuild, _super);
        function MusicGuild(client, data) {
            var _this = _super.call(this, client, data) || this;
            _this.musicData = {
                currentlyPlaying: null,
                queue: [],
                isPlaying: false,
                volume: 1,
                songDispatcher: null
            };
            return _this;
        }
        return MusicGuild;
    }(Guild));
    return MusicGuild;
});
var client = new CommandoClient({
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
client.once('ready', function () {
    console.log("Logged in as " + client.user.tag + "! (" + client.user.id + ")");
    client.user.setActivity('i Rassen');
});
