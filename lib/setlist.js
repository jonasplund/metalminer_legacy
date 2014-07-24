(function () {
    'use strict';
    var settings = require('../settings.js'),
        request = require('request').defaults({ headers: settings.headers }),
        cheerio = require('cheerio');

    var setlist = module.exports = {};

    setlist.setlistfm = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://api.setlist.fm/rest/0.1/search/artists.json?artistName=' + metaInfo.artist;
        uri = encodeURI(uri);
        request({ uri: uri }, function (err, res, body) {
            if (err) {
                callback(undefined, { error: 'Request error' });
                return;
            }
            try {
                body = JSON.parse(body);
            } catch (e) {
                callback(undefined, { error: 'Did not get JSON response.' });
                return;
            }
            if (!body.artists || !body.artists.artist) {
                callback(undefined, { error: 'Invalid response: body.artists(.artist) is falsy' });
                return;
            }
            // setlist.fm returns single results as objects and multiple results as arrays.
            // Wrap all in arrays to avoid confusion.
            var artists = [].concat(body.artists.artist);
            artists = artists.filter(function (item) { return item['@name'].toLowerCase() === metaInfo.artist.toLowerCase(); });
            if (!artists || !artists[0]) {
                callback(undefined, { error: 'Did not find exact match for artist name' });
                return;
            }
            var mbid = artists[0]['@mbid'];
            var uri = 'http://api.setlist.fm/rest/0.1/artist/' + mbid + '/setlists.json';
            request({ uri: uri }, function (err, res, body) {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    callback(undefined, { error: 'Did not get JSON response.' });
                    return;
                }
                if (!body.setlists || !body.setlists.setlist) {
                    callback(undefined, { error: 'Invalid response: body.setlists(.setlist) is falsy' });
                    return;
                }
                var setlist = [].concat(body.setlists.setlist)[0];
                if (!setlist.sets) {
                    callback(undefined, { error: 'Invalid response: sets is falsy' });
                    return;
                }
                var sets = [].concat(setlist.sets)[0];
                if (!sets.set) {
                    callback(undefined, { error: 'Invalid response: set is falsy' });
                    return;
                }
                var set = [].concat(sets.set)[0];
                var song = [].concat(set.song);
                callback(null, { data: song.map(function (curr) { return curr['@name']; }) });
            });
        });
    };
}) ();
//a3b715c7-4f2f-4362-8692-fe5d103c8994