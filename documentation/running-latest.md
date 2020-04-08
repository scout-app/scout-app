### Running Scout-App's latest (unreleased) code locally

1. Install Node.JS (any version between 6 and 11, Node 12+ does not work currently)
   * https://nodejs.org/dist/latest-v11.x
1. Download a copy of the source code
   * https://github.com/scout-app/scout-app/archive/master.zip
1. Unzip the source code (you can delete the zip file after this)
1. Open a command prompt or terminal, use the command `cd` to change directories to the scout-app folder. You can use `ls` or `dir` to see a list of folders that you can `cd` into. Example:

   ![cmd example](https://user-images.githubusercontent.com/4629794/78788502-e8aee080-7979-11ea-8b0b-6d3d3ec46e61.png)

1. In the `scout-app` folder, run `npm install --loglevel=error`
   * If you get `ReferenceError: primordials is not defined`, you are on a newer Node version, switch to Node 11.
   * If you get a message about `Skipping failed optional dependency` or `Not compatible with your operating system or architecture:` it is normal and expected. Scout-App is cross-platform, so some dependencies are OS specific. These warnings are just there to say that something relating to a different OS wasn't installed.
1. Run `npm start` and the app should open
