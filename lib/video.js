(function () {
    'use strict';
    var settings = require('../settings.js'),
        request = require('request').defaults({ headers: settings.headers }),
        cheerio = require('cheerio');

    var vid = module.exports = {};

    vid.youtube = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var artist = metaInfo.artist.toLowerCase().replace(/ /g, '+');
        var title = metaInfo.title.toLowerCase().replace(/^[0-9]{2,3} - /, '').replace(/ /g, '+');
        var apikey = settings.googleAPIKey;
        var searchengine = settings.searchEngines.youtube;
        var uri = 'https://www.googleapis.com/customsearch/v1?q=' + [artist, title].join('+') + '+official&key=' + apikey + '&cx=' + searchengine;
        request({ uri: uri }, function (err, res, body) {
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.log('Error while parsing:', e);
                return callback(undefined, { error: 'Body parsing error.'});
            }
            if (!body || !body.items || body.items.length === 0) {
                return callback(undefined, { error: 'No items found' });
            }
            var link = body.items[0].link;
            var matches = link.match(/watch\?v=(.*?)$/);
            if (matches !== null && matches.length > 1) {
                callback(undefined, { data: matches[1] });
            }  else {
                callback(undefined, { error: 'No /watch url found.' });
            }
        });
    };
}) ();