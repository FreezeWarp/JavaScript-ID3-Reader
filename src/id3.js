/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso <antonio.afonso gmail.com>
 */

tagReader = {
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
    tagReader._errors.pop();
  },
  
  /*
   * Throws an error.
   */
  _throwError : function(errorString) {
    tagReader._errors.push(errorString);
  },
  
  
  
  
  ///////////////////
  /// File Reader ///
  ///////////////////
  fileReader : {},
  
  
  
  
  
  ////////////////////
  /// Analyse Tags ///
  ////////////////////
  /**
   * Finds out the tag format of this data and returns the appropriate
   * reader.
   */
  getTagReader : function(data) {
    // FIXME: improve this detection according to the spec
    return data.getStringAt(4, 7) == "ftypM4A" ? ID4 :
         (data.getStringAt(0, 3) == "ID3" ? ID3v2 : ID3v1);
  },
  
  /**
   * Load a file into memory and scan its tags.
   * 
   * @param {string} url The location of the sound file to read.
   * @param {{tags: Array.<string>, dataReader: function(string, function(BinaryReader))}} options The set of options that can specify the tags to be read and the dataReader to use in order to read the file located at url.
   */
  loadTags : function(url, options) {
    var dataReader = options["dataReader"] || BufferedBinaryAjax,
      id3StartEvent = new CustomEvent(
        "ID3ReadStart", {
          detail: url
        }
      ),
      id3FinishEvent,
      reader;
      
    options = options || {};
    
    window.dispatchEvent(id3StartEvent);
    
    dataReader(url, function(data) {
      data.loadRange(fileReader._formatIDRange, function() { // preload the format identifier
        var formatReader = getTagReader(data);
        
        formatReader.loadData(data, function() {
          var tagsFound = reader.readTagsFromData(data, options["tags"]),
            returnTags = tagReader.files[url] || {};
          
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
    if (typeof fileReader.files[url][tags] === 'number'
      || typeof fileReader.files[url][tags] === 'string') return true; 
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