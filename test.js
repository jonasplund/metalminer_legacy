 (function () {
    'use strict';

    var mm = require('./index.js'),
        lyrics = require('./mm.lyrics.js'),
        bandInfo = require('./mm.bandInfo.js'),
        similarArtists = require('./mm.similarArtists.js'),
        video = require('./mm.video.js');

    var red   = '\u001b[31m';
    var yellow  = '\u001b[33;1m';
    var reset = '\u001b[0m';

    var testobjects = [
        {
            artist: 'Pain of Salvation',
            album: 'Entropia',
            title: '01 - ! (Foreword)'
        }, {
            album: "I Am Anonymous",
            artist: "Headspace",
            title: "02 - Fall of America"
        }, {
            album: "Intelligent Design",
            artist: "Shaolin Death Squad",
            title: "02 - Catastrophic Obedience"
        }, {
            artist: 'Gloryhammer',
            album: 'Tales from the Kingdom of Fife',
            title: '01 - Angus Mcfife'
        }, {
            artist: 'Fejd',
            album: 'Nagelfar',
            title: '03 - Nagelfar'
        }
    ];

    var errorobj = {
        album: 'sdfkdfdds',
        artist: 'adfdfsdfk',
        title: 'fdsfdsdfsdfds'
    };

    (function () {
        lyricsTest();
        bandInfoTest();
        similarArtistsTest();
        videoTest();
        metalMinerTest();
    }) ();

    function lyricsTest() { 
        for (var i = 0, endi = testobjects.length; i < endi; i++) {
            (function (i) {
                var testobject = testobjects[i];
                lyrics.darkLyrics(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'lyricsTest: darkLyrics' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'lyricsTest: No error or result for darkLyrics for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
                lyrics.metalArchives(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'lyricsTest: metalArchives' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'lyricsTest: No error or result for metalArchives for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
                lyrics.songLyrics(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'lyricsTest: songLyrics' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'lyricsTest: No error or result for songLyrics for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
            }) (i);
        }
        lyrics.darkLyrics(errorobj, function (err, res) { 
            console.log(res); 
            if (!res.error) { 
                console.log(yellow + 'lyricsTest: darkLyrics' + red + ' did not report error for errorobj.' + reset); 
                console.log(res); 
            } 
        });
        lyrics.metalArchives(errorobj, function (err, res) { if (!res.error) { console.log(yellow + 'lyricsTest: metalArchives' + red + ' did not report error for errorobj:' + reset); console.log(res); } });
        lyrics.songLyrics(errorobj, function (err, res) { if (!res.error) { console.log(yellow + 'lyricsTest: songLyrics' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
    }

    function bandInfoTest() { 
        for (var i = 0, endi = testobjects.length; i < endi; i++) {
            (function (i) {
                var testobject = testobjects[i];
                bandInfo.wikipedia(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'bandInfoTest: wikipedia' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'bandInfoTest: No error or result for wikipedia for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
                bandInfo.metalArchives(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'bandInfoTest: metalArchives' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'bandInfoTest: No error or result for metalArchives for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
            }) (i);
        }
        bandInfo.wikipedia(errorobj, function (err, res) { if (!res.error) { console.log(yellow + 'bandInfoTest: wikipedia' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
        bandInfo.metalArchives(errorobj, function (err, res) { if (!res.error) { console.log(yellow + 'bandInfoTest: metalArchives' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
    }

    function similarArtistsTest() {
        for (var i = 0, endi = testobjects.length; i < endi; i++) {
            (function (i) {
                var testobject = testobjects[i];
                similarArtists.pandora(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'similarArtistsTest: pandora' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'similarArtistsTest: No error or result for pandora for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
                similarArtists.metalArchives(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'similarArtistsTest: metalArchives' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'similarArtistsTest: No error or result for metalArchives for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
                similarArtists.lastfm(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'similarArtistsTest: lastfm' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'similarArtistsTest: No error or result for lastfm for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
            }) (i);
        }
        similarArtists.pandora(errorobj, function (err, res) { if (!res.error) { console.log(yellow + 'bandInfoTest: pandora' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
        similarArtists.metalArchives(errorobj, function (err, res) { if (!res.error) { console.log(yellow + 'bandInfoTest: metalArchives' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
        similarArtists.lastfm(errorobj, function (err, res) { if (!res.error) { console.log(yellow + 'bandInfoTest: lastfm' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
    }

    function videoTest() {
        for (var i = 0, endi = testobjects.length; i < endi; i++) {
            (function (i) {
                var testobject = testobjects[i];
                video.youtube(testobject, function (err, res) {
                    if (res.error) {
                        console.log(yellow + 'videoTest: youtube' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res.data) { 
                            console.log(red + 'videoTest: No error or result for youtube for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
            }) (i);
        }
        video.youtube(errorobj, function (err, res) { if (!res.error) { console.log(yellow + 'bandInfoTest: youtube' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
    }

    function metalMinerTest() {
        for (var i = 0, endi = testobjects.length; i < endi; i++) {
            (function (i) {
                var testobject = testobjects[i];
                mm.getLyrics(testobject, function (err, res) {
                    if (err) {
                        console.log(yellow + 'metalMinerTest: getLyrics' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res) { 
                            console.log(red + 'metalMinerTest: No error or result for getLyrics for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
                mm.getBandInfo(testobject, function (err, res) {
                    if (err) {
                        console.log(yellow + 'metalMinerTest: getBandInfo' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res) { 
                            console.log(red + 'metalMinerTest: No error or result for getBandInfo for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
                mm.getSimilarArtists(testobject, function (err, res) {
                    if (err) {
                        console.log(yellow + 'metalMinerTest: getSimilarArtists' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res) { 
                            console.log(red + 'metalMinerTest: No error or result for getSimilarArtists for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
                mm.getVideo(testobject, function (err, res) {
                    if (err) {
                        console.log(yellow + 'metalMinerTest: getVideo' + red + ' not found for object: ' + reset);
                        console.log(testobject);
                    } else {
                        if (!res) { 
                            console.log(red + 'metalMinerTest: No error or result for getVideo for object: ' + reset);
                            console.log(testobject);
                        }
                    }
                });
            }) (i);
        }
        mm.getLyrics(errorobj, function (err, res) { if (!err) { console.log(yellow + 'metalMinerTest: getLyrics' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
        mm.getBandInfo(errorobj, function (err, res) { if (!err) { console.log(yellow + 'metalMinerTest: getBandInfo' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
        mm.getSimilarArtists(errorobj, function (err, res) { if (!err) { console.log(yellow + 'metalMinerTest: getSimilarArtists' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
        mm.getVideo(errorobj, function (err, res) { if (!err) { console.log(yellow + 'metalMinerTest: getVideo' + red + ' did not report error for errorobj.' + reset); console.log(res); } });
    }
}) ();
