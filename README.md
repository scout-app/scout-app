#![Scout-App Logo](_img/scout-wordmark-tiny.png "Scout-App Logo") Scout-App 2.0

##Contributing

Scout-App 2.0 is built using the cross-platform runtime environment NW.js. You'll need to download the current stable version to work on the development version of Scout-App.

* [NWjs.io](http://nwjs.io)

Once you've cloned this scout-app repo, switch to the Scout-App-2-Dev branch. You'll need to navigate to the repo's folder and in the command line/terminal run `npm install`. If you don't have npm on your machine, you'll need to download [Node.JS](http://nodejs.org). Installing Node will also install NPM.

##Running Scout-App Locally for Development

Here is the NW.js documentation for how to run an app locally and below are the two easiest ways I've found for doing so for development:

* [NW.js Wiki - How to run apps](https://github.com/nwjs/nw.js/wiki/How-to-run-apps)

###Windows

Create a shortcut to where nw.exe is located on your computer. Right-click the shortcut and go to Properties. Change the target to:

    C:\path\to\nw.exe 'C:\path\to\Scout-App'

Click OK. From now on when you double-click that shortcut it will automatically launch the app appropriately.

###Mac/Linux

This is the probably the easiest way:

* [nwjr on GitHub](https://github.com/Antrikshy/nwjr)

* * *

Once you have Scout-App running in NW.js click the menu/options button next to the address bar to open Chromium Developer Tools. In the console you might see this error:

    `libsass` bindings not found

Follow these instructions to fix it.

Then that means the version of Node.JS you have has a different version of the V8 JavaScript engine than what is built in to NW.js. This is actually expected for NW.js development as the node-sass module we're using wasn't designed with it in mind. You'll need to go into the folder `/node_modules/node-sass/vendor` to see what binding folder you have. It will start with one of the following `darwin`, `freebsd`, `linux`, or `win` followed by either `ia32` or `x64`. You'll need to copy over all matching folders from the `/_assets` folder into the `/node_modules/node-sass/vendor` folder.

So if you're on `win32-x64-11`, you'll need to copy over `win32-x64-14`, `win32-x64-42`, `win32-x64-43`, and `win32-x64-44` so all 5 are in the vendor folder. Though we shouldn't have to do this for distribution, doing so may fix fringe cases where users can't run our app. So when it comes time to create production versions to distribute the app, it may not be a bad idea to include all relevent vendor bindings for each version of our app just to be on the safe side.

* * *

##Project structure:

This is based on another project I've been working on for the better part of a year called UGUI. You don't need to know anything about that project other than it's meant to be a good jumping off point for other NW.js apps (which is why we're using it).

The four main files Scout-App are:

* **package.json** - This is the first thing NW.js looks at when you have it run the app. This gives it instructions on how to open and display a window for the user, the size of it, if it has a native UI framed border, etc. This also acts as the standard Node/NPM package file that can be used to define a node project or install dependencies. The production version will have frame and toolbar set to false.
* **index.html** - This is the main page of the app. It's set up like a standard html file, you'll just need to read through it and look at the comments for anything out of the ordinary. One thing specifically is the body tag has a class of "dev". Changing this to "prod" will give you a better idea of what the app will look like in production. Most of this is just markup for bootstrap. Some markup has been commented out, as it is for form elements I didn't see a use for at the time, but are already set up if we end up needing them (such as a drag/drop input box for files, or a range slider).
* **_scripts/app.js** - This is the main JavaScript file for the app which will define all of the functionality for it.
* **_scripts/ugui.js** - This gives us basic functionality out of the box. I'll be removing some of the more specific aspects that deal with command line applications (UGUI's primary focus) and moving over some of the very general purpose functions into the scout.js file for use there. In the end this will mostly be a file for development tools.

* * *

To Do List:

* Clean up project folder.
* Handle a single project with input and output of files in specified folders.
* Have a watch function that will watch the specified files instead of just a one time run
* Create a save feature that produces a .json file for the saved project with all relavent information
* Upon creating a project, auto-guess the 4 input-files.
* Create an export button that will export out the saved project .json file for the user.
* Create a way of having multiple projects and switching between them
