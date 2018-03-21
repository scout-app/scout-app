
/*
  Event bindings and DOM Manipulation.
*/

(function ($, scout, ugui) {

    function projectRenameHeight () {
        var inputHeight = $('#projectNameEditable').height();
        if (inputHeight == 0) {
            inputHeight = 34;
        }
        $('#projectNameEditable .glyphicon').css('line-height', inputHeight + 'px');
    }
    window.setTimeout(projectRenameHeight, 500);

    function resetProjectName () {
        $('#projectNameEditable').hide();
        $('#projectName').show();
    }
    function confirmNewProjectName () {
        var projectID = $('#projectID').val();
        var newName = $('#projectNameEditable input').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == projectID) {
                scout.projects[i].projectName = newName;
                break;
            }
        }
        $('#projectName').html(newName);
        scout.helpers.updateSidebar();
        resetProjectName();
        scout.helpers.saveSettings();
    }
    function cancelNewProjectName () {
        resetProjectName();
    }

    $('#projectName').click(function () {
        var origName = $(this).text();
        $(this).hide();
        $('#projectNameEditable input').val(origName);
        $('#projectNameEditable').show();
        $('#projectNameEditable').keyup(function (evt) {
            evt.preventDefault();
            // if user hit enter
            if (evt.keyCode == 13) {
                confirmNewProjectName();
            // if user hit escape
            } else if (evt.keyCode == 27) {
                cancelNewProjectName();
            }
        });
    });
    $('#projectNameEditable .glyphicon-ok').click(confirmNewProjectName);
    $('#projectNameEditable .glyphicon-remove').click(cancelNewProjectName);

    // Set the default starting folder for browse boxes
    var projectFolder = $('#projectFolder').val();
    $('#projectIconBrowse').attr('nwworkingdir', projectFolder);
    $('#inputFolderBrowse').attr('nwworkingdir', projectFolder);
    $('#outputFolderBrowse').attr('nwworkingdir', projectFolder);

    $('#projectIconHover').click(function () { $('#projectIconBrowse').click(); });
    $('#inputFolderIcon').click(function () { $('#inputFolderBrowse').click(); });
    $('#outputFolderIcon').click(function () { $('#outputFolderBrowse').click(); });

    $('#projectIconBrowse').change(function () {
        var newImg = $('#projectIconBrowse').val();
        $('#projectIcon').attr('src', newImg);
        var id = $('#projectID').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].projectIcon = newImg;
                scout.helpers.saveSettings();
            }
        }
    });
    $('#inputFolderBrowse').change(function () {
        var newDir = $('#inputFolderBrowse').val();
        newDir = newDir.split('\\').join('/');
        $('#inputFolder').val(newDir);
        forbidSameFolder();
        var id = $('#projectID').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].inputFolder = newDir;
                scout.helpers.saveSettings();
            }
        }
    });
    $('#outputFolderBrowse').change(function () {
        var newDir = $('#outputFolderBrowse').val();
        newDir = newDir.split('\\').join('/');
        $('#outputFolder').val(newDir);
        forbidSameFolder();
        var id = $('#projectID').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].outputFolder = newDir;
                scout.helpers.saveSettings();
            }
        }
    });
    $('#outputStyle').change(function () {
        var id = $('#projectID').val();
        var outputStyle = $('#outputStyle').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (id == scout.projects[i].projectID) {
                scout.projects[i].outputStyle = outputStyle;
            }
        }
        scout.helpers.saveSettings();
    });
    $('#linefeed input').change(function (evt) {
        var id = $('#projectID').val();
        var linefeed = $(evt.currentTarget).val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (id == scout.projects[i].projectID) {
                scout.projects[i].linefeed = linefeed;
            }
        }
        scout.helpers.saveSettings();
    });
    $('#inputFolder').on('blur', function () {
        var newDir = $('#inputFolder').val();
        newDir = newDir.split('\\').join('/');
        forbidSameFolder();
        var id = $('#projectID').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].inputFolder = newDir;
                scout.helpers.saveSettings();
            }
        }
    });
    $('#outputFolder').on('blur', function () {
        var newDir = $('#outputFolder').val();
        newDir = newDir.split('\\').join('/');
        forbidSameFolder();
        var id = $('#projectID').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (scout.projects[i].projectID == id) {
                scout.projects[i].outputFolder = newDir;
                scout.helpers.saveSettings();
            }
        }
    });

    // Clicking the "Status of all Projects" sidebar buttons
    $('#viewStatus').click(function (evt) {
        evt.preventDefault();
        $('#project-settings').addClass('hide');
        $('#printConsoleTitle').removeClass('hide');
        $('#sidebar .active').removeClass('active');
        $('#printConsole .alert, #printConsole .panel').removeClass('hide');
    });

    $('.navbar a[href="#viewStatus"]').click(function () {
        $('#viewStatus').click();
    });

    function forbidSameFolder () {
        var inputDir = $('#inputFolder').val();
        var outputDir = $('#outputFolder').val();
        var id = $('#projectID').val();

        // Update projects object
        for (var i = 0; i < scout.projects.length; i++) {
            if (id == scout.projects[i].projectID) {
                scout.projects[i].inputFolder = inputDir;
                scout.projects[i].outputFolder = outputDir;
            }
        }

        // Check validity of input and output
        if (inputDir === '' || outputDir === '') {
            $('#outputWarning').addClass('hide');
            lockSubmit(id);
        } else if ((inputDir === outputDir) || (outputDir.startsWith(inputDir + '/'))) {
            $('#outputWarning').removeClass('hide');
            lockSubmit(id);
        } else {
            $('#outputWarning').addClass('hide');
            unlockSubmit(id);
        }
    }

    $('#inputFolder, #outputFolder').keyup(forbidSameFolder).mouseup(forbidSameFolder).change(forbidSameFolder);

    function lockSubmit (id) {
        id = id || $('#projectID').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (id == scout.projects[i].projectID) {
                scout.projects[i].indicator = 'gray-play';
                scout.helpers.updateSidebar();
                scout.helpers.saveSettings();
                $('#sidebar .active').removeClass('active');
                $('#sidebar .' + id).addClass('active');
                return;
            }
        }
    }

    function unlockSubmit (id) {
        id = id || $('#projectID').val();
        for (var i = 0; i < scout.projects.length; i++) {
            var project = scout.projects[i];
            var inputDir = project.inputFolder;
            var outputDir = project.outputFolder;
            if (
                (inputDir === '') ||
                (outputDir === '') ||
                (inputDir === outputDir) ||
                (outputDir.startsWith(inputDir + '/')) ||
                (outputDir.startsWith(inputDir + '\\'))
            ) {
                project.indicator = 'gray-play';
                scout.helpers.stopWatching(project.projectID);
            } else if (project.indicator == 'stop') {
                project.indicator = 'stop';
            } else {
                project.indicator = 'play';
            }
        }
        scout.helpers.updateSidebar();
        $('#sidebar .active').removeClass('active');
        if (id) {
            $('#sidebar .' + id).addClass('active');
        }
    }

    $('#environment input').change(function (evt) {
        ugui.helpers.buildUGUIArgObject();
        var manuallyUpdateOutputStyle = false;
        if (ugui.args.development.htmlticked) {
            $($('#outputStyle option')[3]).hide();
            $($('#outputStyle option')[4]).hide();

            var isLabelSelected = $($('#outputStyle option')[0]).prop('selected');
            var isNestedSelected = $($('#outputStyle option')[1]).prop('selected');
            // If the first or second items in the dropdown are picked, that's cool, set everything else to the 3rd option
            if (isLabelSelected == false && isNestedSelected == false) {
                // Select "Expanded"
                $($('#outputStyle option')[2]).prop('selected', true);
                manuallyUpdateOutputStyle = true;
            }
        } else {
            $($('#outputStyle option')[3]).show();
            $($('#outputStyle option')[4]).show();
        }

        var environment = $(evt.currentTarget).val();
        var id = $('#projectID').val();
        for (var i = 0; i < scout.projects.length; i++) {
            if (id === scout.projects[i].projectID) {
                scout.projects[i].environment = environment;
                if (manuallyUpdateOutputStyle) {
                    scout.projects[i].outputStyle = $('#outputStyle').val();
                }
            }
        }

        scout.helpers.saveSettings();
    });

    /**
     * DELETING A PROJECT
     */
    // Remove modal, enable scrollbar
    function removeModal () {
        $('.modal').slideUp('slow', function () {
            $('body').removeClass('no-overflow');
            // If the navigation is expanded, then close it after exiting the modal
            if (!$('.navbar-toggle').hasClass('collapsed')) {
                $('.navbar-toggle').trigger('click');
            }
        });

        // If you clicked outside the modal to close it
        var modalID = $(event.currentTarget).attr('id');
        if (!modalID) {
            // If you clicked the X to close the modal
            modalID = $(event.currentTarget).parent().parent().parent().parent().attr('id');
        }
        // Auto-save when exiting the preferences modal
        if (modalID == 'preferences-modal') {
            scout.helpers.saveSettings();
        }
    }
    // Click "Delete Project"
    $('#delete-project').click(function (evt) {
        evt.preventDefault();
        var projectName = $('#projectName').text();
        $('.project-name').text(projectName);
        $('#confirm-delete').removeClass('gray');
        $('#delete-modal').fadeIn('slow');

        // Remove page scrollbar when modal displays
        $('body').addClass('no-overflow');
    });
    // Confirm delete in the modal
    $('#confirm-delete').click(function (evt) {
        evt.preventDefault();

        if (!$('#confirm-delete').hasClass('gray')) {
            $('#confirm-delete').addClass('gray');

            var id = $('#projectID').val();

            // Remove project from the object
            scout.helpers.removeProject(id);
            // remove all related alerts/messages from the DOM
            $('#printConsole .' + id + ' .glyphicon-remove').click();

            // Wipe out UI
            scout.helpers.resetProjectUI();
            $('#printConsole .alert, #printConsole .panel').addClass('hide');
            removeModal();

            if (scout.projects.length > 0) {
                $($('#projects-list > div')[0]).click();
            }
        }

    });
    // When clicking on background, cancel button, or X, remove modal
    $('.modal, #cancel-delete, .modal .glyphicon-remove').click(function () {
        // close the modal without saving
        removeModal();
    });
    // Allow you to click in the modal without triggering the `removeModal` function called when you click its parent element
    $('.modal .modal-content').click(function (evt) {
        evt.stopPropagation();
    });

    // Check for updates button in About
    $('#scoutUpdateChecker').click(function () {
        scout.helpers.checkForUpdates();
    });

    /**
     * OSX Keybindings.
     * On Windows and Ubuntu Scout-App inherits the OS's global clipboard shortcuts.
     * OSX needs you to spoon feed it how to copy and paste.
     */
    function osxKeyBindings () {
        var win = require('nw.gui').Window.get();
        // Keyboard shortcuts
        document.onkeydown = function (pressed) {
            // Check CMD+V and CMD+v keys and paste
            if (pressed.metaKey && pressed.keyCode === 86 ||
                pressed.metaKey && pressed.keyCode === 118) {
                pressed.preventDefault();
                document.execCommand('paste');
                return false;
            // Check CMD+C and CMD+c keys and copy
            } else if (
                pressed.metaKey && pressed.keyCode === 67 ||
                pressed.metaKey && pressed.keyCode === 99) {
                pressed.preventDefault();
                document.execCommand('copy');
                return false;
            // Check CMD+X and CMD+x and cut
            } else if (
                pressed.metaKey && pressed.keyCode === 88 ||
                pressed.metaKey && pressed.keyCode === 120) {
                pressed.preventDefault();
                document.execCommand('cut');
                return false;
            // Check CMD+Shift+I and open dev tools
            } else if (
                pressed.metaKey && pressed.shiftKey && pressed.keyCode === 73 ||
                pressed.metaKey && pressed.shiftKey && pressed.keyCode === 105) {
                win.showDevTools();
                return false;
            // Check CMD+Q and CMD+q and close the app
            } else if (
                pressed.metaKey && pressed.keyCode === 81 ||
                pressed.metaKey && pressed.keyCode === 113) {
                win.on('close', function () {
                    this.hide();
                    this.close(true);
                });
                win.close();
                return false;
            }
        };
    }

    // run once on page load
    if (process.platform == 'darwin') {
        osxKeyBindings();
    }

    // On page load have this run once
    unlockSubmit();

    scout.helpers.projectRenameHeight = projectRenameHeight;
    scout.helpers.unlockSubmit = unlockSubmit;

})(window.$, window.scout, window.ugui);
