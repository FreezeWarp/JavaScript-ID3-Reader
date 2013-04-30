/**
 * Buffered Binary Ajax 0.2.1
 * Copyright (c) 2010 António Afonso, antonio.afonso gmail, http://www.aadsm.net/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 * Adapted from Binary Ajax 0.1.5 
 */

/**
 * @constructor
 */
function BinaryFile(strData, iDataOffset, iDataLength) {
  var data = strData,
    dataOffset = iDataOffset || 0,
    dataLength = iDataLength || data.length;

  this.getRawData = function() {
    return data;
  };

  this.getByteAt = function(iOffset) {
    return data.charCodeAt(iOffset + dataOffset) & 0xFF;
  };
  
  this.getBytesAt = function(iOffset, iLength) {
    var bytes = new Array(iLength);
    
    for(var i = 0; i < iLength; i++) {
      bytes[i] = this.getByteAt(iOffset+i);
    }
    
    return bytes;
  };

  this.getLength = function() {
    return dataLength;
  };

  this.isBitSetAt = function(iOffset, iBit) {
    var iByte = this.getByteAt(iOffset);
    
    return (iByte & (1 << iBit)) != 0;
  };

  this.getSByteAt = function(iOffset) {
    var iByte = this.getByteAt(iOffset);
    
    if (iByte > 127) return iByte - 256;
    else             return iByte;
  };

  this.getShortAt = function(iOffset, bBigEndian) {
    var iShort = bBigEndian ? 
      (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1) :
      (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
      
    if (iShort < 0) iShort += 65536;
    
    return iShort;
  };
  
  this.getSShortAt = function(iOffset, bBigEndian) {
    var iUShort = this.getShortAt(iOffset, bBigEndian);
    
    if (iUShort > 32767) return iUShort - 65536;
    else                 return iUShort;
  };
  
  this.getLongAt = function(iOffset, bBigEndian) {
    var iByte1 = this.getByteAt(iOffset),
      iByte2 = this.getByteAt(iOffset + 1),
      iByte3 = this.getByteAt(iOffset + 2),
      iByte4 = this.getByteAt(iOffset + 3),
      iLong = bBigEndian ? 
        (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4 :
        (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
        
    if (iLong < 0) iLong += 4294967296;
    return         iLong;
  };
  
  this.getSLongAt = function(iOffset, bBigEndian) {
    var iULong = this.getLongAt(iOffset, bBigEndian);
    
    if (iULong > 2147483647) return iULong - 4294967296;
    else                     return iULong;
  };
  
  // @aadsm
  this.getInteger24At = function(iOffset, bBigEndian) {
    var iByte1 = this.getByteAt(iOffset),
      iByte2 = this.getByteAt(iOffset + 1),
      iByte3 = this.getByteAt(iOffset + 2),
      iInteger = bBigEndian ? 
        ((((iByte1 << 8) + iByte2) << 8) + iByte3) :
        ((((iByte3 << 8) + iByte2) << 8) + iByte1);
        
    if (iInteger < 0) iInteger += 16777216;
    return iInteger;
  };
  
  this.getStringAt = function(iOffset, iLength) {
    var aStr = [];
    
    for (var i = iOffset, j = 0; i < iOffset + iLength; i++, j++) {
      aStr[j] = String.fromCharCode(this.getByteAt(i));
    }
    
    return aStr.join('');
  };
  
  this.getStringWithCharsetAt = function(iOffset, iLength, iCharset) {
    var bytes = this.getBytesAt(iOffset, iLength),
      sString;
    
    switch(iCharset.toLowerCase()) {
      case 'utf-16': case 'utf-16le': case 'utf-16be': sString = StringUtils.readUTF16String(bytes, iCharset); break;
      case 'utf-8':                                    sString = StringUtils.readUTF8String(bytes); break;
      default:                                         sString = StringUtils.readNullTerminatedString(bytes); break;
    }
    
    return sString;
  };

  this.getCharAt = function(iOffset) {
    return String.fromCharCode(this.getByteAt(iOffset));
  };
  
  this.toBase64 = function(strBase64) {
    return window.btoa(strBase64);
  };
  
  this.fromBase64 = function(strBase64) {
    return window.atob(strBase64);
  };
  
  this.loadRange = function(range, callback) {
    callback();
  };
}