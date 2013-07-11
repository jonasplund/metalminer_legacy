(function () {
    'use strict';
    var settings = require('./mm.settings.js'),
        request = require('request').defaults({ headers: settings.headers }),
        cheerio = require('cheerio');

    var bi = module.exports = {}; 

    bi.wikipedia = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://www.google.com/search?q=' + metaInfo.artist.replace(/ /g, '+') + '+band+site:en.wikipedia.org';
        uri = encodeURI(uri);
        request({ uri: uri }, function (err, res, body) {
            if (err) {
                callback(undefined, { error: 'Request error.' });
                return;
            }
            var $ = cheerio.load(body, { ignoreWhitespace: true });
            var link = $('body h3 a')[0];
            if (!link || !link.attribs || !link.attribs.href) {
                callback(undefined, { error: 'Malformed response from google.' });
                return;
            }
            var linkhref = link.attribs.href;
            linkhref = linkhref.replace('en.wikipedia.org', 'en.mobile.wikipedia.org').replace('/url?q=', '').replace(/&amp;sa=.*/, '');
            request({ uri: linkhref }, function (err, res, body) {
                if (err) {
                    callback(undefined, { error: 'Request error.' });
                    return;
                }
                var $ = cheerio.load(body, { ignoreWhitespace: true });
                if ($('h1').text().toLowerCase().indexOf(metaInfo.artist.toLowerCase()) < 0) {
                    callback(undefined, { error: 'Band does not have a wikipedia entry.' });
                    return;
                }
                var content = $('#content');
                $('.section').each(function (i, item) {
                    var itemText = $(item).text().toString();
                    if (itemText &&
                        itemText.match(/^[References|Read in another language|External links|Bibliography]/i)) {
                        $(item).remove();
                    }
                });
                //$('.metadata').remove();
                var html = content.html().replace(/Jump back a section/g, '').trim();
                callback(undefined, { data: html });
            });
        });
    };

    bi.metalArchives = function (metaInfo, callback) {
        // http://www.metal-archives.com/band/read-more/id/32922
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
                var uri2 = 'http://www.metal-archives.com/band/read-more/id/';
                uri2 += match;
                request.get(uri2, function (err, res, body) {
                    if (err) {
                        callback(undefined, { error: 'Request error.' });
                        return;
                    }
                    var match, regex = /<body>(.*)<\/body>/gi;
                    while ((match = regex.exec(body)) !== null) {
                        bands.push(match[1].replace(/_/gi, ' '));
                    }
                    if (body != '') {
                        callback(undefined, { data: body });
                    } else {
                        callback(undefined, { error: 'No info for band.' });
                    }
                });
            }
        });
    }
}) ();