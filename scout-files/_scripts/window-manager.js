(function (scout) {
    var gui = require('nw.gui');
    var win = gui.Window.get();

    // MenuBar for macos
    if (process.platform === 'darwin') {
        var menu = new gui.Menu({type: 'menubar'});
        menu.createMacBuiltin && menu.createMacBuiltin('Scout-App');
        win.menu = menu;
    }

    // Allow close from traymenu
    var allowCloseWindow = false;
    var tray = null;

    win.on('close', function () {
        var doNotSendToTrayOnClose = !scout.globalSettings.sendToTrayOnClose;

        if (allowCloseWindow || doNotSendToTrayOnClose) {
            // Close
            this.close(true);
        }
        // Minimize
        minimizeWindow();
    });

    function minimizeWindow () {
        // Create tray menu
        tray = new gui.Tray({icon: 'scout-files/_img/logo_16.png'});
        var menu = new gui.Menu();

        var show = new gui.MenuItem({label:  scout.localize('SHOW')});
        var close = new gui.MenuItem({label: scout.localize('EXIT')});

        show.click = function () {
            showWindow();
        };

        close.click = function () {
            allowCloseWindow = true;
            win.close();
        };

        menu.append(show);
        menu.append(close);

        tray.menu = menu;

        // Hide app
        win.setShowInTaskbar(false);
        win.hide();

        tray.on('click', function () {
            showWindow();
        });

        // Show notification
        /*
        var notificationMinimizedWindow = new Notification('Scout-App', {
            // IS_NOW_MINIMIZED was never translated
            body: scout.localize('IS_NOW_MINIMIZED')
        });

        notificationMinimizedWindow.onclick = function (event) {
            event.preventDefault();
            showWindow();
        };
        */
    }

    // Show window again
    function showWindow () {
        tray.remove();
        tray = null;
        win.setShowInTaskbar(true);
        win.show();
    }

    // Minimize at startup
    if (scout.globalSettings.startMinimized) {
        minimizeWindow();
    }
})(window.scout);
