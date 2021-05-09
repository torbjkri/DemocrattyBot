// test/command/youtube/list.js


beforeEach(function() {
    PlayCommand  = require('../commands/youtube/list.js');
    const { CommandoClient } = require('discord.js-commando');
    const { Message } = require('discord.js');
    message = new Message();

    command =  new PlayCommand(new CommandoClient());
});

test("See what is returned", function() {
    message.member.voice.channel = true;
    return command.run(message).then(data => {
        expect(data).toMatch("Test");
    });
});