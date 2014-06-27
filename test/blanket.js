var path = require('path');
var fs = require('fs');
var srcDir = path.join(__dirname, '../');
var log = console;

require('blanket')({
    // Only files that match the pattern will be instrumented
    pattern: srcDir,
    'data-cover-never': ['test', 'node_modules']
});

function walkDir(dir, action) {

    // Assert that action is a function
    if (typeof action !== "function") {
        action = function (error, file) {
        };
    }

    if (Array.isArray(dir)) {
        // If dir is an array loop through all elements
        for (var i = 0; i < dir.length; i++) {
            walkDir(dir[i], action);
        }
    } else {
        // Make sure dir is relative to the current directory
        //if (dir.charAt(0) !== '.') {
        //    dir = '.' + dir;
        //}

        // Read the directory
        fs.readdir(dir, function (err, list) {

            // Return the error if something went wrong
            if (err) return action(err);

            // For every file in the list, check if it is a directory or file.
            // When it is a directory, recursively loop through that directory as well.
            // When it is a file, perform action on file.
            list.forEach(function (file) {
                var path = dir + "/" + file;
                fs.stat(path, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walkDir(path, action);
                    } else {
                        action(null, path);
                    }
                });
            });
        });
    }
}

// Loop through all paths in the blanket pattern

walkDir([
    //'app.js', // TODO currently ignored
    'config',
    'controller',
    'middleware',
    'model',
    'util'
], function (err, path) {
    if (err) {
        log.error(err);
        return;
    }
    //log.error('Including ' + path + ' for blanket.js code coverage');
    require(path);
});
