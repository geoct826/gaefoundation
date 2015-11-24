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
        homeJs: homeApp + 'app/**/*.js',
        images: client + 'img/**/*.*',
        appScss: client + 'scss/**/*.scss',
        scss: [
            './bower_components/foundation-sites/scss',
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
