// test/player.js

let expect =  require('chai').expect;

let messageConstruct = {
    member: {
        voice: {
            channel: false
        }
    },
    channel: {
        send: function() {}
    },
    guild: {
        id: 1
    }
}

describe('Player', function() {

    describe("execute()", function() {
        let player = require('..libs/player');
        
    });

    describe('skip()', function() {
        let player = require('../libs/player');
        it('fail on no voice channel', function() {
            let message = messageConstruct;
            expect(player.skip(message)).to.equal("Fail voice");
        });
        it('fail on no valid queue channel', function() {
            let message = messageConstruct;
            message.member.voice.channel = true;
            expect(player.skip(message)).to.equal("Fail queue");
        });
    });
});