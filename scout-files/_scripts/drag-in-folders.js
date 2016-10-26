(function () {

    var fs = require('fs-extra');
    var path = require('path');
    var gui = require('nw.gui');
    var appData = gui.App.dataPath;
    var modal = $('#drag-in-folders')[0];

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


    function showModal () {
        modal.style.visibility = 'visible';
    }
    function hideModal () {
        modal.style.visibility = 'hidden';
    }

    function allowDrag (evt) {
        if (true) {  // Test that the item being dragged is a valid one
            evt.dataTransfer.dropEffect = 'copy';
            evt.preventDefault();
        }
    }

    function handleDrop (evt) {
        evt.preventDefault();
        var files = [].slice.call(evt.dataTransfer.files);
        onFilesDrop(files);
        hideModal();
    }

    window.addEventListener('dragenter', function () {
        showModal();
    });
    modal.addEventListener('dragenter', allowDrag);
    modal.addEventListener('dragover', allowDrag);
    modal.addEventListener('dragleave', function () {
        hideModal();
    });
    modal.addEventListener('drop', handleDrop);

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
