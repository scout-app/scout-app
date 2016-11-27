/* eslint-disable no-console */

// This is needed in order to test 404.html, router.js, and api.html

// NPM-Free Server by The Jared Wilcurt
// All you need to run this is an installed copy of Node.JS

// Require in some of the native stuff that comes with Node
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
// Port number to use
var port = process.argv[2] || 8000;
// Colors for CLI output
var WHT = '\033[39m';
var RED = '\033[91m';
var GRN = '\033[32m';

var livejs = '<script type="text/javascript" src="live.js"></script>';

// Create the server
http.createServer(function (request, response) {

    // The requested URL like http://localhost:8000/file.html
    var uri = url.parse(request.url).pathname;
    // get the file.html from above and then find it from the current folder
    var filename = path.join(process.cwd(), uri);

    // Setting up MIME-Types
    var contentTypesByExtension = {
        '.html': 'text/html',
        '.css':  'text/css',
        '.js':   'text/javascript',
        '.json': 'text/json',
        '.svg':  'image/svg+xml'
    };

    // Check if the requested file exists
    fs.exists(filename, function (exists) {
        // If it doesn't
        if (!exists) {
            // Output a red error pointing to failed request
            console.log(RED + 'FAIL: ' + filename);
            // Redirect the browser to the 404 page
            filename = path.join(process.cwd(), '/404.html');
        // If the requested URL is a folder, like http://localhost:8000/catpics
        } else if (fs.statSync(filename).isDirectory()) {
            // Output a green line to the console explaining what folder was requested
            console.log(GRN + 'FLDR: ' + WHT + filename);
            // redirect the user to the index.html in the requested folder
            filename += '/index.html';
        }

        // Assuming the file exists, read it
        fs.readFile(filename, 'binary', function (err, file) {
            // Output a green line to console explaining the file that will be loaded in the browser
            console.log(GRN + 'FILE: ' + WHT + filename);
            // If there was an error trying to read the file
            if (err) {
                // Put the error in the browser
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write(err + '\n');
                response.end();
                return;
            }

            file = file.replace('</body>', livejs + '\n</body>');

            // Get the human readable date/time stamp for last modified
            var dateModified = fs.lstatSync(filename);
            // Convert it to a unix time stamp
            dateModified = Date.parse(dateModified.mtime);

            // Otherwise, declar a headers object and a var for the MIME-Type
            var headers = {'etag': dateModified};
            var contentType = contentTypesByExtension[path.extname(filename)];
            // If the requested file has a matching MIME-Type
            if (contentType) {
                // Set it in the headers
                headers['Content-Type'] = contentType;
            }

            // Output the read file to the browser for it to load
            response.writeHead(200, headers);
            response.write(file, 'binary');
            response.end();
        });

    });

}).listen(parseInt(port, 10));

// Message to display when server is started
console.log(WHT + 'Static file server running at\n  => http://localhost:' + port + '/\nCTRL + C to shutdown');
