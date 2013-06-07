(function () {
    'use strict';
    var request = require('request').defaults({ headers: { 'User-Agent': 'metalminer/0.3 (http://jooon.mooo.com:8088; jon.asplund@gmail.com)'} }),
        cheerio = require('cheerio'),
        async = require('async');

    var mm = module.exports = {};

    mm.getLyrics = function (metaInfo, callback) {
        var functions = [{
            name: 'Metal Archives',
            func: getMetalArchivesLyrics,
            prio: 1,
            error: '',
            data: ''
        }, {
            name: 'Dark Lyrics',
            func: getDarkLyrics,
            prio: 2,
            error: '',
            data: ''
        }, {
            name: 'Song Lyrics',
            func: getSongLyrics,
            prio: 3,
            error: '',
            data: ''
        }];
        functionCaller(functions, metaInfo, false, callback);
    };

    mm.getBandInfo = function (metaInfo, callback) {
        var functions = [{
            name: 'Wikipedia',
            func: getWikipediaBandInfo,
            prio: 1,
            data: '',
            error: ''
        }];
        functionCaller(functions, metaInfo, false, callback);
    };

    mm.getSimilarArtists = function (metaInfo, callback) {
        var functions = [{
            name: 'Metal Archives',
            func: getMetalArchivesSimilarArtists,
            prio: 1,
            data: '',
            error: ''
        }, {
            name: 'Pandora',
            func: getPandoraSimilarArtists,
            prio: 2,
            data: '',
            error: ''
        }, {
            name: 'lastfm',
            func: getLastfmSimilarArtists,
            prio: 3,
            data: '',
            error: ''
        }];
        functionCaller(functions, metaInfo, true, callback);
    };

    mm.getVideo = function (metaInfo, callback) {
        var functions = [{
            name: 'Youtube',
            func: getYoutube,
            prio: 1,
            data: '',
            error: ''
        }];
        functionCaller(functions, metaInfo, false, callback);
    };

    var functionCaller = function (objectarr, metaInfo, merge, callback) {
        // Wrapper for async
        var fns = objectarr.map(function (item) {
            return function (callback2) {
                item.func.call(this, metaInfo, callback2);
            };
        });
        async.parallel(
            fns,
            function (err, res) {
                for (var i = 0, endi = objectarr.length; i < endi; i++) {
                    if (res && res[i] && res[i].error) {
                        objectarr[i].error = res[i].error;
                    }
                    if (res && res[i] && res[i].data) {
                        objectarr[i].data = res[i].data;
                    }
                }
                if (!merge) {
                    objectarr.sort(function (a, b) {
                        if (a.error && !b.error) {
                            return 1;
                        }
                        if (!a.error && b.error) {
                            return -1;
                        }
                        return a.prio - b.prio;
                    });
                    if (objectarr.filter(function (item) { return item.error; }).length === objectarr.length) {
                        callback(objectarr.map(function (item) { return item.name + ': ' + item.error; }).join('<br />'));
                    } else {
                        callback(undefined, objectarr[0].data);
                    }
                } else {
                    var resarray = [];
                    var i = 0;
                    // Merge
                    objectarr.map(function (item) {
                        if (!item.error) resarray.push(item.data);
                    });
                    // Flatten, sort and remove duplicates
                    var merged = [].concat.apply([], resarray).sort().filter(function(elem, pos, self) {
                        return self.indexOf(elem) === pos;
                    });
                    if (objectarr.filter(function (item) { return item.error; }).length === objectarr.length) {
                        callback(objectarr.map(function (item) { return item.name + ': ' + item.error; }).join('<br />'));
                    } else {
                        callback(undefined, merged);
                    }

                }
            }
        );
    };

    var getDarkLyrics = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://www.darklyrics.com/lyrics/';
        var artist = metaInfo.artist.toLowerCase().replace(/[^a-z]/gi, '');
        var album = metaInfo.album.toLowerCase().replace(/[^a-z]/gi, '');
        var title = metaInfo.title.toLowerCase().replace(/[^a-z]/gi, '');
        uri += artist + '/' + album + '.html';
        request(uri, function (err, res, body) {
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

    var getYoutube = function (metaInfo, callback) {
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
            if (link == null) {
                callback(undefined, { error: 'Malformed response from google.' });
                return;
            }
            var matches = link.attribs.href.replace('/url?q=', '').match(/watch%3Fv%3D(.*?)&amp/);
            if (matches.length > 1) {
                callback(undefined, { data: matches[1] });
            }  else {
                callback(undefined, { error: 'No /watch url found.' });
            }
        });
    };

    var getWikipediaBandInfo = function (metaInfo, callback) {
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

    var getMetalArchivesLyrics = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://www.metal-archives.com/search/ajax-advanced/searching/songs/?';
        uri += 'songTitle=' + metaInfo.title.replace(/^[0-9]{2,3} - /, '') + '&';
        uri += 'bandName=' + metaInfo.artist + '&';
        uri += 'releaseTitle=' + metaInfo.album;
        uri = uri.replace(/ /g, '+');
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

    var getSongLyrics = function (metaInfo, callback) {
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

    var getLastfmSimilarArtists = function (metaInfo, callback) {
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
                    if (artists[i].name && artists[i].name !== "") {
                        results.push(artists[i].name);
                    }
                }
                callback(undefined, { data: results });
            } else callback (undefined, { error: 'No artists found.' })
        });
    };

    var getPandoraSimilarArtists = function (metaInfo, callback) {
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
    }

    var getMetalArchivesSimilarArtists = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
        var uri = 'http://www.metal-archives.com/search/ajax-advanced/searching/albums/?bandName=';
        uri += metaInfo.artist.replace(/ /gi, '+') + '&releaseTitle=' + metaInfo.album.replace(/ /gi, '+');
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
})();
