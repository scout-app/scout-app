// NPM can't download a repo unless it has a package.json file.
// Also some repo's only have one file I care about, but will install a bunch
// of needless dependencies if downloaded via NPM instead of just a git clone.
//
// This file manages manually cloning files with git into the node_modules folder
// and also removing any junk files that are not needed from the node_modules
// folder, so that we can reduce the distribution size of the app.

var packages = [
    {
        username: 'gillesbertaux',
        repo: 'andy',
        mainfile: 'node_modules/andy/andy.scss',
        junk: []
    },
    {
        mainfile: 'node_modules/bluejay/src/bluejay.scss',
        junk: [
            'node_modules/bluejay/css-compiled',
            'node_modules/bluejay/package.json'
        ]
    },
    {
        mainfile: 'node_modules/bootstrap/dist/js/bootstrap.min.js',
        junk: [
            'node_modules/bootstrap/dist/css',
            'node_modules/bootstrap/dist/fonts',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/bootstrap/js',
            'node_modules/bootstrap/test-infra',
            'node_modules/bootstrap/package.json'
        ]
    },
    {
        username: 'behigh',
        repo: 'bootstrap_dropdowns_enhancement',
        mainfile: 'node_modules/bootstrap_dropdowns_enhancement/dist/js/dropdowns-enhancement.js',
        junk: [
            'node_modules/bootstrap_dropdowns_enhancement/bootstrap',
            'node_modules/bootstrap_dropdowns_enhancement/package.json'
        ]
    },
    {
        mainfile: 'node_modules/bootstrap-slider/dist/bootstrap-slider.min.js',
        secondary: 'node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css',
        junk: [
            'node_modules/bootstrap-slider/dependencies',
            'node_modules/bootstrap-slider/dist/bootstrap-slider.js',
            'node_modules/bootstrap-slider/dist/css/bootstrap-slider.css',
            'node_modules/bootstrap-slider/scripts',
            'node_modules/bootstrap-slider/src',
            'node_modules/bootstrap-slider/tpl',
            'node_modules/bootstrap-slider/package.json'
        ]
    },
    {
        username: 'lesjames',
        repo: 'breakpoint',
        mainfile: 'node_modules/breakpoint/breakpoint/_breakpoint.scss',
        junk: [
            'node_modules/breakpoint/jquery.breakpoint.js',
            'node_modules/breakpoint/package.json'
        ]
    },
    {
        username: 'alexwolfe',
        repo: 'Buttons',
        mainfile: 'node_modules/buttons/scss/buttons.scss',
        junk: [
            'node_modules/buttons/css',
            'node_modules/buttons/js',
            'node_modules/buttons/showcase',
            'node_modules/buttons/package.json'
        ]
    },
    {
        junk: [
            'node_modules/compass-mixins/package.json'
        ]
    },
    {
        junk: [
            'node_modules/components-jqueryui/themes',
            'node_modules/components-jqueryui/ui',
            'node_modules/components-jqueryui/jquery-ui.js',
            'node_modules/components-jqueryui/package.json'
        ]
    },
    {
        junk: [
            'node_modules/cssowl/lib/less',
            'node_modules/cssowl/lib/scss',
            'node_modules/cssowl/lib/styl',
            'node_modules/cssowl/resources',
            'node_modules/cssowl/package.json'
        ]
    },
    {
        mainfile: 'node_modules/family.scss/source/src/_family.scss',
        junk: [
            'node_modules/family.scss/build',
            'node_modules/family.scss/source/fonts',
            'node_modules/family.scss/source/images',
            'node_modules/family.scss/source/javascripts',
            'node_modules/family.scss/source/layouts',
            'node_modules/family.scss/source/stylesheets',
            'node_modules/family.scss/source/index.html.haml',
            'node_modules/family.scss/package.json'
        ]
    },
    {
        junk: [
            'node_modules/jquery/dist/core.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jquery/dist/jquery.min.map',
            'node_modules/jquery/dist/jquery.slim.js',
            'node_modules/jquery/dist/jquery.slim.min.js',
            'node_modules/jquery/dist/jquery.slim.min.map',
            'node_modules/jquery/external',
            'node_modules/jquery/src',
            'node_modules/jquery/package.json'
        ]
    },
    {
        mainfile: 'node_modules/meyer-sass/_meyer.sass',
        junk: [
            'node_modules/meyer-sass/_meyer.less',
            'node_modules/meyer-sass/_meyer.min.css',
            'node_modules/meyer-sass/_meyer.styl',
            'node_modules/meyer-sass/_meyer-scss.scss',
            'node_modules/meyer-sass/package.json'
        ]
    },
    {
        junk: [
            'node_modules/node-sass/src'
        ]
    },
    {
        mainfile: 'node_modules/normalize.css/normalize.css',
        junk: [
            'node_modules/normalize.css/package.json'
        ]
    },
    {
        mainfile: 'node_modules/pineapple-sass/build/_pineapple-sass.scss',
        junk: [
            'node_modules/pineapple-sass/package.json',
            'node_modules/pineapple-sass/pineapple-sass.png'
        ]
    },
    {
        username: 'colindresj',
        repo: 'saffron',
        mainfile: 'node_modules/saffron/saffron/saffron.scss',
        junk: [
            'node_modules/saffron/app',
            'node_modules/saffron/bin',
            'node_modules/saffron/features',
            'node_modules/saffron/lib',
            'node_modules/saffron/tasks',
            'node_modules/saffron/saffron.gemspec'
        ]
    },
    {
        username: 'esr360',
        repo: 'Sass-Boost',
        mainfile: 'node_modules/Sass-Boost/src/_sass-boost.scss',
        junk: [
            'node_modules/Sass-Boost/dist'
        ]
    },
    {
        username: 'matthieua',
        repo: 'sass-css3-mixins',
        mainfile: 'node_modules/sass-css3-mixins/css3-mixins.sass',
        junk: [
            'node_modules/sass-css3-mixins/css3-mixins.scss'
        ]
    },
    {
        mainfile: 'node_modules/scut/dist/_scut.scss',
        junk: [
            'node_modules/scut/lib',
            'node_modules/scut/src',
            'node_modules/scut/package.json',
            'node_modules/scut/scut-1.4.0.gem'
        ]
    },
    {
        mainfile: 'node_modules/sierra-library/src/sierra.scss',
        junk: [
            'node_modules/sierra-library/dev',
            'node_modules/sierra-library/dist',
            'node_modules/sierra-library/package.json'
        ]
    },
    {
        mainfile: 'node_modules/spice-sass/src/_spice.scss',
        junk: [
            'node_modules/spice-sass/index.js',
            'node_modules/spice-sass/package.json'
        ]
    },
    {
        mainfile: 'node_modules/susy/sass/_susy.scss',
        junk: [
            'node_modules/susy/package.json',
            'node_modules/susy/UPGRADE.md'
        ]
    },
    {
        username: 'esr360',
        repo: 'Synergy',
        mainfile: 'node_modules/Synergy/src/scss/_synergy.scss',
        junk: [
            'node_modules/Synergy/src/js',
            'node_modules/Synergy/src/index.js',
            'node_modules/Synergy/build',
            'node_modules/Synergy/dist',
            'node_modules/Synergy/package.json',
            'node_modules/Synergy/webpack.config.babel.js'
        ]
    },
    {
        mainfile: 'node_modules/typesettings/_typesettings.scss',
        junk: [
            'node_modules/typesettings/typesettings/_functions.styl',
            'node_modules/typesettings/typesettings/_global-init.styl',
            'node_modules/typesettings/typesettings/_internal.styl',
            'node_modules/typesettings/typesettings/_mixins.styl',
            'node_modules/typesettings/typesettings/_settings.styl',
            'node_modules/typesettings/typesettings/_typesetted.styl',
            'node_modules/typesettings/_typesettings.styl',
            'node_modules/typesettings/package.json'
        ]
    }
];

