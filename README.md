JavaScript ID3 Reader
=====================

Note: This fork is still being developed. Do not use it yet, please.


This library attempts to parse ID3 tag data in music files using Javascript.

* It library was originally made by Jacob Seidelin using ID3v1 for demo'ing his BinaryAjax library [http://www.nihilogic.dk/labs/id3/].
* It was then extended by António Afonso to include the ID3v2 tag specification [http://www.id3.org/id3v2.4.0-structure], while he was working at Opera Software, in the context of the Unite Media Player application which was developed using server side JavaScript.
* Joshua Kifer implemented the tag reader for the QuickTime metadata information found in aac files.
* A new BufferedBinaryFile was created that extends BinaryFile in a way that only required data will be downloaded from the server. This makes it possible to read tag structures such as the Quicktime metadata without having to download the entire file as it was happening in previous versions of this library.
* Finally, the current version includes modifications by Joseph T. Parsons.

Fork Changes
-------------------
The following changes have been made in this fork:
* Replace the callback function with events.
* Remove platform-specific code from modules (that should be included in a compatibility later, at least for this fork, since it reduces maintainability costs).
* Simplify methods.
* Conform to (subjectively) better standards and readability (object model, etc.)

Additional plans include:
* Binary function optimisation.
* FLAC support (...somehow I'll figure that out).
* MP4 support (just ID3, but will need to be tested)

The following existing features will not be changed:
* The modularity of the ID3 library will be kept and, hopefully, extended.
* ID3v1, ID3v2.2, ID3v2.3 support
* Upload and AJAX helpers.

Other Work
---------------------

This fork will eventually try to merge changes by other contributors, as they are made. These include:
* Charset support (latin1, UTF-8, and UTF-16 are currently supported). This work is ongoing by [chardet](http://github.com/aadsm/jschardet), and will be merged into this fork with time.
* CommonJS support (maybe?)

Modules
---------

The software is modular, and comes with the following modules by default:
* id3v1.js - ID3v1.
* id3v2.js - ID3v2.
* id3v2frames.js - Frames support in ID3v2.
* id4.js - Experimental m4a/m4v support.

* filereader.js - Load files using upload.
* ajaxreader.js - Load files using AJAX.

Any of these modules may be dropped if desired.

Obtaining Tags
---------------

```
`ID3.loadTags(url, [options])`
    `url` - The URL of the mp3 file to read, this must reside on the same domain (document.domain).
    `options` - Optional parameters.
    `options.tags` - The array of tags and/or shortcuts to read from the ID3 block. Default value is: `["title", "artist", "album", "track"]`
    `options.dataReader` - The function used to create the data reader out of a url. It receives (`url`, `success`: callback function that returns the data reader, `fail`: callback function to inform an error setting up the reader).
```
    
In order to use this version of the Javascript ID3 Reader, you must first ensure that a dataReader module is available. By default by upload and ajax dataReaders are present.

At present, the ajax dataReader requires that you simply specify the URL you wish to download. It will then download as much of the URL as is neccessary to read the ID3 tags. E.g.:
```
`ID3.loadTags('http://www.example.com/music.mp3', { tags : ["title", "artist", "album"] })`
```

The upload dataReader, on the other hand, requires that you pass a file object as such:
```
`ID3.loadTags('the-url-is-really-just-a-placeholder-for-uploads', { dataReader : FileAPIReader(f), tags : ["title", "artist", "album"] })`
```


Whenever tags have been read, a custom event, "ID3TagsRead", will be issued, with its data being the tags obtained. Additionally, the getAllTags function can also be used on any unique URL provided if the tags for that URL have been read:
```
`ID3.getAllTags(url)`
    `url` - The URL of the mp3 file to read, this must be the same value given to `ID3.loadTags()`.
    `return value` - The tags obtained.
```


Tag Formats
------------
Tag formats vary. The ID3v1 tags are:
```
    {
        version: "1.1",
        title: string,
        artist: string,
        album: string,
        year: string,
        comment: string,
        track: string,
        genre: string
    }
```
    
For ID3v2:
```
    {
        version: "2.<major>.<revision>",
        major: integer,
        revision: integer,
        flags: {
            unsynchronisation: boolean,
            extended_header: boolean,
            experimental_indicator: boolean
        },
        size: integer,
        <frame id>*: {
            id: integer,
            size: integer,
            description: string,
            data: <frame structure>
        },
        <shortcut>*: pointer to <frame id>.data
    }
```

    
For AAC:
```
    {
        album: string,
        artist: string,
        year: integer,
        title: string,
        genre: string,
        track: integer,
        composer': string,
        encoder: string,
        copyright: string,
        picture: {
            format: string,
            data: bytes[]
        },
        grouping: string,
        keyword: string,
        lyrics: string,
        genre: string
    }
```

### Currently supported frames on ID3:

* APIC/PIC: Attached picture
* COMM/COM: Comments
* PCNT/CNT: Play counter
* T*: Text frames
* USLT/ULT: Unsychronized lyric/text transcription

### Shortcuts:

* title: TIT2/TT2
* artist: TPE1/TP1
* album: TALB/TAL
* year: TYER/TYE
* comment: COMM/COM
* track: TRCK/TRK
* genre: TCON/TCO
* picture: APIC/PIC
* lyrics: USLT/ULT

A comprehensive list of all tags defined in the specification can be found [here](http://www.id3.org/id3v2.3.0#head-e4b3c63f836c3eb26a39be082065c21fba4e0acc)

Authors
-------
* Jacob Seidelin
* António Afonso
* Joshua Kifer
* Joseph T. Parsons