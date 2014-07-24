var similarArtists = require('../lib/similarArtists.js');
var assert = require('assert');
var mm = require('../index.js');
var testobjects = require('./testobjects.js');

describe('SimilarArtists', function () {
    describe('#metalArchives()', function () {
        it('returns an array and no errors for an existing song', function (done) {
            var args = testobjects.correctobjs[0];
            similarArtists.metalArchives(args, function (err, data) {
                assert(typeof data.data === 'object');
                assert(Array.isArray(data.data));
                assert(typeof data.error === 'undefined');
                assert(err === null || err === undefined);
                done();
            });
        });

        it('returns an data.error for a non-existing song', function (done) {
            var args = testobjects.errorobj;
            similarArtists.metalArchives(args, function (err, data) {
                assert(typeof data.data === 'undefined');
                assert(typeof data.error === 'string');
                assert(err === null || err === undefined);
                done();
            });
        });
    });

    describe('#lastfm()', function () {
        it('returns an array and no errors for an existing song', function (done) {
            var args = testobjects.correctobjs[0];
            similarArtists.lastfm(args, function (err, data) {
                assert(typeof data.data === 'object');
                assert(Array.isArray(data.data));
                assert(typeof data.error === 'undefined');
                assert(err === null || err === undefined);
                done();
            });
        });

        it('returns an data.error for a non-existing song', function (done) {
            var args = testobjects.errorobj;
            similarArtists.lastfm(args, function (err, data) {
                assert(typeof data.data === 'undefined');
                assert(typeof data.error === 'string');
                assert(err === null || err === undefined);
                done();
            });
        });
    });

    describe('#pandora()', function () {
        it('returns an array and no errors for an existing song', function (done) {
            var args = testobjects.correctobjs[0];
            similarArtists.pandora(args, function (err, data) {
                assert(typeof data.data === 'object');
                assert(Array.isArray(data.data));
                assert(typeof data.error === 'undefined');
                assert(err === null || err === undefined);
                done();
            });
        });

        it('returns an data.error for a non-existing song', function (done) {
            var args = testobjects.errorobj;
            similarArtists.pandora(args, function (err, data) {
                assert(typeof data.data === 'undefined');
                assert(typeof data.error === 'string');
                assert(err === null || err === undefined);
                done();
            });
        });
    });

    describe('#getSimilarArtists()', function () {
        it('returns an array and no errors for an existing song', function (done) {
            var args = testobjects.correctobjs[0];
            mm.getSimilarArtists(args, function (err, data) {
                assert(typeof data === 'object');
                assert(Array.isArray(data));
                assert(typeof err === 'undefined');
                done();
            });
        });

        it('returns an data.error for a non-existing song', function (done) {
            var args = testobjects.errorobj;
            mm.getSimilarArtists(args, function (err, data) {
                assert(typeof data === 'undefined');
                assert(typeof err === 'string');
                done();
            });
        });
    });
});