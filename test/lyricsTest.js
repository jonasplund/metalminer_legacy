var lyrics = require('../lib/lyrics.js');
var assert = require('assert');
var mm = require('../index.js');
var testobjects = require('./testobjects.js');

describe('Lyrics', function () {
    /*describe('#darkLyrics()', function () {
        it('returns a string and no errors for an existing artist', function (done) {
            var args = testobjects.correctobjs[0];
            lyrics.darkLyrics(args, function (err, data) {
                assert(typeof data.data === 'string');
                assert(Array.isArray(data.data));
                assert(typeof data.error === 'undefined');
                assert(err === null || err === undefined);
                done();
            });
        });

        it('returns an data.error for a non-existing artist', function (done) {
            var args = testobjects.errorobj;
            lyrics.darkLyrics(args, function (err, data) {
                assert(typeof data.data === 'undefined');
                assert(typeof data.error === 'string');
                assert(err === null || err === undefined);
                done();
            });
        });
    });*/

    describe('#songLyrics()', function () {
        it('returns a string and no errors for an existing song', function (done) {
            var args = testobjects.correctobjs[0];
            lyrics.songLyrics(args, function (err, data) {
                assert(typeof data.data === 'string');
                assert(typeof data.error === 'undefined');
                assert(err === null || err === undefined);
                done();
            });
        });

        it('returns an data.error for a non-existing song', function (done) {
            var args = testobjects.errorobj;
            lyrics.songLyrics(args, function (err, data) {
                assert(typeof data.data === 'undefined');
                assert(typeof data.error === 'string');
                assert(err === null || err === undefined);
                done();
            });
        });
    });

    describe('#metalArchives()', function () {
        it('returns a string and no errors for an existing song', function (done) {
            var args = testobjects.correctobjs[0];
            lyrics.metalArchives(args, function (err, data) {
                assert(typeof data.data === 'string');
                assert(typeof data.error === 'undefined');
                assert(err === null || err === undefined);
                done();
            });
        });

        it('returns an data.error for a non-existing song', function (done) {
            var args = testobjects.errorobj;
            lyrics.metalArchives(args, function (err, data) {
                assert(typeof data.data === 'undefined');
                assert(typeof data.error === 'string');
                assert(err === null || err === undefined);
                done();
            });
        });
    });

    describe('#getLyrics()', function () {
        it('returns a string and no errors for an existing song', function (done) {
            var args = testobjects.correctobjs[0];
            mm.getLyrics(args, function (err, data) {
                assert(typeof data === 'string');
                assert(typeof err === 'undefined');
                done();
            });
        });

        it('returns an data.error for a non-existing song', function (done) {
            var args = testobjects.errorobj;
            mm.getLyrics(args, function (err, data) {
                assert(typeof data === 'undefined');
                assert(typeof err === 'string');
                done();
            });
        });
    });
});