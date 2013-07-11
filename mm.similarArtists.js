(function () {
    'use strict';
    var settings = require('./mm.settings.js'),
        request = require('request').defaults({ headers: settings.headers }),
        cheerio = require('cheerio');

    var sim = module.exports = {}; 

    sim.lastfm = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=';
        uri += metaInfo.artist.toLowerCase().replace(/ /gi, '+');
        uri += '&api_key=0bf8c3f7dad9be95eb973b751216d364&format=json';
        request.get(uri, function (err, res, body) {
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
            if (body.error) {
                callback(undefined, { error: body.message });
                return;
            }
            if (body.similarartists && body.similarartists.artist) {
                var artists = body.similarartists.artist;
                var results = [];
                for (var i = 0, endi = artists.length; i < endi; i++) {
                    if (artists[i].name && 
                        artists[i].name !== '' && 
                        artists[i].match &&
                        parseFloat(artists[i].match) > 0.5) {
                        results.push(artists[i].name);
                    }
                }
                callback(undefined, { data: results });
            } else {
                callback (undefined, { error: 'No artists found.' });
            }
        });
    };

    sim.pandora = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://pandora.com/json/music/artist/';
        uri += metaInfo.artist.toLowerCase().replace(/ /gi, '-');
        request.get(uri, function (err, res, body) {
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
            if (body.error || !body.artistExplorer || !body.artistExplorer.similar) {
                callback(undefined, { error: 'Not found.'});
                return;
            }
            var names = [body.artistExplorer.similar.length];
            for (var i = 0, endi = body.artistExplorer.similar.length; i < endi; i++) {
                var name = body.artistExplorer.similar[i]['@name'];
                names[i] = name;
            }
            callback(undefined, { data: names });
        });        
    };

    sim.metalArchives = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://www.metal-archives.com/search/ajax-advanced/searching/albums/?bandName=';
        uri += metaInfo.artist.replace(/ /gi, '+') + '&releaseTitle=' + metaInfo.album.replace(/ /gi, '+');
        request.get(uri, function (err, res, body) {
            if (err) {
                callback(undefined, { error: 'Request error.' });
                return;
            }
            try {
                body = JSON.parse(body);
            } catch (e) {
                callback(undefined, { error: 'Did not get JSON response.' });
                return;
            }
            if (body.error !== '' || parseInt(body.iTotalDisplayRecords, 10) < 1) {
                callback(undefined, { error: 'Not found.' });
                return;
            }
            if (body.aaData.length > 0 && body.aaData[0].length > 0) {
                var link = body.aaData[0][0];
                var match = link.match(/(?:\/bands\/.*?\/)(.*?)(?:">)/)[1];
                var uri2 = 'http://www.metal-archives.com/band/ajax-recommendations/id/';
                uri2 += match;
                request.get(uri2, function (err, res, body) {
                    if (err) {
                        callback(undefined, { error: 'Request error.' });
                        return;
                    }
                    var match, regex = /(?:\/bands\/)([^\/]*)(?:\/)/gi;
                    var bands = [];
                    while ((match = regex.exec(body)) !== null) {
                        bands.push(match[1].replace(/_/gi, ' '));
                    }
                    if (bands.length > 0) {
                        callback(undefined, { data: bands });
                    } else {
                        callback(undefined, { error: 'Band not found or no similar bands found.' });
                    }
                });
            }
        });
    };
}) ();