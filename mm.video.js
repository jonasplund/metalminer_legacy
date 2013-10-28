(function () {
    'use strict';
    var settings = require('./mm.settings.js'),
        request = require('request').defaults({ headers: settings.headers }),
        cheerio = require('cheerio');

    var vid = module.exports = {}; 

    vid.youtube = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var artist = metaInfo.artist.toLowerCase().replace(/ /g, '+');
        var title = metaInfo.title.toLowerCase().replace(/^[0-9]{2,3} - /, '').replace(/ /g, '+');
        var uri = 'http://www.google.com/search?q=' + [artist, title].join('+') + '+official+site:www.youtube.com';
        uri = encodeURI(uri);
        request({ uri: uri }, function (err, res, body) {
            if (err) {
                callback(undefined, { error: 'Request error.' });
                return;
            }
            var $ = cheerio.load(body, { ignoreWhitespace: true });
            var links = $('body h3 a');
            var link = null;
            for (var i = 0, endi = links.length; i < endi; i++) {
                if (links[i] && links[i].attribs && links[i].attribs.href && (links[i].attribs.href.indexOf('watch') > -1)) {
                    link = links[i];
                    break;
                }
            }
            if (link === null) {
                callback(undefined, { error: 'Malformed response from google.' });
                return;
            }
            var matches = link.attribs.href.replace('/url?q=', '').match(/watch%3Fv%3D(.*?)&amp/);
            if (matches !== null && matches.length > 1) {
                callback(undefined, { data: matches[1] });
            }  else {
                callback(undefined, { error: 'No /watch url found.' });
            }
        });
    };
}) ();