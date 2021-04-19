// test/player.js

function messageConstruct() {
    return {
        member: {
            voice: {
                channel: false
            }
        },
        channel: {
            send: function() {return Promise.resolve("OK")}
        },
        guild: {
            id: 1
        }
    };
}

beforeEach(function() {
    player = require('../libs/player');
    message = messageConstruct();
});

test("skip fail on no voice channel", function() {
    return player.skip(message).then(data => {
        expect(data).toMatch("OK");
    });
});


test('skip fail on no valid queue channel', function() {
    message.member.voice.channel = true;
    return player.skip(message).then(data => {
        expect(data).toMatch("OK");
    });
});