#![Scout-App Logo](_img/scout-wordmark-tiny.png "Scout-App Logo") Scout-App 2.0

##Contributing

Scout-App 2.0 is built using the cross-platform runtime environment NW.js.


##Running Scout-App Locally for Development

1. Clone down this `scout-app` repo
2. Switch to the `Scout-App-2-Dev branch`
3. Install [Node.JS](http://nodejs.org) if you don't have it
4. Run `npm install`
5. Run `npm start`
6. Read below if you get libsass bindings errors.

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
* **_scripts/ugui.js** - This library has a ton of useful tools, view [UGUI API](http://ugui.io/api) for more information.

* * *

##Project management:

* [ ] **Phase 1**: Ugly, but functional (TJW)
  * [ ] **Status:** In progress, only semi-functional
  * [ ] **To do:**
    * [x] ~~Clean up project folder.~~
    * [x] ~~Handle a single project with input and output of files in specified folders.~~
    * [x] ~~Fix Output Style options (nested, expanded, compact, compressed)~~
    * [x] ~~Allow for common mixin libraries to be shipped with it~~
    * [x] ~~Implement Environment options (production/development)~~
    * [ ] Create a way of having multiple projects and switching between them
    * [ ] Upon creating a project, auto-guess the 4 input-files.
    * [ ] Save/Load settings automatically
    * [ ] Create an export button that will export out the saved project .json file for the user.
    * [x] ~~Have a watch function that will watch the specified files instead of just a one time run~~
* [ ] **Phase 2:** Beautiful with ease of use (ZD/JM, some TJW)
  * [ ] **Status:** Some [discussions on UX and design](https://github.com/mhs/scout-app/issues/186) have begun.
  * [ ] **To do:**
    * [ ] Finalize UX layout
    * [ ] Pretty up the app!
    * [ ] Pretty up the error output message and allow for it to be closed
* [ ] **Phase 3:** Cross-platform testing (Ubuntu, Win, OSX) & General QA
  * [ ] **Status:** Waiting for Phase 1 and 2 to be completed
* [ ] **Phase 4:** New website
  * [ ] **Status:** Waiting for Phase 1 and 2 to be completed
* [ ] **Phase 5:** Bug fixes/Additional features/Maintenance
  * [ ] **Status:** Waiting for Phase 1, 2, and 3 to be completed.

* * *

### Supported built-in mixin libraries:

*Sorted by URL*

Code                                     | Source
:--                                      | :--
`@import "buttons";`                     | [github.com/alexwolfe/Buttons](https://github.com/alexwolfe/Buttons)
`@import "saffron";`                     | [github.com/corporadobob/saffron](https://github.com/corporadobob/saffron)
`@import "sassmatic";`                   | [github.com/DarbyBrown/sassmatic](https://github.com/DarbyBrown/sassmatic)
`@import "scut";`                        | [github.com/davidtheclark/scut](https://github.com/davidtheclark/scut)
`@import "su";`                          | [github.com/ericam/susy](https://github.com/ericam/susy)
`@import "susy";`                        | [github.com/ericam/susy](https://github.com/ericam/susy)
`@import "susyone";`                     | [github.com/ericam/susy](https://github.com/ericam/susy)
`@import "andy";`                        | [github.com/gillesbertaux/andy](https://github.com/gillesbertaux/andy)
`@import "typesettings";`                | [github.com/ianrose/typesettings](https://github.com/ianrose/typesettings)
`@import "animate";`                     | [github.com/Igosuki/compass-mixins](https://github.com/Igosuki/compass-mixins)
`@import "compass";`                     | [github.com/Igosuki/compass-mixins](https://github.com/Igosuki/compass-mixins)
`@import "lemonade";`                    | [github.com/Igosuki/compass-mixins](https://github.com/Igosuki/compass-mixins)
`@import "sassline";`                    | [github.com/jakegiltsoff/sassline](https://github.com/jakegiltsoff/sassline)
`@import "sassy-buttons";`               | [github.com/jhardy/Sassy-Buttons](https://github.com/jhardy/Sassy-Buttons)
`@import "bluebird";`                    | [github.com/kalebheitzman/bluebird](https://github.com/kalebheitzman/bluebird)
`@import "sass-easing";`                 | [github.com/kingscooty/sass-easing](https://github.com/kingscooty/sass-easing)
`@import "breakpoint";`                  | [github.com/lesjames/breakpoint](https://github.com/lesjames/breakpoint)
`@import "css3-mixins";`                 | [github.com/matthieua/sass-css3-mixins](https://github.com/matthieua/sass-css3-mixins)
`@import "cssowl";`                      | [github.com/owl-stars/cssowl](https://github.com/owl-stars/cssowl)
`@import "spice";`                       | [github.com/spice-sass/spice](https://github.com/spice-sass/spice)
`@import "bourbon-deprecated-upcoming";` | [github.com/thoughtbot/bourbon](https://github.com/thoughtbot/bourbon)
`@import "bourbon";`                     | [github.com/thoughtbot/bourbon](https://github.com/thoughtbot/bourbon)
`@import "neat";`                        | [github.com/thoughtbot/neat](https://github.com/thoughtbot/neat)

If we've missed a popular mixin library, request it on the [issues](https://github.com/mhs/scout-app/issues) page.
