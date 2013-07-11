(function () {
    'use strict';
    var request = require('request').defaults({ headers: { 'User-Agent': 'metalminer/0.5 (http://jooon.mooo.com:8088; jon.asplund@gmail.com)'} }),
        cheerio = require('cheerio'),
        async = require('async'),
        lyrics = require('./mm.lyrics.js'),
        bandInfo = require('./mm.bandInfo.js'),
        similarArtists = require('./mm.similarArtists.js'),
        video = require('./mm.video.js');

    var mm = module.exports = {};

    mm.getLyrics = function (metaInfo, callback) {
        var functions = [{
            name: 'Metal Archives',
            func: lyrics.metalArchives,
            prio: 1,
            error: '',
            data: ''
        }, {
            name: 'Dark Lyrics',
            func: lyrics.darkLyrics,
            prio: 2,
            error: '',
            data: ''
        }, {
            name: 'Song Lyrics',
            func: lyrics.songLyrics,
            prio: 3,
            error: '',
            data: ''
        }];
        functionCaller(functions, metaInfo, false, callback);
    };

    mm.getBandInfo = function (metaInfo, callback) {
        var functions = [{
            name: 'Wikipedia',
            func: bandInfo.wikipedia,
            prio: 1,
            data: '',
            error: ''
        }];
        var functions = [{
            name: 'Metal Archives',
            func: bandInfo.metalArchives,
            prio: 2,
            data: '',
            error: ''
        }];
        functionCaller(functions, metaInfo, false, callback);
    };

    mm.getSimilarArtists = function (metaInfo, callback) {
        var functions = [{
            name: 'Metal Archives',
            func: similarArtists.metalArchives,
            prio: 1,
            data: '',
            error: ''
        }, {
            name: 'Pandora',
            func: similarArtists.pandora,
            prio: 2,
            data: '',
            error: ''
        }, {
            name: 'lastfm',
            func: similarArtists.lastfm,
            prio: 3,
            data: '',
            error: ''
        }];
        functionCaller(functions, metaInfo, true, callback);
    };

    mm.getVideo = function (metaInfo, callback) {
        var functions = [{
            name: 'Youtube',
            func: video.youtube,
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
                    // Merge
                    objectarr.map(function (item) {
                        if (!item.error) {
                            resarray.push(item.data);
                        }
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
})();
