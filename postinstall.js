// NPM can't download a repo unless it has a package.json file.
// Also some repo's only have one file I care about, but will install a bunch
// of needless dependencies if downloaded via NPM instead of just a git clone.
//
// This file manages manually cloning files with git into the node_modules folder
// and also removing any junk files that are not needed from the node_modules
// folder, so that the distribution size of the app is reduced.

var fs = require('fs-extra');
var path = require('path');
var execSync = require('child_process').execSync;

var postInstall = {
    packages: [
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
            username: 'Igosuki',
            repo: 'compass-mixins',
            mainfile: 'node_modules/compass-mixins/lib/_compass.scss',
            junk: [
                'node_modules/compass-mixins/package.json',
                'node_modules/compass-mixins/LICENSE_backup.md'
            ]
        },
        {
            username: 'components',
            repo: 'jqueryui',
            mainfile: 'node_modules/jqueryui/jquery-ui.min.js',
            junk: [
                'node_modules/jqueryui/themes',
                'node_modules/jqueryui/ui',
                'node_modules/jqueryui/jquery-ui.js',
                'node_modules/jqueryui/package.json'
            ]
        },
        {
            username: 'owl-stars',
            repo: 'cssowl',
            mainfile: 'node_modules/cssowl/lib/sass/cssowl.sass',
            junk: [
                'node_modules/cssowl/lib/less',
                'node_modules/cssowl/lib/scss',
                'node_modules/cssowl/lib/styl',
                'node_modules/cssowl/resources',
                'node_modules/cssowl/package.json'
            ]
        },
        {
            username: 'LukyVj',
            repo: 'family.scss',
            mainfile: 'node_modules/family.scss/source/src/_family.scss',
            junk: [
                'node_modules/family.scss/build',
                'node_modules/family.scss/source/fonts',
                'node_modules/family.scss/source/images',
                'node_modules/family.scss/source/javascripts',
                'node_modules/family.scss/source/layouts',
                'node_modules/family.scss/source/stylesheets',
                'node_modules/family.scss/source/index.html.haml',
                'node_modules/family.scss/package.json',
                'node_modules/family.scss/eyeglass-exports.js'
            ]
        },
        {
            mainfile: 'node_modules/jquery/dist/jquery.min.js',
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
            username: 'necolas',
            repo: 'normalize.css',
            mainfile: 'node_modules/normalize.css/normalize.css',
            junk: [
                'node_modules/normalize.css/package.json'
            ]
        },
        {
            username: 'ArunMichaelDsouza',
            repo: 'pineapple-sass',
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
            username: 'davidtheclark',
            repo: 'scut',
            mainfile: 'node_modules/scut/dist/_scut.scss',
            junk: [
                'node_modules/scut/lib',
                'node_modules/scut/src',
                'node_modules/scut/package.json',
                'node_modules/scut/scut-1.4.0.gem'
            ]
        },
        {
            username: 'sierra-library',
            repo: 'sierra',
            mainfile: 'node_modules/sierra/src/sierra.scss',
            junk: [
                'node_modules/sierra/dev',
                'node_modules/sierra/dist',
                'node_modules/sierra/package.json'
            ]
        },
        {
            username: 'spice-sass',
            repo: 'spice',
            mainfile: 'node_modules/spice/src/_spice.scss',
            junk: [
                'node_modules/spice/index.js',
                'node_modules/spice/package.json'
            ]
        },
        {
            username: 'oddbird',
            repo: 'susy',
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
            username: 'ianrose',
            repo: 'typesettings',
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
        },
        {
            username: 'markedjs',
            repo: 'marked',
            mainfile: 'node_modules/marked/marked.min.js',
            junk: [
                'node_modules/marked/bin',
                'node_modules/marked/lib',
                'node_modules/marked/man',
                'node_modules/marked/index.js',
                'node_modules/marked/USING_ADVANCED.md',
                'node_modules/marked/USING_PRO.md',
                'node_modules/marked/package.json'
            ]
        },
        {
            username: 'inorganik',
            repo: 'countUp.js',
            mainfile: 'node_modules/countup.js/dist/countUp.min.js',
            junk: [
                'node_modules/countup.js/countUp.js',
                'node_modules/countup.js/countUp-jquery.js',
                'node_modules/countup.js/index.html'
            ]
        },
        {
            username: 'kingscooty',
            repo: 'sass-easing',
            mainfile: 'node_modules/sass-easing/_sass-easing.scss',
            junk: []
        },
        {
            username: 'anasnakawa',
            repo: 'bi-app-sass',
            mainfile: 'node_modules/bi-app-sass/bi-app/_bi-app-ltr.scss',
            junk: []
        },
        {
            username: 'thoughtbot',
            repo: 'bourbon',
            mainfile: 'node_modules/bourbon/core/_bourbon.scss',
            junk: [
                'node_modules/bourbon/eyeglass-export.js',
                'node_modules/bourbon/index.js',
                'node_modules/bourbon/package.json'
            ]
        },
        {
            username: 'thoughtbot',
            repo: 'neat',
            mainfile: 'node_modules/neat/core/_neat.scss',
            junk: [
                'node_modules/neat/bin',
                'node_modules/neat/contrib',
                'node_modules/neat/lib',
                'node_modules/neat/spec',
                'node_modules/neat/.hound.yml',
                'node_modules/neat/.ruby-version',
                'node_modules/neat/circle.yml',
                'node_modules/neat/eyeglass-exports.js',
                'node_modules/neat/index.js',
                'node_modules/neat/neat.gemspec',
                'node_modules/neat/package.json',
                'node_modules/neat/RELEASING.md'
            ]
        },
        {
            username: 'pierreburel',
            repo: 'sass-rem',
            mainfile: 'node_modules/sass-rem/_rem.scss',
            junk: [
                'node_modules/sass-rem/package.json'
            ]
        },
        {
            username: 'noderat',
            repo: 'sassier-buttons',
            mainfile: 'node_modules/sassier-buttons/scss/sassy-buttons.scss',
            junk: [
                'node_modules/sassier-buttons/package.json'
            ]
        }
    ],
    commonJunk: [
        '.babelrc',
        '.bowerrc',
        '.csslintrc',
        '.editorconfig',
        '.eslintrc.js',
        '.eslintrc.json',
        '.git',
        '.gitattributes',
        '.github',
        '.gitignore',
        '.gitmodules',
        '.idea',
        '.npmignore',
        '.nvmrc',
        '.scss-lint.yml',
        '.travis.yml',
        '_config.yml',
        'AUTHORS',
        'AUTHORS.md',
        'AUTHORS.txt',
        'bower.json',
        'bower',
        'CHANGELOG.md',
        'CNAME',
        'CODE_OF_CONDUCT.md',
        'component.json',
        'composer.json',
        'config.rb',
        'CONTRIBUTING.md',
        'demo',
        'demo.js',
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
        'jasmine.json',
        'less',
        'Makefile',
        'package-lock.json',
        'PHILOSOPHY.md',
        'PUBLISHING.md',
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
    ],
    gitClone: function (package) {
        if (!package.username || !package.repo || fs.existsSync(package.mainfile)) {
            return;
        }

        var executable = 'git clone --quiet';
        var url = 'https://github.com/' + package.username + '/' + package.repo + '.git';
        var branch = '-b ' + (package.branch || 'master');
        var destination = 'node_modules/' + package.repo.toLowerCase();

        var args = [executable, url, branch, destination];
        args = args.join(' ').trim();

        var runner = execSync(args);

        var output = runner.toString().trim();
        if (output) {
            // eslint-disable-next-line no-console
            console.log(output);
        }
    },
    deleteIt: function (file) {
        try {
            fs.removeSync(file);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log('Failed to delete: ' + file);
        }
    },
    removeCommonJunkFromNodeModules: function () {
        var allModules = fs.readdirSync('node_modules');
        allModules.forEach(function (folder) {
            var isFolder = fs.statSync('node_modules/' + folder).isDirectory();
            if (isFolder) {
                this.commonJunk.forEach(function (junk) {
                    this.deleteIt('node_modules/' + folder + '/' + junk);
                }.bind(this));
            }
        }.bind(this));
    },
    removePackageSpecificJunk: function (junkPile) {
        for (var i = 0; i < junkPile.length; i++) {
            var pieceOfJunk = junkPile[i];
            fs.remove(pieceOfJunk, function (err) {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.log('Failed to delete: ' + pieceOfJunk);
                }
            });
        }
    },
    downloadAllPackagesThenRemoveTheirSpecificJunk: function () {
        this.packages.forEach(function (package) {
            this.gitClone(package);
            this.removePackageSpecificJunk(package.junk);
        }.bind(this));
    },
    fixSynergy: function () {
        var file = path.join('.', 'node_modules', 'synergy', 'src', 'scss', '_synergy.scss');

        var data = '';
        try {
            data = fs.readFileSync(file);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log('Error reading synergy');
            // eslint-disable-next-line no-console
            console.log(err);
        }
        data = String(data);
        data = data.replace('../../node_modules/Sass-Boost/src/', '');

        try {
            fs.writeFileSync(file, data);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log('Error updating Synergy');
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }
};

postInstall.downloadAllPackagesThenRemoveTheirSpecificJunk();
postInstall.removeCommonJunkFromNodeModules();
postInstall.fixSynergy();

