/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso <antonio.afonso gmail.com>
 * 
 * Modified by Joseph Parsons <josephtparsons@gmail.com>, 2013. Changes released under MIT license.
 */

tagsReader = {
  /////////////////
  /// Variables ///
  /////////////////
  _files : {},
  _errors : [],
  _formatIDRange : [0, 7], // location of the format identifier
  
  
  
  
  
  //////////////////////
  /// Error Handling ///
  //////////////////////
  /*
   * Returns information for the last error encountered by the library. The function will return previous errors if called more than once.
   */
  getLastError : function() {
    tagsReader._errors.pop();
  },
  
  /*
   * Throws an error.
   */
  _throwError : function(errorString) {
    tagsReader._errors.push(errorString);
  },
  
  
  
  
  ///////////////////
  /// File Reader ///
  ///////////////////
  dataReader : {
    // upload, ajax
  },
  
  
  
  
  //////////////////
  /// Tag Reader ///
  //////////////////  
  /**
  * Finds out the tag format of this data and returns the appropriate reader.
  * @todo improve this detection according to the spec
  */
  getFormat : function(data) {
    if (data.getStringAt(4, 7) === 'ftypM4A') {
      return 'id4';
    }
    
    else if (data.getStringAt(0, 3) === 'ID3') {
      return 'id3v2';
    }
    
    else {
      return 'id3v1';
    }
  },
    
  
  formatReader : {
    
    id4 : false,
    id3v1 : false,
    id3v2 : false,
    
  },
  
  
  
  
  
  ////////////////////
  /// Analyse Tags ///
  ////////////////////
  
  /**
   * Load a file into memory and scan its tags.
   * 
   * @param {string} url The location of the sound file to read.
   * @param {{tags: Array.<string>, dataReader: function(string, function(BinaryReader))}} options The set of options that can specify the tags to be read and the dataReader to use in order to read the file located at url.
   */
  loadTags : function(url, options) {
    var dataReader = options.dataReader,
      id3StartEvent = new CustomEvent(
        "ID3ReadStart", {
          detail: url
        }
      ),
      id3FinishEvent,
      reader;
      
    options = options || {};
    
    if (typeof dataReader !== 'object') {
      tagsReader._throwError('A valid dataReader was not passed.'); 
      return false;
    }
    
    window.dispatchEvent(id3StartEvent);
    
    dataReader(url, function(data) {
      data.loadRange(fileReader._formatIDRange, function() { // preload the format identifier
        var format = getTagReader(data),
          formatReader;
        
                     
        if (typeof tagsReader.formatReader[format] !== '') {
          tagsReader._throwError('The format speciifed is not supported.'); 
          return false;
        }
        
        
        formatReader.loadData(data, function() {
          var tagsFound = reader.readTagsFromData(data, options["tags"]),
            returnTags = tagsReader.files[url] || {};
          
          //console.log("Downloaded data: " + data.getDownloadedBytesCount() + "bytes");
          
          for (var tag in tagsFound) {
            if (tagsFound.hasOwnProperty(tag)) returnTags[tag] = tagsFound[tag];
          }
          
          return fileReader.files[url] = returnTags;
          
          id3FinishEvent = new CustomEvent(
            "ID3ReadFinish", {
              detail: tags
            }
          );
          window.dispatchEvent(id3Event);
        });
      });
    });   
  },
  
  
 
  
  
  //////////////////
  /// Check Tags ///
  //////////////////
  /*
   * Check if a tag exists.
   * The internal logic of this function ensures that a tag is either a number or string. Any other value is rejected.
   */
  tagExists : function(url, tags) {
    if (typeof tagsReader.files[url][tags] === 'number'
      || typeof tagsReader.files[url][tags] === 'string') return true; 
    else return false;
  },
  
  
  /*
   * Check if a URL exists.
   * The internal logic of this function ensures that the result is an object.
   */
  urlExists : function(url) {
    if (typeof fileReader.files[url] === 'object') return true;
    else return false;
  },
  
  
  /*
   * Obtain a specific tag. (PRIVATE METHOD)
   * This function guards against errors.
   */
  _getTag : function(url, tag) {
    tag = tag || false;
    
    if (!urlExists(url)) {
      tagsReader._throwNewError('Could not read tags for URL: ' + url);
      return false;
    }
    else if (tag === false) {
      return fileReader._files[url];
    }
    else if (!tagExists(url, tag)) {
      tagsReader._throwNewError('Could not read tag "' + tag + '" for URL: ' + url);
      return false;
    }
    else {
      return fileReader._files[url][tag];
    }
  },
  

  /*
   * Obtain tags from a file. Before calling this function, loadTags() must have been used to load tag information for the file into memory.
   */
  getTags : function(url, tags) {
    var returnTags = {},
      tagName;
    
    if (tags === false) return tagsReader._getTag(url);
    else {
      for (tagName in tags) {
        if (false === (returnTags[tagName] = tagsReader._getTag(url, tagName))) {
          return false; // Use fileReader.getLastError() to find problem.
        }
      }
    }

    return returnTags;
  },

  
  /*
   * Clear all tags, or tags for a specific URL if specified.
   */
  clearTags : function(url) {
    url = url | false;
    
    if (url === false) fileReader.files = {};
    else delete fileReader.files[url];
  }
}