## Translating Scout-App 2

### Detailed Google Sheets Instructions

1. Log into your Google Account and go to this URL:
  * https://docs.google.com/spreadsheets/d/16FtHGThz0-CBz_rf_9QO4zOV7oNmNk2BlwmtvKuzAhs/edit?usp=sharing
1. Create a new column for your language. (Hide columns from languages you don't care about.)
1. There is an `en` column for the English version, and a `CONTEXT` column that explains the usage of the text.
1. Translate all of the `en` phrases. Add another column for any notes related to your translations.
1. [Add an issue to GitHub](https://github.com/mhs/scout-app/issues/new?title=SA2%20-%20Translated%20Scout-App&body=New%20translation%20can%20be%20found%20at%0D%0D%2A%20https%3A%2F%2Fdocs%2Egoogle%2Ecom%2Fspreadsheets%2Fd%2F16FtHGThz0-CBz_rf_9QO4zOV7oNmNk2BlwmtvKuzAhs%2Fedit%3Fusp%3Dsharing), informing us of an update to the document.

* * *

### Quick GitHub Instructions

To translate Scout-App to a different language, you'll need to fork and clone down the repo, edit an Excel file, make a commit, and do a pull request.

* * *

### Detailed GitHub Instructions

#### Getting the project set up

1. Create a Github.com account
1. Download [Github for Desktop](https://desktop.github.com)
1. Install and log into the application
1. Fork this repo on Github (top right corner of the page)
1. Make sure the URL for the page you are cloning from has your username in it, then clone your forked repo by clicking the "clone repo" button at the top of the page. <img src="http://i.imgur.com/jIbhqGz.png">
1. This will launch GitHub for Desktop which will download a copy of your version of the Scout-App source files.

#### Editing the translations

1. Find the `scout-app\scout-files\cultures\cultures.xls` excel file on your computer. (Usually in `My Documents\GitHub`)
1. Open it in any application (Microsoft Excel, Libre Office, Open Office, Google Sheets, etc.)
1. Create a new column for your language. (Hide columns from languages you don't care about.)
1. There is an `en` column for the English version, and a `CONTEXT` column that explains the usage of the text.
1. Translate all of the `en` phrases. Add another column for any notes related to your translations.

#### Saving and uploading

1. When you are completed with your translations, save the excel document as "Excel 97-2003 Workbook (.xls)" format and with the same name and in the same location.
1. Open GitHub for Desktop (the program you downloaded in step 2)
1. Select the `scout-app` repo in the sidebar.
1. Click on "Changes" in the top center of the screen.
1. In the bottom of the screen write in a short message for your commit summar, like "Translated to Italian".
1. Click the "Commit" button with the checkmark at the bottom.
1. In the top right corner, you will see a button that says either "Publish" or "Sync", click on that.
1. In the top right corner, you will see the words "Pull Request". Click on that.
1. Title your pull request something like "Translated to Italian"
1. Make sure your pull request is against the correct branch "TheJaredWilcurt/Scout-App-2-Dev"
1. click "Send pull request".
