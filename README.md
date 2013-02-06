# Metalminer

A node module to extract music related info from various sources.

## Install

From source:

<pre>
  git clone git://github/sjaak666/metalminer.git
  cd metalminer
  npm link
</pre>

## Usage

```javascript
var mm = require('metalminer');

// To see which properties are necessary in metaInfo, see below
var metaInfo = {
    title: 'Song Title',
    artist: 'Band name',
    album: 'Album name'
};

mm.getLyrics(metaInfo, function (err, data) {
    console.log(err || data);
});
```

## Methods

### metalminer.getLyrics(metaInfo, callback)

Currently supported sites:
* metal-archives.com
* songlyrics.com
* darklyrics.com

__Arguments__
* metaInfo - An object containing the properties 'title', 'artist' and 'album'
* callback - callback(err, results). 
  err is undefined if lyrics where found and otherwise a HTML string with info on the various sources.
  results is a string containing the lyrics.

### metalminer.getBandInfo(metaInfo, callback)

Currently supported sites:
* wikipedia.org

__Arguments__
* metaInfo - An object containing the property 'artist'
* callback - callback(err, results). 
  err is undefined if band info was found and otherwise a HTML string with info on the various sources.
  results is an array with band names.

### metalminer.getSimilarArtists(metaInfo, callback)

Currently supported sites:
* metal-archives.com

__Arguments__
* metaInfo - An object containing the properties 'artist' and 'album'
* callback - callback(err, results). 
  err is undefined if lyrics where found and a HTML string with info on the various sources.
  results is a string containing the lyrics.
