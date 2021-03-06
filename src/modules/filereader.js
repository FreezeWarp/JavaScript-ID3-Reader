/**
 * Copyright (c) 2010 António Afonso, antonio.afonso gmail, http://www.aadsm.net/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Modifications by Joseph Parsons <josephtparsons@gmail.com> (c) 2013, released under MIT license [http://www.opensource.org/licenses/mit-license.php].
 */

(function(tagsReader) {
  tagsReader.dataReader['upload'] = function(file) {
    return function(url, fncCallback, fncError) {
      var reader = new FileReader();

      reader.onload = function(event) {
        var result = event.target.result;
        fncCallback(new BinaryFile(result));
      };
      
      reader.readAsBinaryString(file);
    }
  }
})(tagsReader);