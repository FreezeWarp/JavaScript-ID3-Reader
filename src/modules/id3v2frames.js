/*
 * Copyright (c) 2009 Opera Software ASA, António Afonso (antonio.afonso@opera.com)
 * Modified by António Afonso <antonio.afonso gmail.com>
 */
(function(tagsReader) {
  if (typeof tagsReader.formatReader.id3v2 !== 'object') {
    return false;
  }

  tagsReader.formatReader.id3v2.pictureType = [
    "32x32 pixels 'file icon' (PNG only)",
    "Other file icon",
    "Cover (front)",
    "Cover (back)",
    "Leaflet page",
    "Media (e.g. lable side of CD)",
    "Lead artist/lead performer/soloist",
    "Artist/performer",
    "Conductor",
    "Band/Orchestra",
    "Composer",
    "Lyricist/text writer",
    "Recording Location",
    "During recording",
    "During performance",
    "Movie/video screen capture",
    "A bright coloured fish",
    "Illustration",
    "Band/artist logotype",
    "Publisher/Studio logotype"
  ];
  
  tagsReader.formatReader.id3v2.getTextEncoding = function(bite) {
    var charset;
    
    switch(bite) {
      case 0x00: charset = 'iso-8859-1'; break;
      case 0x01: charset = 'utf-16';     break;
      case 0x02: charset = 'utf-16be';   break;
      case 0x03: charset = 'utf-8';      break;
    }
    
    return charset;
  }
  
  tagsReader.formatReader.id3v2.getTime = function(duration) {
    var duration  = duration/1000,
      seconds   = Math.floor(duration) % 60,
      minutes   = Math.floor(duration/60) % 60,
      hours     = Math.floor(duration/3600);
      
    return {
      seconds : seconds,
      minutes : minutes,
      hours   : hours
    };
  }
  
  tagsReader.formatReader.id3v2.formatTime = function(time) {
    var seconds = time.seconds < 10 ? '0'+time.seconds : time.seconds,
      minutes = (time.hours > 0 && time.minutes < 10) ? '0' + time.minutes : time.minutes;
    
    return (time.hours>0?time.hours+':':'') + minutes + ':' + seconds;
  }

  tagsReader.formatReader.id3v2.readFrameData = {
    'APIC' : function readPictureFrame(offset, length, data, flags, v) {    
      var start = offset,
        charset = getTextEncoding(data.getByteAt(offset));
        
      v = v || '3';

      switch(v) {
        case '2':
          var format = data.getStringAt(offset+1, 3);
          offset += 4;
        break;
          
        case '3': case '4':
          var format = data.getStringWithCharsetAt(offset + 1, length - (offset - start), charset);
          offset += 1 + format.bytesReadCount;
        break;
      }
      
      var bite = data.getByteAt(offset, 1),
        type = pictureType[bite],
        desc = data.getStringWithCharsetAt(offset + 1, length - (offset - start), charset);
      
      offset += 1 + desc.bytesReadCount;
      
      return {
        "format" : format.toString(),
        "type" : type,
        "description" : desc.toString(),
        "data" : data.getBytesAt(offset, (start + length) - offset)
      };
    },
  
    'COMM' : function readCommentsFrame(offset, length, data) {
      var start = offset,
        charset = getTextEncoding(data.getByteAt(offset)),
        language = data.getStringAt(offset+1, 3),
        shortdesc = data.getStringWithCharsetAt(offset+4, length-4, charset);
      
      offset += 4 + shortdesc.bytesReadCount;
      var text = data.getStringWithCharsetAt(offset, (start+length) - offset, charset);
      
      return {
        language : language,
        short_description : shortdesc.toString(),
        text : text.toString()
      };
    },
  
    'PIC' : function(offset, length, data, flags) {
      return tagsReader.formatReader.id3v2.readFrameData['APIC'](offset, length, data, flags, '2');
    },
  
    'PCNT' : function readCounterFrame(offset, length, data) {
      // FIXME: implement the rest of the spec
      return data.getInteger32At(offset);
    },
  
    'T*' : function readTextFrame(offset, length, data) {
      var charset = getTextEncoding(data.getByteAt(offset));
    
      return data.getStringWithCharsetAt(offset+1, length-1, charset).toString();
    },
    
    'TCON' : function readGenreFrame(offset, length, data) {
      var text = tagsReader.formatReader.id3v2.readFrameData['T*'].apply(this, arguments);
      return text.replace(/^\(\d+\)/, '');
    },
  
    /* TODO
    'TLEN' : function readLengthFrame(offset, length, data) {
      var text = tagsReader.formatReader.id3v2.readFrameData['T*'].apply(this, arguments);
      
      return {
        text : text,
        parsed : formatTime(getTime(parseInt(text)))
      };
    };*/
    
    'USLT' : function readLyricsFrame(offset, length, data) {
      var start = offset,
        charset = getTextEncoding(data.getByteAt(offset)),
        language = data.getStringAt(offset+1, 3),
        descriptor = data.getStringWithCharsetAt(offset+4, length-4, charset),
        lyrics;
      
      offset += 4 + descriptor.bytesReadCount;
      lyrics = data.getStringWithCharsetAt(offset, (start+length) - offset, charset);
      
      return {
        language : language,
        descriptor : descriptor.toString(),
        lyrics : lyrics.toString()
      };
    }
  }
  
  tagsReader.formatReader.id3v2.readFrameData['COM'] = tagsReader.formatReader.id3v2.readFrameData['COMM'];
  tagsReader.formatReader.id3v2.readFrameData['CNT'] = tagsReader.formatReader.id3v2.readFrameData['PCNT'];
  tagsReader.formatReader.id3v2.readFrameData['TCO'] = tagsReader.formatReader.id3v2.readFrameData['TCON'];
  tagsReader.formatReader.id3v2.readFrameData['ULT'] = tagsReader.formatReader.id3v2.readFrameData['USLT'];
})(tagsReader);