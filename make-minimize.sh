CLOSURE_COMPILER=/usr/local/closure-compiler/compiler.jar

java -jar "$CLOSURE_COMPILER" \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --js src/binaryfile.js \
    --js src/stringutils.js \
    --js src/ajaxreader.js \
    --js src/filereader.js \
    --js src/id3.js \
    --js src/id3v1.js \
    --js src/id3v2.js \
    --js src/id3v2frames.js \
    --js src/id4.js \
> dist/id3-minimized.js

#--formatting PRETTY_PRINT \