(function () {

    var fs = require('fs-extra');
    var path = require('path');
    var gui = require('nw.gui');
    var appData = gui.App.dataPath;
    var body = $('html')[0];

    // send files to the not already running app
    // ("Open With" or drag-n-drop)
    if (gui.App.argv.length) {
        var files = gui.App.argv.map(function (path) {
            return {
                name: path.substring(path.lastIndexOf('/') + 1),
                path: path
            };
        });

        onFilesDrop(files);
    }

    // send files to the already running app
    // ("Open With" or drag-n-drop)
    gui.App.on('open', function (path) {
        onFilesDrop([{
            name: path.substring(path.lastIndexOf('/') + 1),
            path: path
        }]);
    });

    body.ondragover = function () {
        return false;
    };

    body.ondragenter = function () {
        $('#drag-in-folders').fadeIn();
    };

    body.ondragleave = function () {
        $('#drag-in-folders').fadeOut();
    };

    // drag-n-drop files to the app window's special holder
    body.ondrop = function (evt) {
        evt.preventDefault();
        var files = [].slice.call(evt.dataTransfer.files);
        onFilesDrop(files);
        $('#drag-in-folders').fadeOut('fast');
    };

    /**
     * Actions to perform when new files are imported
     * @param  {array} files A list of folders
     */
    function onFilesDrop (folders) {
        for (var i = 0; i < folders.length; i++) {
            var folder = folders[i].path;
            var isFolder = fs.lstatSync(folder).isDirectory();
            if (isFolder) {
                scout.helpers.autoGenerateProject(folder);
            }
        };
    }

})();
