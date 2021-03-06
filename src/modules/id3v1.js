/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso (antonio.afonso gmail.com)
 * 
 * Modifications by Joseph Parsons <josephtparsons@gmail.com> (c) 2013, released under MIT license [http://www.opensource.org/licenses/mit-license.php].
 */

(function(tagsReader) {
  tagsReader.formatReader['id3v1'] = {
  
    // http://axon.cs.byu.edu/~adam/gatheredinfo/organizedtables/musicgenrelist.php
    genres : [
      // Primary
      'Blues', 'Classic Rock', 'Country', 'Dance', 'Disco', 'Funk', 'Grunge', 
      'Hip-Hop', 'Jazz', 'Metal', 'New Age', 'Oldies', 'Other', 'Pop', 'R&B', 
      'Rap', 'Reggae', 'Rock', 'Techno', 'Industrial', 'Alternative', 'Ska', 
      'Death Metal', 'Pranks', 'Soundtrack', 'Euro-Techno', 'Ambient', 
      'Trip-Hop', 'Vocal', 'Jazz+Funk', 'Fusion', 'Trance', 'Classical', 
      'Instrumental', 'Acid', 'House', 'Game', 'Sound Clip', 'Gospel', 
      'Noise', 'AlternRock', 'Bass', 'Soul', 'Punk', 'Space', 'Meditative', 
      'Instrumental Pop', 'Instrumental Rock', 'Ethnic', 'Gothic', 
      'Darkwave', 'Techno-Industrial', 'Electronic', 'Pop-Folk', 
      'Eurodance', 'Dream', 'Southern Rock', 'Comedy', 'Cult', 'Gangsta', 
      'Top 40', 'Christian Rap', 'Pop/Funk', 'Jungle', 'Native American', 
      'Cabaret', 'New Wave', 'Psychadelic', 'Rave', 'Showtunes', 'Trailer', 
      'Lo-Fi', 'Tribal', 'Acid Punk', 'Acid Jazz', 'Polka', 'Retro', 
      'Musical', 'Rock & Roll', 'Hard Rock',
  
      // Extended
      'Folk', 'Folk-Rock', 
      'National Folk', 'Swing', 'Fast Fusion', 'Bebob', 'Latin', 'Revival', 
      'Celtic', 'Bluegrass', 'Avantgarde', 'Gothic Rock', 'Progressive Rock', 
      'Psychedelic Rock', 'Symphonic Rock', 'Slow Rock', 'Big Band', 
      'Chorus', 'Easy Listening', 'Acoustic', 'Humour', 'Speech', 'Chanson', 
      'Opera', 'Chamber Music', 'Sonata', 'Symphony', 'Booty Bass', 'Primus', 
      'Porn Groove', 'Satire', 'Slow Jam', 'Club', 'Tango', 'Samba', 
      'Folklore', 'Ballad', 'Power Ballad', 'Rhythmic Soul', 'Freestyle', 
      'Duet', 'Punk Rock', 'Drum Solo', 'Acapella', 'Euro-House', 'Dance Hall'
    ],

    loadData : function(data, callback) {
      var length = data.getLength();
      
      data.loadRange([length-128-1, length], callback);
    },

    readTagsFromData : function(data) {
      var offset = data.getLength() - 128,
        header = data.getStringAt(offset, 3);
      
      if (header == "TAG") {
        // http://id3.org/ID3v1
        var title = data.getStringAt(offset + 3, 30).replace(/\0/g, ""),
          artist = data.getStringAt(offset + 33, 30).replace(/\0/g, ""),
          album = data.getStringAt(offset + 63, 30).replace(/\0/g, ""),
          year = data.getStringAt(offset + 93, 4).replace(/\0/g, ""),
          trackFlag = data.getByteAt(offset + 97 + 28),
          genreIdx = data.getByteAt(offset + 97 + 30),
          genre = (genreIdx < 255 ? genres[genreIdx] : ''),
          comment = (trackFlag == 0 ? data.getStringAt(offset + 97, 28).replace(/\0/g, "") : ''),
          track = (trackFlag == 0 ? data.getByteAt(offset + 97 + 29) : 0);
          
        return {
          'format' : 'id3v1',
          'version' : '1.1',
          'title' : title,
          'artist' : artist,
          'album' : album,
          'year' : year,
          'comment' : comment,
          'track' : track,
          'genre' : genre
        }
      }
      else {
        return {};
      }
    }
  }
})(tagsReader);