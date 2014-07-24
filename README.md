# Metalminer

A node module to extract music related info from various sources.

## Install

<pre>
  npm install metalminer
</pre>

Or from source:

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

__Arguments__
* metaInfo - An object containing the properties 'title', 'artist' and 'album'
* callback - callback(err, results). 
  err is undefined if lyrics were found and otherwise a HTML string with info on the various sources.
  results is a string containing the lyrics.

### metalminer.getBandInfo(metaInfo, callback)

Currently supported sites:
* wikipedia.org
* metal-archives.com

__Arguments__
* metaInfo - An object containing the properties 'artist' and 'album'. album can be set to any album made by the artist and is used to filter the results.
* callback - callback(err, results). 
  err is undefined if band info was found and otherwise a HTML string with info on the various sources.
  results is an array with band names.

### metalminer.getSimilarArtists(metaInfo, callback)

Currently supported sites:
* metal-archives.com
* pandora.com
* last.fm

__Arguments__
* metaInfo - An object containing the properties 'artist' and 'album'
* callback - callback(err, results). 
  err is undefined if lyrics where found and a HTML string with info on the various sources.
  results is a string containing the lyrics.

### metalminer.getVideo(metaInfo, callback)

To use the video feature you need a Google API key which you set in the settings.js file.  

Currently supported sites:
* youtube.com

__Arguments__
* metaInfo - An object containing the properties 'artist' and 'title'
* callback - callback(err, results)
  err is undefined if video was found and otherwise a HTML string with info the various sources.
  results is a string containing the Youtube id.

### metalminer.getSetlist(metaInfo, callback)

Currently supported sites:
* last.fm

__ Arguments__
* metaInfo - An object containing the property 'artist'
* callback - callback(err, results)
  err is undefined if setlist was found and otherwise an array of song titles from the band's latest concert.