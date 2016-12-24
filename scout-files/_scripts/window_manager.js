var gui = require('nw.gui');
var os = require('os');
var win = gui.Window.get();

if(os.platform() === 'windows'){
	$("body").addClass("windows");
}else{
	$("body").addClass("macos");
}

function minimizeW(){
	tray = new gui.Tray({icon: './scout-files/_img/logo_16.png' });

	// Give it a menu
	var menu = new gui.Menu();
	show = new gui.MenuItem({label:  window.scout.localize('SHOW')});
	show.click = function(){
		showW();
	};
	menu.append(show);

	close = new gui.MenuItem({label: window.scout.localize('CLOSE')});
	close.click = function(){
		win.close();
	};
	menu.append(close);
	tray.menu = menu;
	
	win.setShowInTaskbar(false);
	win.hide();
}

function showW(){
	tray.remove();
	tray = null;

	win.setShowInTaskbar(true);
	win.show();
}

minimizeW();

var nR=new Notification("Scout-app", {
    body: "is now running!"
});

nR.onclick = function(event) {
  event.preventDefault();
  showW();
}
        
$("body").on("click",".navbar-nav a[href='#hide']", function(){
	minimizeW();
})

$("body").on("click",".window-controls a.minimize-button", function(e){
	e.preventDefault();
	win.minimize();
})

$("body").on("click",".window-controls a.maximize-button", function(e){
	e.preventDefault();
	if(win.isFullscreen){
			win.toggleFullscreen();
			console.log('ok');
	}else{
			if (screen.availHeight <= win.height) {
			  win.unmaximize();
			}else{
			  win.maximize();
			}
	}
})

$("body").on("click",".window-controls a.close-button", function(e){
	e.preventDefault();
	minimizeW();
})