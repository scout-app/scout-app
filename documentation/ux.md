
## User Experience Documentation

Scout-App wants to be the easiest to use application for processing Sass. As such, we routinely discuss the UX of it and how to improve our user interactions to make the app easier to use.

### **The cardinal rules of Scout-App's development:**

1. Always look out for the little guy.
 * Support as many platforms as possible.
 * Support as many languages as possible.
1. Always be free.
1. Always be open source.
1. If there is something we can do automatically for the user, we should.
 * However we should balance usage of system resources with task automation. (do not lock up the machine or UI for 30 seconds while scanning every folder)
1. We should aim for giving as much control as possible, so long as it does not impede simplicity.
 * The preferences menu should not have hundreds of options. Each and every new option or setting should be done with care and thought.
1. We will say "No" to feature requests that would make the application bloated, or harder to use.
1. We will not process LESS, Stylus, HAML, CoffeeScript, Pug, ES6-to-ES5, etc.
 * The focus of Scout-App is on doing one thing, very well.
1. If, when talking to users you hear the same feature requested repeatedly. Greater consideration for it should be given, or if it is already on the roadmap, it should be given higher priority. So long as it does not break the above rules.
 * If it does break the above rules, try to see if there is a clever solution that could give the end result the user desires without breaking one of the rules. If not, then don't be afraid to say "No" and offer alternative non-Scout-App solutions.
1. Good customer service.
 * Even if the users aren't paying for it, they should be treated like they are.
 * Answer all questions politely.
 * If someone is upset or angry about something, it's probably because it's hard to use, so thank them for bringing it to your attention and address ways to solve the problem.
 * Always update issues to inform users when Scout-App has a new release with their fix in it.
1. Never use Scout-the-Puppy to push a political agenda or an ideology. Scout is an adorable and innocent puppy, and has no concept of politics.
1. There shall be no brown M&M's in the backstage area.

* * *

## Visual Aesthetics of Scout-App 2

1. Workflow and ease of use must always be more important than visual aesthetics.
1. No mystery-meat navigation. Iconography must be used with care, but always have labels to aid in understanding.
1. Scout-App 2's layout and design decisions are restricted by it's support for multiple themes.
1. All UI changes must be tested in all themes that ship with Scout-App 2. If the design looks bad or broken in any theme, the design must be updated and improved.
1. Use of color in the design should be restricted to the Bootstrap colors of `success`, `primary`, `info`, `default`, `warning`, and `danger`. So that each theme can use the colors it wants. If none of these colors look good for your UI element, use neutral colors and transparency if needed.

* * *

## Archive of UX Discussions for all versions of Scout-App

Many people have contributed their thoughts and ideas on the UX of Scout-App and have helped shape it's design. Here is the archive of these moments.

* [#186](https://github.com/scout-app/scout-app/issues/186) **Scout-App 2** - Planning out how to move forward with Scout-App. *Oct 17, 2014 - Aug 30, 2016*
* [#273](https://github.com/scout-app/scout-app/issues/273) **Redesign FTUX** - Improving the First Time User Experience. *Oct 11, 2016 - Dec 5, 2016*
* [#285](https://github.com/scout-app/scout-app/issues/285) **User Experience Overhaul** - General discussion, design critique and potential planning for Scout-App 3. *Nov 16, 2016*
