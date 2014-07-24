var video = require('../lib/video.js');
var assert = require('assert');
var mm = require('../index.js');
var testobjects = require('./testobjects.js')

describe('Video', function () {
    describe('#youtube()', function () {
        it('returns an array and no errors for an existing artist', function (done) {
            var args = testobjects.correctobjs[0];
            video.youtube(args, function (err, data) {
                assert(typeof data.data === 'string');
                assert(typeof data.error === 'undefined');
                assert(err === null || err === undefined);
                done();
            });
        });

        it('returns an data.error for a non-existing artist', function (done) {
            var args = testobjects.errorobj;
            video.youtube(args, function (err, data) {
                assert(typeof data.data === 'undefined');
                assert(typeof data.error === 'string');
                assert(err === null || err === undefined);
                done();
            });
        });
    });

    describe('#getVideo()', function () {
        it('returns a string and no errors for an existing artist', function (done) {
            var args = testobjects.correctobjs[0];
            mm.getVideo(args, function (err, data) {
                assert(typeof data === 'string');
                assert(typeof err === 'undefined');
                done();
            });
        });

        it('returns an data.error for a non-existing artist', function (done) {
            var args = testobjects.errorobj;
            mm.getVideo(args, function (err, data) {
                assert(typeof data === 'undefined');
                assert(typeof err === 'string');
                done();
            });
        });
    });
});