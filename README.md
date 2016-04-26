#![Scout-App Logo](scout-files/_img/scout-wordmark-tiny.png "Scout-App Logo") Scout-App 2.0

Scout-App allows you to process your `.sass` and `.scss` files into CSS without needing any knowledge of the command line.

**[BETA VERSION AVAILABLE!](https://github.com/TheJaredWilcurt/scout-app/releases).**

Here's a recent screenshot of the new version:

<p align="center"><img src="https://cloud.githubusercontent.com/assets/4629794/13718098/a4c4f1bc-e7b4-11e5-9fd2-81e7b8c17d2c.png" alt="Scout-App 2 Screenshot"></p>

**Officially Supported OS's**:

OS             | 32-Bit             | 64-Bit
:--            | :--:               | :--:
Windows XP SP3 | :white_check_mark: | :x:
Windows Vista  | :white_check_mark: | :white_check_mark:
Windows 7      | :white_check_mark: | :white_check_mark:
Windows 8/8.1  | :white_check_mark: | :white_check_mark:
Windows 10     | :white_check_mark: | :white_check_mark:
Ubuntu 12.04   | :white_check_mark: | :white_check_mark:
Ubuntu 14.04   | :white_check_mark: | :white_check_mark:
OSX 10.7       | :x:                | :white_check_mark:
OSX 10.8       | :x:                | :white_check_mark:
OSX 10.9       | :x:                | :white_check_mark:
OSX 10.10      | :x:                | :white_check_mark:
OSX 10.11+     | :x:                | :white_check_mark:

* * *

## Scout-App Comparison

Scout Comparison           | 0.7.1           | 2.0.0
:--                        | :--             | :--
**Sass Version**           | 2012 (Ruby)     | 2016 (SassC)
**Technology**             | Air, Java, Ruby | NW.js, Node
**Cross-Platform**         | OSX, Windows    | Windows, Linux, OSX
**Syntax Support**         | scss and sass   | scss and sass
**Compass Support**        | Full Support    | Only Mixins
**Speed**                  | Potato          | Kitten with a Jetpack
**Project Setup**          | Manual          | Automatic & Manual
**Themes**                 | 1               | 19 + Create your own
**Alerts & Errors**        | Console logs    | Human Readable in UI
**Run from Tray**          | No              | Planned
**Custom Mixin Libraries** | No              | Yes

* * *

## Supported/built-in mixin libraries:

Simply add the @import into your code to have access to that library.

*Sorted by URL*

Code                                     | Source
:--                                      | :--
`@import "buttons";`                     | [github.com/alexwolfe/Buttons                ](https://github.com/alexwolfe/Buttons)
`@import "bi-app-ltr";`                  | [github.com/anasnakawa/bi-app-sass           ](https://github.com/anasnakawa/bi-app-sass)
`@import "bi-app-rtl";`                  | [github.com/anasnakawa/bi-app-sass           ](https://github.com/anasnakawa/bi-app-sass)
`@import "pineapple-sass";`              | [github.com/ArunMichaelDsouza/pineapple-sass ](https://github.com/ArunMichaelDsouza/pineapple-sass)
`@import "saffron";`                     | [github.com/corporadobob/saffron             ](https://github.com/corporadobob/saffron)
`@import "scut";`                        | [github.com/davidtheclark/scut               ](https://github.com/davidtheclark/scut)
`@import "su";`                          | [github.com/ericam/susy                      ](https://github.com/ericam/susy)
`@import "susy";`                        | [github.com/ericam/susy                      ](https://github.com/ericam/susy)
`@import "susyone";`                     | [github.com/ericam/susy                      ](https://github.com/ericam/susy)
`@import "andy";`                        | [github.com/gillesbertaux/andy               ](https://github.com/gillesbertaux/andy)
`@import "typesettings";`                | [github.com/ianrose/typesettings             ](https://github.com/ianrose/typesettings)
`@import "compass";`                     | [github.com/Igosuki/compass-mixins           ](https://github.com/Igosuki/compass-mixins)
`@import "lemonade";`                    | [github.com/Igosuki/compass-mixins           ](https://github.com/Igosuki/compass-mixins)
`@import "sassy-buttons";`               | [github.com/jhardy/Sassy-Buttons             ](https://github.com/jhardy/Sassy-Buttons)
`@import "bluejay";`                     | [github.com/kalebheitzman/bluebird           ](https://github.com/kalebheitzman/bluebird)
`@import "sass-easing";`                 | [github.com/kingscooty/sass-easing           ](https://github.com/kingscooty/sass-easing)
`@import "breakpoint";`                  | [github.com/lesjames/breakpoint              ](https://github.com/lesjames/breakpoint)
`@import "sass-css3-mixins";`            | [github.com/matthieua/sass-css3-mixins       ](https://github.com/matthieua/sass-css3-mixins)
`@import "cssowl";`                      | [github.com/owl-stars/cssowl                 ](https://github.com/owl-stars/cssowl)
`@import "spice";`                       | [github.com/spice-sass/spice                 ](https://github.com/spice-sass/spice)
`@import "meyer";`                       | [github.com/TheJaredWilcurt/meyer-sass       ](https://github.com/TheJaredWilcurt/meyer-sass)
`@import "bourbon-deprecated-upcoming";` | [github.com/thoughtbot/bourbon               ](https://github.com/thoughtbot/bourbon)
`@import "bourbon";`                     | [github.com/thoughtbot/bourbon               ](https://github.com/thoughtbot/bourbon)
`@import "neat";`                        | [github.com/thoughtbot/neat                  ](https://github.com/thoughtbot/neat)

If we've missed a popular mixin library, request it on the [issues](https://github.com/mhs/scout-app/issues) page.

* * *

## Contributing

Scout-App 2.0 is built using the cross-platform runtime environment [NW.js](http://nwjs.io) and the [UGUI](http://ugui.io) framework.


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

### What you can help with

* **Translate the app** - This is the least techinal part. Simple edit the excel sheet in the cultures folder and add a new language. You can even pick an image to be shown in the selection screen.
* **Report Bugs** - [Make a GitHub Issue](http://github.com/mhs/scout-app/) for any bug you find. Include steps to repoduce the issue and a screenshot if possible.
* **Website** - Scout-App 2 needs a new site! (See Phase 4 below)
* **App Features** - There is a list of desired features and tasks below.
* **Bug fixes** - If you find a bug and now how to fix it, or want to fix a reported bug

* * *

## Project management:
#### **Phase 1**: Beautiful, functional, and ease of use (TJW)

* [x] **Status:** COMPLETE
* [x] **To do:**
  * [x] ~~Clean up project folder. (TJW)~~
  * [x] ~~Handle a single project with input and output of files in specified folders. (TJW)~~
  * [x] ~~Fix Output Style options (nested, expanded, compact, compressed) (TJW)~~
  * [x] ~~Allow for common mixin libraries to be shipped with it (TJW)~~
  * [x] ~~Implement Environment options (production/development) (TJW)~~
  * [x] ~~Have a watch function that will watch input folder instead of just a doing one time run (TJW)~~
  * [x] ~~Finalize UX layout (Group)~~
  * [x] ~~Pretty up the app! (Group)~~
  * [x] ~~Pretty up the error output message and allow for it to be closed (TJW)~~
  * [x] ~~Fix icon (Will not release without this, no excuse for [shoddy craftsmanship](http://giant.gfycat.com/VigorousPointedAnteater.gif)) (TJW)~~
  * [x] ~~BUG 1: In Ubuntu & OSX, `@import 'buttons'` fails, as Scout-App isn't loading the mixin libraries for some reason. (TJW)~~
  * [x] ~~BUG 3: In Ubuntu, the auto-guesser crashes on [this specific repo](https://github.com/UniversalGUI/UniversalGUI.github.io). (TJW)~~
  * [x] ~~Upon creating a project, auto-guess input/output folders and project icon. (TJW)~~
  * [x] ~~Create a way of having multiple projects, switching between them, and removing specific projects from Scout-App (TJW)~~
  * [x] ~~Work on FTUX/Empty State view. (TJW)~~
  * [x] ~~Create ID system that will show alerts per project, and all together in the Status view. (TJW)~~
  * [x] ~~BUG 4: Projects object outputStyle not being set properly. Issues deleting projects. (TJW)~~
  * [x] ~~Localize the app. Create a template system, extract all text to a `en.json` file and allow for translations. (TJW)~~
  * [x] ~~Auto-guesser applied to all projects in GitHub folder~~
  * [x] ~~Make project icon show a `+` when hovering over it and allow changing it via click to browse. (TJW)~~
  * [x] ~~Clean up custom styles to allow for theme swapping. (SR)~~
  * [x] ~~BUG 5: Delete modal updates to be for the next project that gets auto-selected allowing you to double-delete on accident (TJW)~~
  * [x] ~~Add preference modal for language and theme settings. (TJW)~~
  * [x] ~~BUG 2: In OSX, CMD+V doesn't paste. Implement shortcuts for cut/copy/paste (TJW)~~
  * [x] ~~BUG 6: on ftux() only register browse button click once (TJW)~~
  * [x] ~~BUG 7: On OSX, browse for project folder doesn't click. (TJW)~~
  * [x] ~~BUG 8: Run a project then add new project, the running icon will show as play instead of stop. (TJW)~~
  * [x] ~~BUG 9: Select project settings A, run project B. It displays status updates of B on Settings view of A. (TJW)~~

#### **Phase 2:** Community Input and bugs (ZD/JM)

* [ ] **Status:**: [Open enrollment for Beta Testers](https://github.com/mhs/scout-app/issues/230)
* [ ] **To do:**
  * [x] ~~[Discussions on UX and design](https://github.com/mhs/scout-app/issues/186) (ZD/JM/TJW)~~
  * [x] ~~Create pre-built, but not optimized versions so people can test the app without needing to have Node installed or manually set up NW.js. (TJW)~~
  * [ ] Once the app is pretty much functional, have the crew try it out and give input.

#### **Phase 3:** Cross-platform testing (Ubuntu, Win, OSX), build tools

* [ ] **Status:** Waiting for Phase 1 and 2 to be completed
* [ ] **To do:**
  * [ ] Optimize the payload, so we don't include any junk files.
  * [ ] Create custom build tools that package our app for distribution and remove files that are not needed in the production version
  * [ ] Test out the packaged versions on each targeted OS. Fix any issues that arise.

#### **Phase 4:** NEW WEBSITE **(Need help with this)** !!!!!!!!!!!!!!!

* [ ] **Status:** Could be started at any point (hint hint).
* [ ] **To do:**
  * [ ] Design single page (static) site for the app (will be hosted on GitHub).
  * [ ] Capture some sexy screenshots
  * [ ] Make downloads dynamic based on [GitHub API](https://developer.github.com/v3/repos/releases)
  * [ ] Show a comparison table of the old scout and the new Scout
  * [ ] Have dynamic download button based on [the OS](https://github.com/FLIF-hub/UGUI_FLIF/blob/gh-pages/crossbrowser.js) and [32/64-Bit arch](https://github.com/peterhurford/64or32) of the user.
  * [ ] Display a "minimum system requirements", maybe tailor it to each OS, as free space requirement will vary
  * [ ] "Getting Started with Scout 2" Video
  * [ ] Listing of Mixins that are supported out of the box

#### **Phase 5:** Bug fixes/Additional features/Maintenance
* [ ] **Status:** Lower priority features, some have been claimed
* [ ] **To do:**
  * [ ] Drag and drop sidebar items to reorder (HMN)
  * [ ] Abilitity to clear all alerts and messags at once
  * [ ] Right-click to delete an project from the sidebar
  * [ ] Make sidebar resizable
  * [ ] Minimize to tray, icon indicators, alert popups when in tray mode
  * [ ] Import/Export projects (Would anyone even want this feature?)
  * [ ] Multi-project delete
  * [ ] Delete settings file button in preferences
  * [ ] Accept pull requests for app translations.
  * [ ] Add in badges to show number of alerts/messages for the Status of All Projects button

* * *

## Project structure:

The  main files for Scout-App 2 are:

* **package.json** - The first thing NW.js looks at when you run the app. This gives instructions on how to open and display a window for the user (the size of it, if it has a native UI framed border, etc). This also acts as the standard Node/NPM package file that can be used to define a node project or install dependencies.
* **index.html** - This is the main page of the app. It's set up like a standard html file, you'll just need to read through it and look at the comments for anything out of the ordinary. One thing specifically is the body tag has a class of "dev". Changing this to "prod" will remove the Dev Tools link under View in the nav bar and disable F5 refresh and F12 dev tools. Most of this is just markup for bootstrap. Some markup has been commented out, as it is for form elements I didn't see a use for at the time, but are already set up if we end up needing them (such as a drag/drop input box for files, or a range slider).
* **_scripts/** - The logic for Scout-App's UI is modularized into several JS file here, like `preferences.js`, `sidebar.js` or `project-manager.js`.
* **_scripts/ugui.js** - This library has a ton of useful tools, view [UGUI API](http://ugui.io/api) for more information.

* * *

## Contributors to Scout-App 2

* [TheJaredWilcurt](http://github.com/TheJaredWilcurt) - Creator, Maintainer, Project Manager
* [Stephan Raab](http://github.com/StephanRaab) - Themes feature - Bug Finder - French translation
* [zdennis](http://github.com/zdennis) - UX Design and Planning
* [mejiaj](http://github.com/mejiaj) - UX Design and Planning
* [Mutually Human](http://github.com/mhs) - For creating the original Scout-App!
