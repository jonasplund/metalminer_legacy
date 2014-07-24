(function () {
    'use strict';
    var settings = require('../settings.js'),
        request = require('request').defaults({ headers: settings.headers }),
        cheerio = require('cheerio');

    var lyr = module.exports = {};

    /* 
     *  Due to Dark Lyrics seemingly not appreciating serving pages, this function is never called. 
     *  After a while they respond with a blank page.
     */ 
    lyr.darkLyrics = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://www.darklyrics.com/lyrics/';
        var artist = metaInfo.artist.toLowerCase().replace(/[^a-z]/gi, '');
        var album = metaInfo.album.toLowerCase().replace(/[^a-z]/gi, '');
        var title = metaInfo.title.toLowerCase().replace(/[^a-z]/gi, '');
        uri += artist + '/' + album + '.html';
        request(uri, function (err, res, body) {
            if (err || body === '') {
                callback(undefined, { error: 'Request error.'});
                return;
            }
            var $ = cheerio.load(body, { ignoreWhitespace: true }),
                $albumlyrics = $('.lyrics'),
                albumlyrics = $albumlyrics.html(),
                $songtitles = $albumlyrics.find('h3'),
                songnr = -1;
            $songtitles.each(function (key) {
                if (this.text().toLowerCase().replace(/[^a-z]/gi, '') === title) {
                    songnr = key;
                    return false;
                }
            });
            if (songnr === -1) {
                callback(undefined, { error: 'Song or album not found.' });
            } else {
                var songlyrics = albumlyrics.split(/<h3>\s*<a name=".*?">.*?<\/h3>/);
                if (songlyrics.length < songnr + 1) {
                    callback(undefined, { error: 'Unknown error.' });
                } else {
                    if (songlyrics[songnr + 1].indexOf("lyrics not available") > -1) {
                        callback(undefined, { error: 'Song found, but no lyrics.'});
                    }
                    callback(undefined, { data: songlyrics[songnr + 1].trim() });
                }
            }
        });
    };

    lyr.metalArchives = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://www.metal-archives.com/search/ajax-advanced/searching/songs/?';
        uri += 'songTitle=' + metaInfo.title.replace(/^[0-9]{2,3} - /, '') + '&';
        uri += 'bandName=' + metaInfo.artist + '&';
        uri += 'releaseTitle=' + metaInfo.album;
        uri = uri.replace(/\(.*?\)/, '').replace(/ /g, '+');
        request(uri, function (err, res, body) {
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
                callback(undefined, { error: 'Band, album or song not found.' });
                return;
            }
            if (body.aaData.length > 0 && body.aaData[0].length > 4) {
                var link = body.aaData[0][4];
                var match = link.match(/id="lyricsLink_(.*?)"/)[1];
                var href = 'http://www.metal-archives.com/release/ajax-view-lyrics/id/' + match;
                request(href, function (err, res, body2) {
                    if (err) { 
                        callback(undefined, { error: 'Request error.' }); 
                        return;
                    }
                    if (body2.indexOf('lyrics not available') > -1) {
                        callback(undefined, { error: 'Lyrics not available.' });
                        return;
                    }
                    if (typeof callback === 'function') {
                        callback(undefined, { data: body2 });
                    }
                });
            }
        });
    };

    lyr.songLyrics = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://www.songlyrics.com/' + metaInfo.artist.toLowerCase().replace(/ /gi, '-') + '/';
        uri += metaInfo.title.toLowerCase().replace(/^[0-9]{2,3} - /, '').replace(/ /gi, '-') + '-lyrics';
        request(uri, function (err, res, body) {
            if (err) {
                callback(undefined, { error: 'Unknown error.' });
                return;
            }
            var $ = cheerio.load(body, { ignoreWhitepace: true });
            $('script').remove();
            if ($('#songLyricsDiv').length === 0) {
                callback(undefined, { error: 'Song not found.' });
            } else {
                if ($('#songLyricsDiv').children().length > 0 &&
                    $('#songLyricsDiv').text().indexOf('Sorry, we have no') < 0) {
                    callback(undefined, { data: $('#songLyricsDiv').html().trim() });
                } else {
                    callback(undefined, { error: 'Could not find lyrics.' });
                }
            }
        });
    };
})();
