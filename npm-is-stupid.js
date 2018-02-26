// NPM is fucking stupid and can't download a repo unless it has a package.json file

// I'm using this script instead of `napa` because it shouldn't take 4MB of
// node_modules to do the job of 40 lines of code.

var packages = [
    {
        username: 'gillesbertaux',
        repo: 'andy',
        mainfile: 'node_modules/andy/andy.scss',
        junk: [
            'node_modules/andy/.git',
            'node_modules/andy/doc',
            'node_modules/andy/bower.json',
            'node_modules/andy/README.md',
            'node_modules/andy/.gitignore'
        ]
    },
    {
        username: 'matthieua',
        repo: 'sass-css3-mixins',
        mainfile: 'node_modules/sass-css3-mixins/css3-mixins.sass',
        junk: [
            'node_modules/sass-css3-mixins/.git',
            'node_modules/sass-css3-mixins/bower.json',
            'node_modules/sass-css3-mixins/css3-mixins.scss'
        ]
    },
    {
        username: 'behigh',
        repo: 'bootstrap_dropdowns_enhancement',
        mainfile: 'node_modules/bootstrap_dropdowns_enhancement/dist/js/dropdowns-enhancement.js',
        junk: [
            'node_modules/bootstrap_dropdowns_enhancement/.git',
            'node_modules/bootstrap_dropdowns_enhancement/bootstrap',
            'node_modules/bootstrap_dropdowns_enhancement/docs',
            'node_modules/bootstrap_dropdowns_enhancement/less',
            'node_modules/bootstrap_dropdowns_enhancement/.gitignore',
            'node_modules/bootstrap_dropdowns_enhancement/.gitmodules',
            'node_modules/bootstrap_dropdowns_enhancement/Gruntfile.js',
            'node_modules/bootstrap_dropdowns_enhancement/package.json',
            'node_modules/bootstrap_dropdowns_enhancement/README.md'
        ]
    },
    {
        username: 'lesjames',
        repo: 'breakpoint',
        mainfile: 'node_modules/breakpoint/breakpoint/_breakpoint.scss',
        junk: [
            'node_modules/breakpoint/.git',
            'node_modules/breakpoint/test',
            'node_modules/breakpoint/.bowerrc',
            'node_modules/breakpoint/.gitignore',
            'node_modules/breakpoint/bower.json',
            'node_modules/breakpoint/CHANGELOG.md',
            'node_modules/breakpoint/Gruntfile.js',
            'node_modules/breakpoint/jquery.breakpoint.js',
            'node_modules/breakpoint/package.json',
            'node_modules/breakpoint/README.md'
        ]
    },
    {
        username: 'alexwolfe',
        repo: 'Buttons',
        mainfile: 'node_modules/buttons/scss/buttons.scss',
        junk: [
            'node_modules/buttons/.git',
            'node_modules/buttons/css',
            'node_modules/buttons/js',
            'node_modules/buttons/showcase',
            'node_modules/buttons/tests',
            'node_modules/buttons/.gitignore',
            'node_modules/buttons/.travis.yml',
            'node_modules/buttons/bower.json',
            'node_modules/buttons/config.rb',
            'node_modules/buttons/Gruntfile.js',
            'node_modules/buttons/humans.txt',
            'node_modules/buttons/package.json',
            'node_modules/buttons/README.md'
        ]
    },
    {
        junk: [
            'node_modules/compass-mixins/test',
            'node_modules/compass-mixins/.npmignore',
            'node_modules/compass-mixins/.travis.yml',
            'node_modules/compass-mixins/bower.json',
            'node_modules/compass-mixins/package.json',
            'node_modules/compass-mixins/README.markdown',
            'node_modules/compass-mixins/README.md'
        ]
    },
    {
        junk: [
            'node_modules/cssowl/docs',
            'node_modules/cssowl/lib/less',
            'node_modules/cssowl/lib/scss',
            'node_modules/cssowl/lib/styl',
            'node_modules/cssowl/resources',
            'node_modules/cssowl/.travis.yml',
            'node_modules/cssowl/bower.json',
            'node_modules/cssowl/composer.json',
            'node_modules/cssowl/Gruntfile.coffee',
            'node_modules/cssowl/package.json',
            'node_modules/cssowl/README.md'
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
            'node_modules/family.scss/.gitattributes',
            'node_modules/family.scss/.travis.yml',
            'node_modules/family.scss/bower.json',
            'node_modules/family.scss/config.rb',
            'node_modules/family.scss/Gemfile',
            'node_modules/family.scss/Gemfile.lock',
            'node_modules/family.scss/package.json',
            'node_modules/family.scss/README.md'
        ]
    },
    {
        mainfile: 'node_modules/meyer-sass/_meyer.sass',
        junk: [
            'node_modules/meyer-sass/.npmignore',
            'node_modules/meyer-sass/_meyer.less',
            'node_modules/meyer-sass/_meyer.min.css',
            'node_modules/meyer-sass/_meyer.styl',
            'node_modules/meyer-sass/_meyer-scss.scss',
            'node_modules/meyer-sass/bower.json',
            'node_modules/meyer-sass/package.json',
            'node_modules/meyer-sass/README.md'
        ]
    },
    {
        mainfile: 'node_modules/pineapple-sass/build/_pineapple-sass.scss',
        junk: [
            'node_modules/pineapple-sass/demo',
            'node_modules/pineapple-sass/.npmignore',
            'node_modules/pineapple-sass/bower.json',
            'node_modules/pineapple-sass/Gruntfile.js',
            'node_modules/pineapple-sass/package.json',
            'node_modules/pineapple-sass/pineapple-sass.png',
            'node_modules/pineapple-sass/README.md',
            'node_modules/pineapple-sass/sache.json'
        ]
    },
    {
        mainfile: 'node_modules/normalize.css/normalize.css',
        junk: [
            'node_modules/normalize.css/CHANGELOG.md',
            'node_modules/normalize.css/package.json',
            'node_modules/normalize.css/README.md'
        ]
    },
    {
        username: 'colindresj',
        repo: 'saffron',
        mainfile: 'node_modules/saffron/saffron/saffron.scss',
        junk: [
             'node_modules/saffron/.git',
             'node_modules/saffron/app',
             'node_modules/saffron/bin',
             'node_modules/saffron/features',
             'node_modules/saffron/lib',
             'node_modules/saffron/tasks',
             'node_modules/saffron/.gitignore',
             'node_modules/saffron/.travis.yml',
             'node_modules/saffron/bower.json',
             'node_modules/saffron/Gemfile',
             'node_modules/saffron/Gemfile.lock',
             'node_modules/saffron/Rakefile',
             'node_modules/saffron/sache.json',
             'node_modules/saffron/saffron.gemspec',
             'node_modules/saffron/README.md'
        ]
    },
    {
        mainfile: 'node_modules/scut/dist/_scut.scss',
        junk: [
            'node_modules/scut/lib',
            'node_modules/scut/src',
            'node_modules/scut/CHANGELOG.md',
            'node_modules/scut/package.json',
            'node_modules/scut/README.md',
            'node_modules/scut/scut-1.4.0.gem'
        ]
    },
    {
        mainfile: 'node_modules/sierra-library/src/sierra.scss',
        junk: [
            'node_modules/sierra-library/dev',
            'node_modules/sierra-library/dist',
            'node_modules/sierra-library/.editorconfig',
            'node_modules/sierra-library/.npmignore',
            'node_modules/sierra-library/.scss-lint.yml',
            'node_modules/sierra-library/bower.json',
            'node_modules/sierra-library/gulpfile.js',
            'node_modules/sierra-library/package.json',
            'node_modules/sierra-library/README.md'
        ]
    },
    {
        mainfile: 'node_modules/spice-sass/src/_spice.scss',
        junk: [
            'node_modules/spice-sass/.npmignore',
            'node_modules/spice-sass/.travis.yml',
            'node_modules/spice-sass/index.js',
            'node_modules/spice-sass/package.json',
            'node_modules/spice-sass/README.md'
        ]
    },
    {
        mainfile: 'node_modules/susy/sass/_susy.scss',
        junk: [
            'node_modules/susy/docs',
            'node_modules/susy/CHANGELOG.md',
            'node_modules/susy/CONTRIBUTING.md',
            'node_modules/susy/favicon.ico',
            'node_modules/susy/package.json',
            'node_modules/susy/PHILOSOPHY.md',
            'node_modules/susy/README.md',
            'node_modules/susy/sache.json',
            'node_modules/susy/UPGRADE.md',
            'node_modules/susy/yarn.lock'
        ]
    },
    {
        mainfile: 'node_modules/Synergy/src/scss/_synergy.scss',
        junk: [
            'node_modules/Synergy/src/js',
            'node_modules/Synergy/src/index.js',
            'node_modules/Synergy/build',
            'node_modules/Synergy/dist',
            'node_modules/Synergy/unit-testing',
            'node_modules/Synergy/.babelrc',
            'node_modules/Synergy/.eslintrc.js',
            'node_modules/Synergy/.npmignore',
            'node_modules/Synergy/.travis.yml',
            'node_modules/Synergy/bower.json',
            'node_modules/Synergy/package.json',
            'node_modules/Synergy/README.md',
            'node_modules/Synergy/stylelint.config.js',
            'node_modules/Synergy/todo.md',
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
            'node_modules/typesettings/.csslintrc',
            'node_modules/typesettings/.npmignore',
            'node_modules/typesettings/_typesettings.styl',
            'node_modules/typesettings/bower.json',
            'node_modules/typesettings/package.json',
            'node_modules/typesettings/README.md',
            'node_modules/typesettings/sache.json'
        ]
    }
];

function runCMD (package) {
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
        console.log(output);
    }
}

function removeJunk (items) {
    var fs = require('fs-extra');
    items.forEach(function (item) {
        fs.removeSync(item);
    });
}

packages.forEach(function (package) {
    runCMD(package);
    removeJunk(package.junk);
});
