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
        // Home App
        homeApp: homeApp,
        homeBuild: goApp + 'static/home/',
        homeCss: temp + 'home.css',
        homeIndex: homeApp + 'index.html',
        homeRouteFile: 'homeRoutes.js',
        homeTemplateFile: 'homeTemplates.js',
        homeTemplatePath: 'homeTemplates/',
        homeJs: homeApp + 'app/**/*.js',
        homeHtml: homeApp + 'templates/**/*.html',
        // Admin App
        adminApp: adminApp,
        adminBuild: goApp + 'static/admin',
        adminCss: temp + 'admin.css',
        adminIndex: adminApp + 'index.html',
        adminRouteFile: 'adminRoutes.js',
        adminTemplateFile: 'adminTemplates.js',        
        adminTemplatePath: 'adminTemplates/',
        adminJs: adminApp + 'app/**/*.js',
        adminHtml: adminApp + 'templates/**/*.html',
        
        htmltemplatesfile: 'templates.js',
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
            app: 'app.js',
            lib: 'lib.js'
        },
        adminOptimized: {
            app: 'app.js',
            lib: 'lib.js'
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
