/*
 * Copyright (c) 2009 Opera Software ASA, António Afonso (antonio.afonso@opera.com)
 * Modified by António Afonso <antonio.afonso gmail.com>
 */

(function(tagsReader) {
  tagsReader.formatReader['id3v1'] = {
    _shortcuts : {
      'title'   : ['TIT2', 'TT2'],
      'artist'  : ['TPE1', 'TP1'],
      'album'   : ['TALB', 'TAL'],
      'year'    : ['TYER', 'TYE'],
      'comment' : ['COMM', 'COM'],
      'track'   : ['TRCK', 'TRK'],
      'genre'   : ['TCON', 'TCO'],
      'picture' : ['APIC', 'PIC'],
      'lyrics'  : ['USLT', 'ULT']
    },
    _defaultShortcuts : ['title', 'artist', 'album', 'track'],
    
    readFrameData : {},
 
    frames : {
      // v2.2
      'BUF' : 'Recommended buffer size',
      'CNT' : 'Play counter',
      'COM' : 'Comments',
      'CRA' : 'Audio encryption',
      'CRM' : 'Encrypted meta frame',
      'ETC' : 'Event timing codes',
      'EQU' : 'Equalization',
      'GEO' : 'General encapsulated object',
      'IPL' : 'Involved people list',
      'LNK' : 'Linked information',
      'MCI' : 'Music CD Identifier',
      'MLL' : 'MPEG location lookup table',
      'PIC' : 'Attached picture',
      'POP' : 'Popularimeter',
      'REV' : 'Reverb',
      'RVA' : 'Relative volume adjustment',
      'SLT' : 'Synchronized lyric/text',
      'STC' : 'Synced tempo codes',
      'TAL' : 'Album/Movie/Show title',
      'TBP' : 'BPM (Beats Per Minute)',
      'TCM' : 'Composer',
      'TCO' : 'Content type',
      'TCR' : 'Copyright message',
      'TDA' : 'Date',
      'TDY' : 'Playlist delay',
      'TEN' : 'Encoded by',
      'TFT' : 'File type',
      'TIM' : 'Time',
      'TKE' : 'Initial key',
      'TLA' : 'Language(s)',
      'TLE' : 'Length',
      'TMT' : 'Media type',
      'TOA' : 'Original artist(s)/performer(s)',
      'TOF' : 'Original filename',
      'TOL' : 'Original Lyricist(s)/text writer(s)',
      'TOR' : 'Original release year',
      'TOT' : 'Original album/Movie/Show title',
      'TP1' : 'Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group',
      'TP2' : 'Band/Orchestra/Accompaniment',
      'TP3' : 'Conductor/Performer refinement',
      'TP4' : 'Interpreted, remixed, or otherwise modified by',
      'TPA' : 'Part of a set',
      'TPB' : 'Publisher',
      'TRC' : 'ISRC (International Standard Recording Code)',
      'TRD' : 'Recording dates',
      'TRK' : 'Track number/Position in set',
      'TSI' : 'Size',
      'TSS' : 'Software/hardware and settings used for encoding',
      'TT1' : 'Content group description',
      'TT2' : 'Title/Songname/Content description',
      'TT3' : 'Subtitle/Description refinement',
      'TXT' : 'Lyricist/text writer',
      'TXX' : 'User defined text information frame',
      'TYE' : 'Year',
      'UFI' : 'Unique file identifier',
      'ULT' : 'Unsychronized lyric/text transcription',
      'WAF' : 'Official audio file webpage',
      'WAR' : 'Official artist/performer webpage',
      'WAS' : 'Official audio source webpage',
      'WCM' : 'Commercial information',
      'WCP' : 'Copyright/Legal information',
      'WPB' : 'Publishers official webpage',
      'WXX' : 'User defined URL link frame',
  
      // v2.3
      'AENC' : 'Audio encryption',
      'APIC' : 'Attached picture',
      'COMM' : 'Comments',
      'COMR' : 'Commercial frame',
      'ENCR' : 'Encryption method registration',
      'EQUA' : 'Equalization',
      'ETCO' : 'Event timing codes',
      'GEOB' : 'General encapsulated object',
      'GRID' : 'Group identification registration',
      'IPLS' : 'Involved people list',
      'LINK' : 'Linked information',
      'MCDI' : 'Music CD identifier',
      'MLLT' : 'MPEG location lookup table',
      'OWNE' : 'Ownership frame',
      'PRIV' : 'Private frame',
      'PCNT' : 'Play counter',
      'POPM' : 'Popularimeter',
      'POSS' : 'Position synchronisation frame',
      'RBUF' : 'Recommended buffer size',
      'RVAD' : 'Relative volume adjustment',
      'RVRB' : 'Reverb',
      'SYLT' : 'Synchronized lyric/text',
      'SYTC' : 'Synchronized tempo codes',
      'TALB' : 'Album/Movie/Show title',
      'TBPM' : 'BPM (beats per minute)',
      'TCOM' : 'Composer',
      'TCON' : 'Content type',
      'TCOP' : 'Copyright message',
      'TDAT' : 'Date',
      'TDLY' : 'Playlist delay',
      'TENC' : 'Encoded by',
      'TEXT' : 'Lyricist/Text writer',
      'TFLT' : 'File type',
      'TIME' : 'Time',
      'TIT1' : 'Content group description',
      'TIT2' : 'Title/songname/content description',
      'TIT3' : 'Subtitle/Description refinement',
      'TKEY' : 'Initial key',
      'TLAN' : 'Language(s)',
      'TLEN' : 'Length',
      'TMED' : 'Media type',
      'TOAL' : 'Original album/movie/show title',
      'TOFN' : 'Original filename',
      'TOLY' : 'Original lyricist(s)/text writer(s)',
      'TOPE' : 'Original artist(s)/performer(s)',
      'TORY' : 'Original release year',
      'TOWN' : 'File owner/licensee',
      'TPE1' : 'Lead performer(s)/Soloist(s)',
      'TPE2' : 'Band/orchestra/accompaniment',
      'TPE3' : 'Conductor/performer refinement',
      'TPE4' : 'Interpreted, remixed, or otherwise modified by',
      'TPOS' : 'Part of a set',
      'TPUB' : 'Publisher',
      'TRCK' : 'Track number/Position in set',
      'TRDA' : 'Recording dates',
      'TRSN' : 'Internet radio station name',
      'TRSO' : 'Internet radio station owner',
      'TSIZ' : 'Size',
      'TSRC' : 'ISRC (international standard recording code)',
      'TSSE' : 'Software/Hardware and settings used for encoding',
      'TYER' : 'Year',
      'TXXX' : 'User defined text information frame',
      'UFID' : 'Unique file identifier',
      'USER' : 'Terms of use',
      'USLT' : 'Unsychronized lyric/text transcription',
      'WCOM' : 'Commercial information',
      'WCOP' : 'Copyright/Legal information',
      'WOAF' : 'Official audio file webpage',
      'WOAR' : 'Official artist/performer webpage',
      'WOAS' : 'Official audio source webpage',
      'WORS' : 'Official internet radio station homepage',
      'WPAY' : 'Payment',
      'WPUB' : 'Publishers official webpage',
      'WXXX' : 'User defined URL link frame'
    },
  
    getTagsFromShortcuts : function(shortcuts) {
      var tags = [];

      for (var i = 0, shortcut; shortcut = shortcuts[i]; i++) {
        tags = tags.concat(_shortcuts[shortcut]||[shortcut]);
      }

      return tags;
    },
  
    // The ID3v2 tag/frame size is encoded with four bytes where the most significant bit (bit 7) is set to zero in every byte, making a total of 28 bits. The zeroed bits are ignored, so a 257 bytes long tag is represented as $00 00 02 01.
    readSynchsafeInteger32At : function(offset, data) {
      var size1 = data.getByteAt(offset),
        size2 = data.getByteAt(offset+1),
        size3 = data.getByteAt(offset+2),
        size4 = data.getByteAt(offset+3),
        size = size4 & 0x7f // 0x7f = 0b01111111
          | ((size3 & 0x7f) << 7)
          | ((size2 & 0x7f) << 14)
          | ((size1 & 0x7f) << 21);
    
      return size;
    },

    readFrameFlags : function(data, offset) {
      var flags = {
        message: {
          tag_alter_preservation  : data.isBitSetAt(offset, 6),
          file_alter_preservation : data.isBitSetAt(offset, 5),
          read_only               : data.isBitSetAt(offset, 4)
        },
        format: {
          grouping_identity     : data.isBitSetAt(offset+1, 7),
          compression           : data.isBitSetAt(offset+1, 3),
          encription            : data.isBitSetAt(offset+1, 2),
          unsynchronisation     : data.isBitSetAt(offset+1, 1),
          data_length_indicator : data.isBitSetAt(offset+1, 0)
        }
      };
      
      return flags;
    },

    /** All the frames consists of a frame header followed by one or more fields containing the actual information.
    * The frame ID made out of the characters capital A-Z and 0-9. Identifiers beginning with "X", "Y" and "Z" are for experimental use and free for everyone to use, without the need to set the experimental bit in the tag header. Have in mind that someone else might have used the same identifier as you. All other identifiers are either used or reserved for future use.
    * The frame ID is followed by a size descriptor, making a total header size of ten bytes in every frame. The size is calculated as frame size excluding frame header (frame size - 10).
    */
    readFrames : function(offset, end, data, id3header, tags) {
      var frames = {},
        frameDataSize,
        major = id3header["major"];
      
      tags = getTagsFromShortcuts(tags || _defaultShortcuts);
      
      while (offset < end) {
        var readFrameFunc = null,
          frameData = data,
          frameDataOffset = offset,
          flags = null;
        
        switch(major) {
          case 2:
          var frameID = frameData.getStringAt(frameDataOffset, 3),
            frameSize = frameData.getInteger24At(frameDataOffset+3, true),
            frameHeaderSize = 6;
          break;

          case 3:
          var frameID = frameData.getStringAt(frameDataOffset, 4),
            frameSize = frameData.getLongAt(frameDataOffset+4, true),
            frameHeaderSize = 10;
          break;
          
          case 4:
          var frameID = frameData.getStringAt(frameDataOffset, 4),
            frameSize = readSynchsafeInteger32At(frameDataOffset+4, frameData),
            frameHeaderSize = 10;
          break;
        }
        
        if (frameID == "") { break; } // if last frame GTFO
        offset += frameHeaderSize + frameSize; // advance data offset to the next frame data
        if (tags.indexOf(frameID) < 0) { continue; } // skip unwanted tags
        if (major > 2) flags = readFrameFlags(frameData, frameDataOffset+8); // read frame message and format flags
        
        frameDataOffset += frameHeaderSize;
        
        // the first 4 bytes are the real data size 
        // (after unsynchronisation && encryption)
        if (flags && flags.format.data_length_indicator) {
          frameDataSize = readSynchsafeInteger32At(frameDataOffset, frameData);
          frameDataOffset += 4;
          frameSize -= 4;
        }
        
        // TODO: support unsynchronisation
        if (flags && flags.format.unsynchronisation) {
          //frameData = removeUnsynchronisation(frameData, frameSize);
          continue;
        }
                
        // find frame parsing function
        if (frameID in ID3v2.readFrameData) {
          readFrameFunc = ID3v2.readFrameData[frameID];
        }
        else if (frameID[0] == "T") {
          readFrameFunc = ID3v2.readFrameData["T*"];
        }
        
        var parsedData = readFrameFunc ? readFrameFunc(frameDataOffset, frameSize, frameData, flags) : undefined;
        var desc = frameID in ID3v2.frames ? ID3v2.frames[frameID] : 'Unknown';
      
        var frame = {
          id      : frameID,
          size    : frameSize,
          description : desc,
          data    : parsedData
        };
      
        if (frameID in frames) {
          if (frames[frameID].id) frames[frameID] = [frames[frameID]];
  
          frames[frameID].push(frame);
        }
        else {
          frames[frameID] = frame;
        }
      }
    
      return frames;
    },

    getFrameData : function(frames, ids) {
      if (typeof ids == 'string') { ids = [ids]; }
    
      for (var i = 0, id; id = ids[i]; i++) {
        if (id in frames) { return frames[id].data; }
      }
    },
    
    loadData : function(data, callback) {
      data.loadRange([0, readSynchsafeInteger32At(6, data)], callback);
    },
    
    // http://www.id3.org/id3v2.3.0
    readTagsFromData : function(data, tags) {
      var offset = 0,
        major = data.getByteAt(offset+3);

      if (major > 4) { return {version: '>2.4'}; }

      var revision = data.getByteAt(offset+4),
        unsynch = data.isBitSetAt(offset+5, 7),
        xheader = data.isBitSetAt(offset+5, 6),
        xindicator = data.isBitSetAt(offset+5, 5),
        size = readSynchsafeInteger32At(offset+6, data);
        
      offset += 10;
      
      if (xheader) {
        var xheadersize = data.getLongAt(offset, true);
        // The 'Extended header size', currently 6 or 10 bytes, excludes itself.
        offset += xheadersize + 4;
      }

      var id3 = {
        "version" : '2.' + major + '.' + revision,
        "major" : major,
        "revision" : revision,
        "flags" : {
          "unsynchronisation" : unsynch,
          "extended_header" : xheader,
          "experimental_indicator" : xindicator
        },
        "size" : size
      },
        frames = unsynch ? {} : readFrames(offset, size-10, data, id3, tags);
      
      // create shortcuts for most common data
      for (var name in _shortcuts) {
        if (_shortcuts.hasOwnProperty(name)) {
          var data = getFrameData(frames, _shortcuts[name]);

          if (data) id3[name] = data;
        }
      }
      
      for (var frame in frames) {
        if (frames.hasOwnProperty(frame)) id3[frame] = frames[frame];
      }
      
      return id3;
    }
  }
})(tagsReader);