// test/player.js
const ytdl = require('ytdl-core');

jest.mock('ytdl-core');

function permissionConstruct(value) {
    if (value === true) {
        return {has: function() {return true;}}
    }
        return {has: function() {return false;}}
}

function messageConstruct() {
    return {
        content: '',
        member: {
            voice: {
                channel: {
                    permissionsFor: function(value) {return permissionConstruct(value);},
                    join: function() {return Promise.resolve();}

                }
            }
        },
        channel: {
            send: function(value) {return Promise.resolve(value);}
        },
        guild: {
            id: 1
        },
        client:{
             user: true
        }
    };
}

ytdl.getInfo.mockImplementation(function(url) {
    return {videoDetails: {title: url, url: url}};
})

beforeEach(function() {
    player = require('../libs/player');
    message = messageConstruct();
});

// skip
test("skip fail on no voice channel", function() {
    message.member.voice.channel = null;
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
    message.member.voice.channel = null;
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

test("execute fail on no voice channel", function() {
    message.member.voice.channel = null;
    return player.execute(message).then(data => {
        expect(data).toMatch("You have to be in the voice channel to play music");
    });
});

test("execute fail on not valid user permission", function() {
    message.content = '!play www.youtube.com/song1';
    message.client.user = false;
    return player.execute(message).then(data => {
        expect(data).toMatch("I need permission to join and speak in your channel :)");
    });
});

test("execute first song added successfully", function() {
    message.content = '!play www.youtube.com/song1';
    return player.execute(message).then(data => {
        expect(data).toMatch("I need permission to join and speak in your channel :)");
    });
});
