
/*
  Handles all of the UI logic for the Multi-Project Import modal.
*/

(function ($, scout, ugui) {

    var fs = require('fs-extra');
    var path = require('path');

    /**
     * Checks the user profile, my docs, and root of some
     * drives (on Windows) for projects/GitHub folder.
     */
    function autoGuessProjectsFolder (callback) {
        var projectsFolder = '';
        var projectsFound = 0;
        var tempProjectsFolder = '';
        var autoProjects = ['github', 'projects', 'repositories', 'repos', 'websites'];

        // Set default paths to check based on OS standards
        var homePath = '';
        if (process.platform == 'linux') {
            homePath = process.env.HOME;
        } else if (process.platform == 'win32') {
            homePath = process.env.USERPROFILE;
        } else if (process.platform == 'darwin') {
            homePath = '/Users/' + process.env.USER;
            if (process.env.HOME) {
                homePath = process.env.HOME;
            }
        }
        var myDocsPath = path.join(homePath, 'Documents');
        var myDesktopPath = path.join(homePath, 'Desktop');

        if (homePath) {
            // Check the user profile for common project folders
            var contents = ugui.helpers.readAFolder(homePath);
            for (var i = 0; i < contents.length; i++) {
                for (var j = 0; j < autoProjects.length; j++) {
                    if (contents[i].name.toLowerCase() == autoProjects[j]) {
                        tempProjectsFolder = homePath.split('\\').join('/') + '/' + contents[i].name;
                        var innerContents = ugui.helpers.readAFolder(tempProjectsFolder);
                        // make sure there is at least one project folder in the projects folder
                        for (var k = 0; k < innerContents.length; k++) {
                            if (innerContents.length > 0 && innerContents[k].isFolder) {
                                projectsFound = projectsFound + 1;
                            }
                        }
                        if (projectsFound > 0) {
                            projectsFolder = tempProjectsFolder;
                            scout.ftux.projectsFound = projectsFound;
                            scout.ftux.projectsFolder = projectsFolder;
                            if (callback) {
                                callback();
                            }
                            return;
                        }
                    }
                }
            }
        }
        // then look in My Docs if it isn't in the user profile
        if (!projectsFolder && myDocsPath) {
            var myDocsContents = ugui.helpers.readAFolder(myDocsPath);
            for (var l = 0; l < myDocsContents.length; l++) {
                for (var m = 0; m < autoProjects.length; m++) {
                    if (myDocsContents[l].name.toLowerCase() == autoProjects[m]) {
                        tempProjectsFolder = myDocsPath.split('\\').join('/') + '/' + myDocsContents[l].name;
                        var myDocsInnerContents = ugui.helpers.readAFolder(tempProjectsFolder);
                        // make sure there is at least one project folder in the projects folder
                        for (var n = 0; n < myDocsInnerContents.length; n++) {
                            if (myDocsInnerContents.length > 0 && myDocsInnerContents[n].isFolder) {
                                projectsFound = projectsFound + 1;
                            }
                        }
                        if (projectsFound > 0) {
                            projectsFolder = tempProjectsFolder;
                            scout.ftux.projectsFound = projectsFound;
                            scout.ftux.projectsFolder = projectsFolder;
                            if (callback) {
                                callback();
                            }
                            return;
                        }
                    }
                }
            }
        }
        // then look on the Desktop if it isn't in the My Documents folder
        if (!projectsFolder && myDesktopPath) {
            var myDesktopContents = ugui.helpers.readAFolder(myDesktopPath);
            for (var o = 0; o < myDesktopContents.length; o++) {
                for (var p = 0; p < autoProjects.length; p++) {
                    if (myDesktopContents[o].name.toLowerCase() == autoProjects[p]) {
                        tempProjectsFolder = myDesktopPath.split('\\').join('/') + '/' + myDesktopContents[o].name;
                        var desktopContents = ugui.helpers.readAFolder(tempProjectsFolder);
                        // make sure there is at least one project folder in the projects folder
                        for (var q = 0; q < desktopContents.length; q++) {
                            if (desktopContents.length > 0 && desktopContents[q].isFolder) {
                                projectsFound = projectsFound + 1;
                            }
                        }
                        if (projectsFound > 0) {
                            projectsFolder = tempProjectsFolder;
                            scout.ftux.projectsFound = projectsFound;
                            scout.ftux.projectsFolder = projectsFolder;
                            if (callback) {
                                callback();
                            }
                            return;
                        }
                    }
                }
            }
        }
        // If on Window and no project folder was found in Docs or User, check drive roots (slow)
        if (!projectsFolder && process.platform == 'win32') {
            // Each drive letter adds like half a second to load time, so I limited them to the common ones
            var driveLetters = ['C', 'D', 'E', 'F', 'Z', 'Y', 'X', 'G', 'H', 'M', 'N'];
            var shortProjects = ['GitHub', 'Projects'];
            var stats = '';
            for (var r = 0; r < driveLetters.length; r++) {
                for (var s = 0; s < shortProjects.length; s++) {
                    var driveAndFolder = driveLetters[r] + ':/' + shortProjects[s];
                    try {
                        stats = fs.lstatSync(driveAndFolder);
                        if (stats.isDirectory()) {
                            tempProjectsFolder = driveAndFolder;
                            var driveFolderContents = ugui.helpers.readAFolder(tempProjectsFolder);
                            // make sure there is at least one project folder in the projects folder
                            for (var t = 0; t < driveFolderContents.length; t++) {
                                if (driveFolderContents.length > 0 && driveFolderContents[t].isFolder) {
                                    projectsFound = projectsFound + 1;
                                }
                            }
                            if (projectsFound > 0) {
                                projectsFolder = tempProjectsFolder;
                                scout.ftux.projectsFound = projectsFound;
                                scout.ftux.projectsFolder = projectsFolder;
                                if (callback) {
                                    callback();
                                }
                                return;
                            }
                        }
                    } catch (err) {
                        continue;
                    }
                }
            }
        }

        scout.ftux.projectsFound = projectsFound;
        scout.ftux.projectsFolder = projectsFolder;
        callback();
    }

    /**
     * Look in the projects/GitHub folder. Create checkboxes for each project folder.
     * Check to see if the project contains an input/output folder.
     *
     * @param  {string} path Location of project folders
     */
    function autoGrabProjects (projectsPath) {
        var projectsFolder = projectsPath || scout.ftux.projectsFolder;

        var projects = '';
        if (projectsFolder) {
            projects = ugui.helpers.readAFolder(projectsFolder);
        }
        if (!projectsFolder || projects.length < 1) {
            return;
        }

        var appendAfterExistingFilePath = checkIfFilepathRowExists(projectsFolder);

        if (!appendAfterExistingFilePath) {
            var filePathRow = generateFilePathRow(projectsFolder);
            $('#multi-import-modal tbody').append(filePathRow);
        }

        for (var i = 0; i < projects.length; i++) {
            var project = projects[i];
            if (project.isFolder) {
                var joinedFilePath = path.join(projectsFolder, project.name);
                var projectExists = checkForDupes(joinedFilePath);
                // Only give the project a new row if it does not already exist
                if (!projectExists) {
                    var row = generateProjectRow(project, projectsFolder, i);
                    if (appendAfterExistingFilePath) {
                        $(appendAfterExistingFilePath).after(row);
                    } else {
                        $('#multi-import-modal tbody').append(row);
                    }
                }
            }
        }
        updateSelectedCount();
        handleXs();
        $('#multi-import-modal tbody input').click(updateSelectedCount);
    }

    function addItemToMultiImportModal (projectPath, i) {
        var project = {
            'name': path.basename(projectPath)
        };
        var projectsFolder = path.dirname(projectPath);

        var appendAfterExistingFilePath = checkIfFilepathRowExists(projectsFolder);

        if (checkForDupes(projectPath)) {
            return;
        }

        var row = generateProjectRow(project, projectsFolder, i);

        if (appendAfterExistingFilePath) {
            $(appendAfterExistingFilePath).after(row);
        } else {
            var filePathRow = generateFilePathRow(projectsFolder);
            $('#multi-import-modal tbody').append(filePathRow);
            $('#multi-import-modal tbody').append(row);
        }
        updateSelectedCount();
        $('#multi-import-modal tbody input').click(updateSelectedCount);
        handleXs();
    }

    function checkIfFilepathRowExists (projectsFolder) {
        var appendAfterExistingFilePath = '';

        var allFilePaths = $('#multi-import-modal .filepath');
        for (var i = 0; i < allFilePaths.length; i++) {
            var currentPath = $(allFilePaths[i]).text();
            if (path.normalize(projectsFolder) === currentPath) {
                appendAfterExistingFilePath = allFilePaths[i];
            }
        }
        return appendAfterExistingFilePath;
    }

    function checkForDupes (filePath) {
        var potentialProjects = $('#multi-import-modal .potential-project input');
        var dupeStatus = false;
        for (var i = 0; i < potentialProjects.length; i++) {
            var existingRow = $(potentialProjects[i]).val();
            var possibleDupe = filePath;
            if (existingRow == possibleDupe) {
                dupeStatus = true;
            }
        }
        return dupeStatus;
    }

    function generateFilePathRow (projectsFolder) {
        var filePathRow =
          '<tr class="filepath">' +
            '<td class="text-primary" colspan="4">' + path.normalize(projectsFolder) + '</td>' +
            '<td class="text-center removable"><span class="glyphicon glyphicon-remove"></span></td>' +
          '</tr>';
        return filePathRow;
    }

    function generateProjectRow (project, projectsFolder, i) {
        i = i || 0;
        var fullProjectPath = path.join(projectsFolder, project.name);
        var projectContents = scout.helpers.autoGenerateProject(fullProjectPath, true);
        var currentName = project.name;
        var currentPath = path.join(projectsFolder, project.name);
        var currentProjId = 'sa' + (Date.now() + i);
        var input = '';
        var output = '';
        var checked = '';
        var inputTitle = '';
        var outputTitle = '';
        if (projectContents.inputFolder) {
            input = 'ok';
            inputTitle = 'title="' + path.normalize(projectContents.inputFolder) + '"';
        }
        if (projectContents.outputFolder) {
            output = 'ok';
            outputTitle = 'title="' + path.normalize(projectContents.outputFolder) + '"';
        }
        if (projectContents.inputFolder && projectContents.outputFolder) {
            checked = 'checked="checked"';
        }

        var row =
          '<tr class="potential-project">' +
            '<td><input type="checkbox" id="' + currentProjId + '" value="' + currentPath + '" ' + checked + ' />' +
            '<td><label for="' + currentProjId + '">' + currentName + '</label></td>' +
            '<td class="text-center"><label for="' + currentProjId + '"><span class="glyphicon glyphicon-' + input + '" ' + inputTitle + '></span></label></td>' +
            '<td class="text-center"><label for="' + currentProjId + '"><span class="glyphicon glyphicon-' + output + '" ' + outputTitle + '></span></label></td>' +
            '<td class="text-center removable"><span class="glyphicon glyphicon-remove"></span></td>' +
          '</tr>';
        return row;
    }

    function updateSelectedCount () {
        var allCheckboxes = $('#multi-import-modal tbody input');
        var total = 0;
        for (var i = 0; i < allCheckboxes.length; i++) {
            var currentCheckbox = allCheckboxes[i];
            var checked = $(currentCheckbox).prop('checked');
            if (checked) {
                total = total + 1;
                $(currentCheckbox).parent().parent().addClass('success');
            } else {
                $(currentCheckbox).parent().parent().removeClass('success');
            }
        }
        var importHeader = scout.localize('IMPORT_HEADER');
        var importButton = scout.localize('MULTI_IMPORT_BUTTON');
        importHeader = importHeader.replace('{{0}}', total);
        importButton = importButton.replace('{{0}}', total);

        $('#multiImportHeader').html(importHeader);
        $('#multiImportButton').html(importButton);
        multiImportUnlock();
    }

    function handleXs () {
        $('#multi-import-modal .potential-project .glyphicon-remove').hover(function () {
            $(this).parent().parent().addClass('danger');
        }, function () {
            $(this).parent().parent().removeClass('danger');
        });
        $('#multi-import-modal .potential-project .glyphicon-remove').click(function () {
            var nextRowIsProject = $(this).parent().parent().next().hasClass('potential-project');
            var prevRowIsFilePath = $(this).parent().parent().prev().hasClass('filepath');
            if (prevRowIsFilePath && !nextRowIsProject) {
                $(this).parent().parent().prev().remove();
            }
            $(this).parent().parent().remove();
            updateSelectedCount();
        });

        $('#multi-import-modal .filepath .glyphicon-remove').hover(function () {
            $(this).parent().parent().nextUntil('.filepath').addClass('danger');
        }, function () {
            $(this).parent().parent().nextUntil('.filepath').removeClass('danger');
        });
        $('#multi-import-modal .filepath .glyphicon-remove').click(function () {
            $(this).parent().parent().nextUntil('.filepath').remove();
            $(this).parent().parent().remove();
            updateSelectedCount();
        });
    }

    function multiImportUnlock () {
        var inputs = $('#multi-import-modal input');
        var checked = $('#multi-import-modal input:checked');

        if (inputs.length < 1 || checked.length < 1) {
            $('#ftuxStartImport').prop('disable', true).addClass('gray');
        } else {
            $('#ftuxStartImport').prop('disable', false).removeClass('gray');
        }
    }

    $('#multi-import-modal thead input').click(function (evt) {
        if (evt.target.checked) {
            $('#multi-import-modal tbody input').prop('checked', true);
        } else {
            $('#multi-import-modal tbody input').prop('checked', false);
        }
        updateSelectedCount();
    });

    $('#file-multi, #ftux-multi').click(function () {
        $('#multi-import-modal tbody').empty();
        $('#multi-import-modal').fadeIn();
        autoGrabProjects();
        multiImportUnlock();
    });

    $('#ftuxStartImport').click(function () {
        if (!$(this).hasClass('gray')) {
            $('#multi-import-modal .modal-header .glyphicon-remove').click();

            var projects = $('#multi-import-modal .potential-project input:checked');
            for (var i = 0; i < projects.length; i++) {
                var filePath = $(projects[i]).val();
                scout.helpers.autoGenerateProject(filePath);
            }
        }
    });

    $('#addProjectToImporter, #dragProjectToImporter').click(function (evt) {
        evt.preventDefault();
        $('#addProjectToImporterBrowse').click();
    });
    $('#addProjectsToImporter').click(function (evt) {
        evt.preventDefault();
        $('#addProjectsToImporterBrowse').click();
    });

    $('#addProjectToImporterBrowse').change(function () {
        var projectPath = $(this).val();
        if (projectPath) {
            addItemToMultiImportModal(projectPath);
        }
    });
    $('#addProjectsToImporterBrowse').change(function () {
        var projectsPath = $(this).val();
        if (projectsPath) {
            autoGrabProjects(projectsPath);
        }
    });

    scout.helpers.autoGuessProjectsFolder = autoGuessProjectsFolder;
    scout.helpers.addItemToMultiImportModal = addItemToMultiImportModal;

})(window.$, window.scout, window.ugui);
