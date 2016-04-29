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
  * [ ] Research different installer options for each OS.
    * [x] ~~WinRAR SFX Installer.~~
    * [ ] How to create a .deb file for Ubuntu.
    * [ ] MAS ([Mac App Store](https://github.com/nwjs/nw.js/wiki/Mac-App-Store-(MAS)-Submission-Guideline)).
    * [ ] [Inno Setup](http://www.jrsoftware.org/isinfo.php).
    * [ ] [NSIS](http://nsis.sourceforge.net/Main_Page)
    * [ ] [Windows Installer](https://msdn.microsoft.com/en-us/library/cc185688(VS.85%29.aspx)

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
  * [ ] Recursive Sass input folder rendering. We currently monitor all changes, but only process files in the root.
  * [ ] Investigate adding [Eyeglass](https://github.com/sass-eyeglass/eyeglass) into Scout-App, as it's the closest time to Compass for Node-Sass.
