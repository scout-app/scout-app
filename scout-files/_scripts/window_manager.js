var gui = require('nw.gui');
var win = gui.Window.get();

/*
    MenuBar for macos
*/
var PLATFORM = process.platform;
if (PLATFORM == 'darwin') { 
    var menu = new gui.Menu({type: 'menubar'});
    menu.createMacBuiltin && menu.createMacBuiltin('Scout app');
    win.menu = menu;
}

var allowCloseWindow = false; // Allow close from traymenu
var tray = null;

win.on('close', function () {
    if (allowCloseWindow) {
        this.close(true); // Close
    }
    minimizeWindow(); // Minimize      	   
});

function minimizeWindow (){
    
    /*
        Create tray menu
    */
    tray = new gui.Tray({icon: 'scout-files/_img/logo_16.png'});
    var menu = new gui.Menu();
    
    var show = new gui.MenuItem({label:  window.scout.localize('SHOW')});
    show.click = function (){
        showWindow();
    };
    menu.append(show);

    var close = new gui.MenuItem({label: window.scout.localize('EXIT')});
    close.click = function (){
        allowCloseWindow = true;
        win.close();
    };
    menu.append(close);

    tray.menu = menu;

    /*
        Hide app
    */
    win.setShowInTaskbar(false);
    win.hide();
    /*
    Show notification
    */
    var notificationMinimizedWindow = new Notification('Scout-app', {
    body: window.scout.localize('IS_NOW_MINIMIZED')
    });

    notificationMinimizedWindow.onclick = function (event) {
        event.preventDefault();
        showWindow();
    };
}

/*
    Show window again
*/
function showWindow(){
    tray.remove();
    tray = null;
    win.setShowInTaskbar(true);
    win.show();
}

minimizeWindow(); // Minimize at startup

