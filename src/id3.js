/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso <antonio.afonso gmail.com>
 */

(function(ns) {
  var ID3 = ns.ID3 = {},
    _files = {},
    _formatIDRange = [0, 7]; // location of the format identifier
  
  /**
   * Finds out the tag format of this data and returns the appropriate
   * reader.
   */
  function getTagReader(data) {
    // FIXME: improve this detection according to the spec
    return data.getStringAt(4, 7) == "ftypM4A" ? ID4 :
         (data.getStringAt(0, 3) == "ID3" ? ID3v2 : ID3v1);
  }
  
  /**
   * @param object reader - The fileReader object, which must contain the readTagsFromData method.
   * @param object data
   * @param string url
   * @param array tags
   */
  function readTags(reader, data, url, tags) {
    var tagsFound = reader.readTagsFromData(data, tags);
    //console.log("Downloaded data: " + data.getDownloadedBytesCount() + "bytes");
    var tags = _files[url] || {};
    
    for( var tag in tagsFound ) {
      if( tagsFound.hasOwnProperty(tag) ) tags[tag] = tagsFound[tag];
    }
    
    return _files[url] = tags;
  }

  ID3.clearTags = function(url) {
    delete _files[url];
  };

  ID3.clearAll = function() {
    _files = {};
  };

  /**
   * Load a file into memory and scan its tags.
   * 
   * @param {string} url The location of the sound file to read.
   * @param {{tags: Array.<string>, dataReader: function(string, function(BinaryReader))}} options The set of options that can specify the tags to be read and the dataReader to use in order to read the file located at url.
   */
  ID3.loadTags = function(url, options) {
    options = options || {};
    var dataReader = options["dataReader"] || BufferedBinaryAjax;
    
    dataReader(url, function(data) {
      // preload the format identifier
      data.loadRange(_formatIDRange, function() {
        var reader = getTagReader(data);
        
        reader.loadData(data, function() {
          tags = readTags(reader, data, url, options["tags"]);
          
          var id3Event = new CustomEvent(
            "ID3ReadFinish", {
              detail: tags,
              bubbles: true,
              cancelable: true
            }
          );
          window.dispatchEvent(id3Event);
        });
      });
    });   
  };

  ID3.getAllTags = function(url) {
    if (!_files[url]) return null;
    
    var tags = {};
    for (var a in _files[url]) {
      if (_files[url].hasOwnProperty(a))
        tags[a] = _files[url][a];
    }
    return tags;
  };

  ID3.getTag = function(url, tag) {
    if (!_files[url]) return null;

    return _files[url][tag];
  };
  
  // Export functions for closure compiler
  ns["ID3"] = ns.ID3;
  ID3["loadTags"] = ID3.loadTags;
  ID3["getAllTags"] = ID3.getAllTags;
  ID3["getTag"] = ID3.getTag;
  ID3["clearTags"] = ID3.clearTags;
  ID3["clearAll"] = ID3.clearAll;
})(this);