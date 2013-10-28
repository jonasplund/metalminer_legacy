(function () {
    'use strict';
    var settings = require('./mm.settings.js'),
        request = require('request').defaults({ headers: settings.headers }),
        cheerio = require('cheerio');

    var setlist = module.exports = {};

    setlist.setlistfm = function (metaInfo, callback) {
        if (!metaInfo || !callback) {
            return;
        }
    };
}) ();
//a3b715c7-4f2f-4362-8692-fe5d103c8994