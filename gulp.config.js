module.exports = function() {
    var goApp = './app/';
    var client = './src/';
    var homeApp = './src/home/';
    var adminApp = './src/admin/';
    var root = './';
    var temp = './.tmp/';

    var config = {
        // File Path
        alljs: [
            client + '**/*.js'
        ],
        build: goApp + '/static/',
        fonts: [
            './bower_components/font-awesome/fonts/**/*.*',
            './bower_components/material-design-iconic-font/dist/fonts/**/*.*'
        ],
        homeApp: homeApp,
        homeBuild: goApp + 'static/home/',
        homeCss: temp + 'home.css',
        homeIndex: homeApp + 'index.html',
        homeTemplate: homeApp + 'templates/',
        homeJs: homeApp + 'app/**/*.js',
        htmltemplates: [
            './bower_components/foundation-apps/js/angular/components/**/*.html'
        ],
        images: client + 'img/**/*.*',
        appScss: client + 'scss/**/*.scss',
        scss: [
            './bower_components/foundation-apps/scss',
            './bower_components/normalize-scss/sass',
            './bower_components/motion-ui/src'
        ],
        temp: temp,

        // Settings
        browserversion: [
            'last 2 version',
            '> 5%'
        ],
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        // Optimized Files
        homeOptimized: {
            app: 'homeApp.js',
            lib: 'homeLib.js'
        },
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'foundation',
                standAlone: false,
                root: 'components/'
            }
        },
        appTemplateCache: {
            file: 'appTemplates.js',
            options: {
                module: 'foundation',
                standAlone: false
            }
        }
    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};
