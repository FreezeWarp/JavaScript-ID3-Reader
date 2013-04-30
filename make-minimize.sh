CLOSURE_COMPILER=/usr/local/closure-compiler/compiler.jar

java -jar "$CLOSURE_COMPILER" \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --js src/binaryfile.js \
    --js src/stringutils.js \
    --js src/id3.js \
    --js src/modules/ajaxreader.js \
    --js src/modules/filereader.js \
    --js src/modules/id3v1.js \
    --js src/modules/id3v2.js \
    --js src/modules/id3v2frames.js \
    --js src/modules/id4.js \
> dist/id3-minimized.js

#--formatting PRETTY_PRINT \