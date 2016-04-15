#Saffron
[![Build Status](https://travis-ci.org/colindresj/saffron.svg?branch=v0.2.2)](https://travis-ci.org/colindresj/saffron)
[![Gem Version](https://badge.fury.io/rb/saffron.svg)](http://badge.fury.io/rb/saffron)

> A simple Sass mixin library for animations and transitions.

Saffron is a collection of Sass mixins and helpers that make adding CSS3 animations and transitions much simpler.
Just include a mixin in your Sass declaration, then set any configuration using variables and mixin parameters.

###Requirements
Sass 3.2+

##Installing
###Standard Installation
Install the gem from the command line with `gem install saffron`, then `cd` into the directory where you want to install Saffron and run the installation command:
```bash
saffron install
```
You can also use the `-p` flag to install Saffron into a relative directory:
```bash
saffron install -p path/to/directory/
```
Finally, import the mixins into your main SCSS file:
```scss
  @import "saffron/saffron";
```

###Rails
If you're using Rails 3.1+, you can add Saffron to your Gemfile:
```ruby
  gem "saffron"
```
Run `bundle install` to make all the mixins available to your Rails application, and import Saffron at the top of your `application.css.scss`:
```scss
@import "saffron";
```

###Bower
Saffron is available on [Bower](http://bower.io/). Run `bower install saffron` to get the latest tagged version of Saffron
from Bower. Unless you've changed the default directory, Saffron will be installed into your `bower_componenents` directory within the `saffron` subdirectory.

###Manual Installation
Download or clone the project repo from GitHub. Copy the `saffron` folder and paste into your `sass` folder (or whatever you call it). You won't need any of the other directories or files.
```scss
  @import "saffron/saffron";
```
No matter how you installed Saffron, you can now use any of the mixins:
```scss
  .my-class {
    @include teeter();
  }
```

##Updating
To get the latest mixins you should update the Saffron files every once in a while. You can do so by running:
```bash
saffron update
```
If you initially installed Saffron in a specific directory using the `-p` flag, you'll need to do the the same when updating:
```bash
saffron update -p path/to/directory/
```

##Browser Support
Saffron uses CSS3 transform, keyframes, animations and transitions, so it's really only for modern browsers. Visit http://caniuse.com/ for a clear idea of CSS3 browser support.

All the mixins compile down to vendor prefixed CSS, and have been tested on the latest versions of Chrome, Safari, Firefox and Opera. I aim to do more browser testing and hope to increase compatability, especially for IE.

##Stylus
If you're more of a Stylus user, check out [@willhoag](https://github.com/willhoag)'s port: [Saffron-Stylus](https://github.com/willhoag/saffron-stylus).

##License
MIT
