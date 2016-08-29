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

* [x] **Status:** COMPLETED
* [x] **To do:**
  * [x] ~~[Discussions on UX and design](https://github.com/scout-app/scout-app/issues/186) (ZD/JM/TJW)~~
  * [x] ~~Create pre-built, but not optimized versions so people can test the app without needing to have Node installed or manually set up NW.js. (TJW)~~
  * [x] ~~Once the app is pretty much functional, have the crew try it out and give input.~~


#### **Phase 3:** Cross-platform testing (Ubuntu, Win, OSX), build tools

* [ ] **Status:** In progress
* [ ] **To do:**
  * [x] ~~Optimize the payload, so we don't include any junk files. (TJW)~~
  * [ ] Create custom build tools that package our app for distribution and remove files that are not needed in the production version
    * [x] ~~Windows (TJW)~~
    * [x] ~~Linux (TJW)~~
    * [ ] OSX
  * [x] ~~Test out the packaged versions on each targeted OS. Fix any issues that arise.~~
  * [ ] Research different installer options for each OS.
    * [x] ~~WinRAR SFX Installer. (TJW)~~
    * [ ] How to create a .deb file for Ubuntu.
    * [ ] MAS ([Mac App Store](https://github.com/nwjs/nw.js/wiki/Mac-App-Store-(MAS)-Submission-Guideline)).
    * [ ] [Inno Setup](http://www.jrsoftware.org/isinfo.php).
    * [ ] [NSIS](http://nsis.sourceforge.net/Main_Page)
    * [ ] [Windows Installer](https://msdn.microsoft.com/en-us/library/cc185688%28VS.85%29.aspx)


#### **Phase 4:** New Website

* [ ] **Status:** Done, but could be improved
* [ ] **To do:**
  * [ ] [Moved this section to the `scout-app.github.io` repo](https://github.com/scout-app/scout-app.github.io)


#### **Phase 5:** Bug fixes/Additional features/Maintenance

* [ ] **Status:** Lower priority features, some have been claimed
* [ ] **To do:**
  * [x] ~~Recursive Sass input folder rendering. We currently monitor all changes, but only process files in the root. ([#241](https://github.com/scout-app/scout-app/issues/241)) (TJW)~~
  * [ ] Allow users to rename project titles ([#179](https://github.com/scout-app/scout-app/issues/179))
  * [ ] Desktop notifications for alerts and errors ([#240](https://github.com/scout-app/scout-app/issues/240))
  * [ ] Redesign FTUX
  * [ ] Possibly implement an ITCSS specificity graph into the UI for sucessfully outputted CSS files
  * [ ] Drag and drop sidebar items to reorder (HMN)
  * [ ] Scan Desktop for projects folders
  * [ ] Abilitity to clear all alerts and messags at once
  * [ ] Right-click to delete an project from the sidebar
  * [ ] Make sidebar resizable
  * [ ] Tray icon/Minimize to tray
  * [ ] Tray icon indicators
  * [ ] Import/Export projects (Would anyone even want this feature?)
  * [ ] Multi-project delete
  * [ ] Multi-project import outside of FTUX view
  * [ ] Delete settings file button in preferences
  * [ ] Accept pull requests for app translations.
  * [ ] Add in badges to show number of alerts/messages for the Status of All Projects button
  * [ ] Investigate adding [Eyeglass](https://github.com/sass-eyeglass/eyeglass) into Scout-App, as it's the closest thing to Compass for Node-Sass.