var commonJunk = [
    '.babelrc',
    '.bowerrc',
    '.csslintrc',
    '.editorconfig',
    '.eslintrc.js',
    '.git',
    '.gitattributes',
    '.github',
    '.gitignore',
    '.gitmodules',
    '.npmignore',
    '.nvmrc',
    '.scss-lint.yml',
    '.travis.yml',
    '_config.yml',
    'AUTHORS',
    'AUTHORS.txt',
    'bower.json',
    'bower',
    'CHANGELOG.md',
    'CNAME',
    'component.json',
    'composer.json',
    'config.rb',
    'CONTRIBUTING.md',
    'demo',
    'doc',
    'docs',
    'example',
    'favicon.ico',
    'fonts',
    'Gemfile',
    'Gemfile.lock',
    'grunt',
    'Gruntfile.coffee',
    'Gruntfile.js',
    'gulpfile.js',
    'humans.txt',
    'less',
    'package-lock.json',
    'PHILOSOPHY.md',
    'Rakefile',
    'README.markdown',
    'README.md',
    'sache.json',
    'stylelint.config.js',
    'test',
    'tests',
    'todo.md',
    'unit-testing',
    'yarn.lock'
];

function gitClone (package) {
    var fs = require('fs-extra');
    if (!package.username || !package.repo || fs.existsSync(package.mainfile)) {
        return;
    }

    var exec = require('child_process').execSync;

    var executable = 'git clone --quiet';
    var url = 'https://github.com/' + package.username + '/' + package.repo + '.git';
    var branch = '-b ' + (package.branch || 'master');
    var destination = 'node_modules/' + package.repo.toLowerCase();

    var args = [executable, url, branch, destination];
    args = args.join(' ').trim();

    var runner = exec(args);

    var output = runner.toString().trim();
    if (output) {
        // eslint-disable-next-line no-console
        console.log(output);
    }
}

function removeCommonJunk () {
    var fs = require('fs-extra');
    var allModules = fs.readdirSync('node_modules');
    allModules.forEach(function (folder) {
        var isFolder = fs.statSync('node_modules/' + folder).isDirectory();
        if (isFolder) {
            commonJunk.forEach(function (junk) {
                fs.removeSync('node_modules/' + folder + '/' + junk);
            });
        }
    });
}

function removeSpecificJunk (items) {
    var fs = require('fs-extra');
    items.forEach(function (item) {
        fs.removeSync(item);
    });
}

packages.forEach(function (package) {
    gitClone(package);
    removeSpecificJunk(package.junk);
});

removeCommonJunk();
