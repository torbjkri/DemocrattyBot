// test/command/youtube/list.js
PlayCommand  = require('../commands/youtube/list.js');
const { CommandoClient } = require('discord.js-commando');
const Discord = require('discord.js');

function messageConstruct() {
    message = {
        member: {
            voice: {
                channel: false
            }
        },
        reply: function(value) {
            return Promise.resolve(value);
        },
        say: function(value) {
            return Promise.resolve(value);
        },
        guild: {
            musicData: {
                songDispatcher: null
            }
        }

    }

    return message;
}

beforeEach(function() {
    message = messageConstruct();

    command =  new PlayCommand(new CommandoClient());
});

afterAll((done) => {
    done();
});

test("Fail on no valid voice channel", function() {
    return command.run(message).then(data => {
        expect(data).toMatch("you need to be in the voice channel to interact with the bot.");
    });
});

test("Fail on no valid dispatcher", function() {
    message.member.voice.channel = true;
    return command.run(message).then(data => {
        expect(data).toMatch("There is currently no active playlist. !help to getting assistance in creating one.");
    });
});