var setlist = require('../lib/setlist.js');
var assert = require('assert');
var mm = require('../index.js');
var testobjects = require('./testobjects.js')

describe('Setlist', function () {
    describe('#setlistfm()', function () {
        it('returns an array and no errors for an existing artist', function (done) {
            var args = testobjects.correctobjs[0];
            setlist.setlistfm(args, function (err, data) {
                assert(typeof data.data === 'object');
                assert(Array.isArray(data.data));
                assert(typeof data.error === 'undefined');
                assert(err === null || err === undefined);
                done();
            });
        });

        it('returns an data.error for a non-existing artist', function (done) {
            var args = testobjects.errorobj;
            setlist.setlistfm(args, function (err, data) {
                assert(typeof data.data === 'undefined');
                assert(typeof data.error === 'string');
                assert(err === null || err === undefined);
                done();
            });
        });
    });

    describe('#getSetlist()', function () {
        it('returns an array and no errors for an existing artist', function (done) {
            var args = testobjects.correctobjs[0];
            mm.getSetlist(args, function (err, data) {
                assert(typeof data === 'object');
                assert(Array.isArray(data));
                assert(typeof err === 'undefined');
                done();
            });
        });

        it('returns an data.error for a non-existing artist', function (done) {
            var args = testobjects.errorobj;
            mm.getSetlist(args, function (err, data) {
                assert(typeof data === 'undefined');
                assert(typeof err === 'string');
                done();
            });
        });
    });
});