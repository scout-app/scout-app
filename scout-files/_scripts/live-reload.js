
/* eslint-disable no-console */

/*
  Live-Reload feature
*/

(function () {

    var fs = require('fs');
    var path = require('path');
    var http = require('http');
    var url = require('url');
    var lr = require('livereload');

    function liveReload (directory, port, cb) {

        // Port number to use
        port = port || 35729;

        // Create the server
        var server = http.createServer(function (request, response) {


            // The requested URL like http://localhost:8000/file.html
            var uri = url.parse(request.url).pathname;
            // get the file.html from above and then find it from the current folder
            var filename = path.join(directory, uri);

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
                    console.log('FAIL: ' + filename);
                    // Redirect the browser to the 404 page
                    filename = path.join(process.cwd(), '/404.html');
                // If the requested URL is a folder, like http://localhost:8000/catpics
                } else if (fs.statSync(filename).isDirectory()) {
                    // Output a green line to the console explaining what folder was requested
                    console.log('FLDR: ' + filename);
                    // redirect the user to the index.html in the requested folder
                    filename += '/index.html';
                }

                // Assuming the file exists, read it
                fs.readFile(filename, 'binary', function (err, file) {
                    // Output a green line to console explaining the file that will be loaded in the browser
                    console.log('FILE: ' + filename);
                    // If there was an error trying to read the file
                    if (err) {
                        // Put the error in the browser
                        response.writeHead(500, {'Content-Type': 'text/plain'});
                        response.write(err + '\n');
                        response.end();
                        return;
                    }

                    // Otherwise, declar a headers object and a var for the MIME-Type
                    var headers = {};
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
        console.log('Static file server running at http://localhost:' + port);



        var options = {
            'port': 35729,
            'exts': ['html', 'css', 'js', 'png', 'gif', 'jpg', 'jpeg', 'flif', 'webp', 'bpg', 'php', 'php5', 'py', 'rb', 'erb', 'coffee'],
            'applyCSSLive': true,
            'applyImgLive': true,
            'exclusions': ['.git/', '.svn/', '.hg/'],
            'delay': 10
        };
        var lrServer = lr.createServer(options, cb);

        lrServer.watch(directory);

        window.scout.bunny = server.close;
        window.scout.rabbit = lrServer.close;
        //  Append this to all html files that are served
        // document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')

    }

    window.scout.helpers.liveReload = liveReload;

    // scout.helpers.liveReload(scout.projects[0].projectFolder, 9002)

})();
