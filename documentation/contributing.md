## Contributing

Scout-App 2 is **written in JavaScript, Sass, and HTML**. It is built using the cross-platform runtime environment **[NW.js](http://nwjs.io)** and the **[UGUI](http://ugui.io)** framework.


### What you can help with

* **Translate the app** - Go to the [Translate Scout-App](http://scout-app.io/index.html#cultures) page.
* **Report Bugs** - [Make a GitHub Issue](https://github.com/scout-app/scout-app/issues/new?title=SA2%20-%20&body=OS%3A%20%0DVersion%3A%20%0DInformation%20from%20Dev%20Tools%3A%20%0D%0D%28Attach%20screenshot%20below%29) for any bug you find. Include steps to repoduce the issue and a screenshot if possible.
* **Website** - Scout-App 2's website can always be improved (See: [Project Management](https://github.com/scout-app/scout-app.github.io/#project-management))
* **App Features** - There is a list of desired features to be added to Scout-App 2. (See Phase 5 of [Project Management](project-management.md#phase-5-bug-fixesadditional-featuresmaintenance))
* **Feature Requests** - If there is a feature you would like added, but it isn't on the [Project Management](project-management.md#phase-5-bug-fixesadditional-featuresmaintenance) page, then [request it on the issues page](https://github.com/scout-app/scout-app/issues/new?title=SA2%20Feature%20Request%20-%20) so we can discuss it **before** beginning work on it.
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


### Project structure:

The  main files for Scout-App 2 are:

* **package.json** - The first thing NW.js looks at when you run the app. This gives instructions on how to open and display a window for the user (the size of it, if it has a native UI framed border, etc). This also acts as the standard Node/NPM package file that can be used to define a node project or install dependencies.
* **index.html** - This is the main page of the app. It's set up like a standard html file, you'll just need to read through it and look at the comments for anything out of the ordinary. One thing specifically is the body tag has a class of "dev". Changing this to "prod" will remove the Dev Tools link under View in the nav bar and disable F5 refresh and F12 dev tools. Most of this is just markup for bootstrap. Some markup has been commented out, as it is for form elements I didn't see a use for at the time, but are already set up if we end up needing them (such as a drag/drop input box for files, or a range slider).
* **_scripts/** - The logic for Scout-App's UI is modularized into several JS file here, like `preferences.js`, `sidebar.js` or `project-manager.js`.
* **_scripts/ugui.js** - This library has a ton of useful tools, view [UGUI API](http://ugui.io/api) for more information.


* * *

### The Scout "[God Object](https://en.wikipedia.org/wiki/God_object)"

In the Developer Tools Console, you can type `window.scout` (or just `scout`) to see the main Scout object. It contains the following:

* `cultureCode`: This will be set to `en` by default but can be changed by the user in the UI under `File > Preferences`
* `dictionary`: This is used for temporary storage while switching languages in the UI. It will occassionally hold the same contents as one of the JSON files in the `cultures` folder.
* `ftux`: "[**F**irst **T**ime **U**ser E**x**perience](https://en.wikipedia.org/wiki/First-time_user_experience)". This is used as temporary storage for information generated on the FTUX screen. FTUX is shown whenever the user has 0 projects added to Scout-App.
* `helpers`: These are helper functions that can be called at any time from any file. Here is more information about specific helper functions:
 * `addProject`: Accepts a "project object" argument that contains an ID, Name, and local Directory. It adds it to the `scout.projects` list, updates the sidebar, and then saves settings.
 * `alert`: Accepts an error and project ID. Displays an error message in the UI and in the console.
 * `autoGenerateProject`: This accepts a project folder as an argument and then uses it to auto guess the settings for the project, adds it to the `scout.projects` list, and updates the sidebar and project view.
 * `deleteLocalSettingsFile`: This is currently not triggered by anything in the UI and can only be ran manually in the developer tools. It deletes the Scout-App user settings file for the currently logged in user. Good for testing when you have 5000 projects and need to get back down to 0.
 * `ftux`: This will show or hide the FTUX view based on if you have any projects. If you have no projects, it will scan common locations on your computer looking for a projects folder, then populate the UI if it finds one.
 * `killAllWatchers`: Forces all projects to stop watching for changes in the input folders of any project. Then updates the sidebar.
 * `localize`: When dynamically switching languages we use this function to localize the culture key into the correct translation.
 * `message`: Displays positive messages, like when a `.sass` file is successfully processed to `.css` without any errors.
 * `processInputFolder`: Recursively processes all `.sass` and `.scss` files in the project's input folder, skipping any that begin with an `_` (underscore).
 * `removeProject`: Accepts a project ID as an argument. Removes that project from the `scout.projects` list, updates the sidebar, and saves the settings. Then updates the project settings to show the first project in the sidebar.
 * `resetProjectUI`: This will reset the values in the right-side Project Panel, clearing out all values to prepare for showing a new project.
 * `saveCurrentProject`: This is ran when modifying the settings of a specific project. It updates the `scout.projects` object and saves settings to disk.
 * `saveSettings`: Saves portions of the `scout` object to the hard drive to be auto loaded when Scout-App is launched. Specifically it saves `scout.projects`, `scout.versions`, `scout.cultureCode` to the following location:
   * **Windows:** `%LOCALAPPDATA%/scout-app/scout-settings.json`
    * **Linux:** `~/.config/scout-app/scout-settings.json`
    * **OSX:** `~/Library/Application Support/scout-app/scout-settings.json`
 * `setLanguage`: Accepts an optional language code (`en`, `ru`, `fr`, etc). Defaults to `en`. Updates the `scout.cultureCode`, loads in the correct dictionary file to `scout.dictionary`, changes what image is shown in the preferences, saves the settings, and updates the UI to be displayed in the correct language.
 * `startWatching`: Accepts a project ID, adds a chokidar `watcher` function to that project's object and starts watching that project's input folder. Updates the project status indicator icon in the sidebar.
 * `stopWatching`: Accepts a project ID, kills the chokidar `watcher` function on that project, stopping it from watching that project's input folder any longer. Updates the project status indicator icon in the sidebar.
 * `unlockSubmit`: Accepts a project ID as an argument. Checks to see if all required fields in a project are filled in then updates the status icon to allow or prevent users from running the project.
 * `updateDataLangs`: Checks the DOM for elements with specific attributes like `data-lang` or `data-langalt`, then grabs their culture key, translates it and updates the DOM with the new translation.
 * `updateProjectSettingsView`: Updates all the values in the right-side Projects Panel to reflect the settings of the `project` object that was passed in. If no object is passed in, it defaults to `scout.newProject`.
 * `updateSidebar`: Clears out the sidebar and regenerates it based on the `scout.projects` list.
* `newProject`: The is temporary storage used for building a project object before it is passed into the `addProject` helper function.
* `projects`: A listing of all the projects added to Scout-App and their settings. The details of a project are below:
 * `environment`: Can be `production` or `development`, set in the UI.
 * `imageFolder`: Can be set by the auto guesser code, by the user in the UI. Default is empty string.
 * `indicator`: Controls what icon is shown in the sidebar. `play`, `gray-play`, and `stop`. These also affects whether you can run or stop a project.
 * `inputFolder`: The input Sass folder. Can be set by the auto guesser code or by the user. Default is empty string.
 * `outputFolder`: The output CSS folder for processed Sass. Can be set by the auto guesser code or by the user. Default is empty string.
 * `outputStyle`: Set by the user in the UI, can be `nested`, `expanded`, `compact`, or `compressed`. Defaults to `compressed`.
 * `projectFolder`: The folder for the project, used to create it's `projectName` and as the location to base all auto guessing. Chosen by the user.
 * `projectID`: This is a unique ID that would look something like: `sa1470092339976`. It allows the user to use the same name or projectFolder for multiple projects without the UI being buggy.
 * `projectIcon`: Can be auto guessed, set by the user in the UI, or left as the default `_img/logo_128.png`, which is Scout-App's own icon of Scout the Puppy.
 * `projectName`: The title of the project, by default it is based off of the last folder in `projectFolder`
 * `watcher`: This is the watcher function/object for this project. It informs Scout-App that `chokidar` is watching the `inputFolder` of this project for changes.
* `versions`: The version numbers for Scout-App and it's dependencies.
 * `chokidar`: Allows for watching for file changes.
 * `libSass`: The library version of SassC, used at the core of Scout-App to process `.sass` and `.scss` files into CSS.
 * `nodeSass`: The Node module that allows Scout-App to interface with `libSass`.
 * `scout`: Scout-Apps own version.


* * *


### If you get the LibSass error

Once you have Scout-App running click the Dev Tools link in the View menu. In the console you might see this error:

    `libsass` bindings not found

Follow these instructions to fix it.

This error means the version of Node.JS you have globally installed on your systme is has a different version of the V8 JavaScript engine than what is built in to NW.js. This is actually expected for NW.js development as the node-sass module we're using wasn't designed with it in mind. You'll need to go into the folder `/node_modules/node-sass/vendor` to see what binding folder you have. It will start with one of the following `darwin`, `freebsd`, `linux`, or `win` followed by either `ia32` or `x64`. You'll need to copy over all matching folders from the `/_assets` folder into the `/node_modules/node-sass/vendor` folder.

So if you're on `win32-x64-11`, you'll need to copy over `win32-x64-43`, and `win32-ia32-43` to the vendor folder.
