// test/player.js

function messageConstruct() {
    return {
        member: {
            voice: {
                channel: false
            }
        },
        channel: {
            send: function(value) {return Promise.resolve(value);}
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

// skip
test("skip fail on no voice channel", function() {
    return player.skip(message).then(data => {
        expect(data).toMatch("You have to be in a voice channel to skip song");
    });
});


test('skip fail on no queue available', function() {
    message.member.voice.channel = true;
    return player.skip(message).then(data => {
        expect(data).toMatch("There is no song to skip, it's in your head ;)");
    });
});

//stop
test("stop fail on no voice channel", function() {
    return player.stop(message).then(data => {
        expect(data).toMatch("You have to be in the voice channel to stop the music");
    });
});

test("stop fail on no queue available", function() {
    message.member.voice.channel = true;
    return player.stop(message).then(data => {
        expect(data).toMatch("There is no song to stop");
    });
});

//list
test("list fail on no connection", function() {
    return player.list(message).then(data => {
        expect(data).toMatch("No current playlist for this channel");
    });
});