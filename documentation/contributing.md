## Contributing

Scout-App 2 is **written in JavaScript, Sass, and HTML**. It is built using the cross-platform runtime environment **[NW.js](http://nwjs.io)** and the **[UGUI](http://ugui.io)** framework.

### What you can help with

* **Translate the app** - Go to the [Translate Scout-App](translate-scout.md) page.
* **Report Bugs** - [Make a GitHub Issue](https://github.com/mhs/scout-app/issues/new?title=SA2%20-%20&body=OS%3A%20%0DInformation%20from%20Dev%20Tools%3A%20%0D%0D%28Attach%20screenshot%20below%29) for any bug you find. Include steps to repoduce the issue and a screenshot if possible.
* **Website** - Scout-App 2 needs a new site! (See Phase 4 of [Project Management](projectmanagement.md))
* **App Features** - There is a list of desired features to be added to Scout-App 2. (See Phase 5 of [Project Management](projectmanagement.md))
* **Bug fixes** - If you find a bug and now how to fix it, or want to fix a reported bug, fork the repo and make a pull request.

* * *

### Running Scout-App Locally for Development

1. Clone down this `scout-app` repo
2. Switch to the `Scout-App-2-Dev` branch
3. Install [Node.JS](http://nodejs.org) if you don't have it
4. Run `npm install`
5. Run `npm start`
6. Read below if you get libsass bindings errors.

* * *

### If you get the LibSass error

Once you have Scout-App running click the Dev Tools link in the View menu. In the console you might see this error:

    `libsass` bindings not found

Follow these instructions to fix it.

Then that means the version of Node.JS you have has a different version of the V8 JavaScript engine than what is built in to NW.js. This is actually expected for NW.js development as the node-sass module we're using wasn't designed with it in mind. You'll need to go into the folder `/node_modules/node-sass/vendor` to see what binding folder you have. It will start with one of the following `darwin`, `freebsd`, `linux`, or `win` followed by either `ia32` or `x64`. You'll need to copy over all matching folders from the `/_assets` folder into the `/node_modules/node-sass/vendor` folder.

So if you're on `win32-x64-11`, you'll need to copy over `win32-x64-14`, `win32-x64-42`, `win32-x64-43`, and `win32-x64-44` so all 5 are in the vendor folder. Though we shouldn't have to do this for distribution, doing so may fix fringe cases where users can't run our app. So when it comes time to create production versions to distribute the app, it may not be a bad idea to include all relevent vendor bindings for each version of our app just to be on the safe side.

* * *

### Project structure:

The  main files for Scout-App 2 are:

* **package.json** - The first thing NW.js looks at when you run the app. This gives instructions on how to open and display a window for the user (the size of it, if it has a native UI framed border, etc). This also acts as the standard Node/NPM package file that can be used to define a node project or install dependencies.
* **index.html** - This is the main page of the app. It's set up like a standard html file, you'll just need to read through it and look at the comments for anything out of the ordinary. One thing specifically is the body tag has a class of "dev". Changing this to "prod" will remove the Dev Tools link under View in the nav bar and disable F5 refresh and F12 dev tools. Most of this is just markup for bootstrap. Some markup has been commented out, as it is for form elements I didn't see a use for at the time, but are already set up if we end up needing them (such as a drag/drop input box for files, or a range slider).
* **_scripts/** - The logic for Scout-App's UI is modularized into several JS file here, like `preferences.js`, `sidebar.js` or `project-manager.js`.
* **_scripts/ugui.js** - This library has a ton of useful tools, view [UGUI API](http://ugui.io/api) for more information.
