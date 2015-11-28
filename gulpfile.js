var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')({lazy:true});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function () {
    log('Analyzing javascript with JSHint and JSCS in ' + config.alljs);
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .on('end', function() { log('JSCS Check Completed');})
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.if(!args.ignore, $.jshint.reporter('fail')))
        .on('end', function() { log('JSHint Check Completed');});
});

gulp.task('gae-serve', ['optimize:home', 'optimize:admin'], function() {
    return gulp
        .src('./app', {read: false})
        .pipe($.shell([
            'goapp serve <%= file.path%>'
    ], {
        templateData: {}
    }));
});

// Build Tasks
gulp.task('build-routes:home', function () {
    log('Creating Home Routes from templates');
    var router = require('front-router');

    return gulp
        .src(config.homeHtml)
        .pipe(router({
            path: config.temp + config.homeRouteFile,
            root: '/'
        }))
        .pipe(gulp.dest(config.temp + config.homeTemplatePath));
});

gulp.task('build-routes:admin', function () {
    log('Creating Admin Routes from templates');
    var router = require('front-router');

    return gulp
        .src(config.adminHtml)
        .pipe(router({
            path: config.temp + config.adminRouteFile,
            root: '/'
        }))
        .pipe(gulp.dest(config.temp + config.adminTemplatePath));
});

gulp.templateCacheRan = false;

gulp.task('templatecache', function() {

    if(!gulp.templateCacheRan){
        gulp.templateCacheRan = true;
        log('Creating $templateCache for foundation components');
        return gulp
            .src(config.htmltemplates)
            .pipe($.minifyHtml({empty: true}))
            .pipe($.angularTemplatecache(
                config.templateCache.file,
                config.templateCache.options        
                ))
            .pipe(gulp.dest(config.temp));
    }
});

gulp.task('apptemplatecache:home', ['build-routes:home'], function() {
    log('Creating $templateCache for home templates');

    return gulp
        .src(config.temp + config.homeTemplatePath + '**/*.html')
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.homeTemplateFile,{ 
                module: 'foundation',
                standAlone: false,
                root: 'src/home/templates/'
            }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('apptemplatecache:admin', ['build-routes:admin'], function() {
    log('Creating $templateCache for home templates');

    return gulp
        .src(config.temp + config.adminTemplatePath + '**/*.html')
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.adminTemplateFile,{ 
                module: 'foundation',
                standAlone: false,
                root: 'src/admin/templates/'
            }))
        .pipe(gulp.dest(config.temp));
});              

gulp.task('inject:home', ['styles', 'templatecache', 'apptemplatecache:home'], function() {
    log('Wire up the bower css/js and app css/js into home index.html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.homeIndex)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.homeJs)))
        .pipe($.inject(gulp.src(config.homeCss)))    
        .pipe(gulp.dest(config.homeApp));
});

gulp.task('inject:admin', ['styles', 'templatecache', 'apptemplatecache:admin'], function() {
    log('Wire up the bower css/js and app js into admin index.html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.adminIndex)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.adminJs)))
        .pipe($.inject(gulp.src(config.adminCss)))    
        .pipe(gulp.dest(config.adminApp));
});

gulp.task('optimize:home', ['inject:home', 'watch:home'], function() {
    log('Optimizing files for home application');

    var assets = $.useref.assets({searchPath: './'});
    var cssFilter = $.filter('**/*.css', {restore:true});
    var jsAppFilter = $.filter('**/' + config.homeOptimized.app, {restore:true});
    var jsLibFilter = $.filter('**/' + config.homeOptimized.lib, {restore:true});

    return gulp
        .src(config.homeIndex)
        .pipe($.plumber())
        .pipe($.inject(gulp.src([
            config.temp + config.templateCache.file,
            config.temp + config.homeTemplateFile], {read: false}), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe($.inject(gulp.src(config.temp + config.homeRouteFile, {read: false}), {
            starttag: '<!-- inject:routes:js -->'
        }))    
        .pipe(assets)
        // Filter and Minify CSS
        .pipe(cssFilter)
        .pipe($.minifyCss())
        .pipe(cssFilter.restore)
		// Filter and Minify Lib JS
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore)
        // Filter, ngAnnotate and Minify App JS
        .pipe(jsAppFilter)
        //.pipe($.ngAnnotate({add:true}))
        .pipe($.uglify())
        .pipe(jsAppFilter.restore)
        // Restore all assets
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(config.homeBuild));
});

gulp.task('optimize:admin', ['inject:admin', 'watch:admin'], function() {
    log('Optimizing files for admin application');

    var assets = $.useref.assets({searchPath: './'});
    var cssFilter = $.filter('**/*.css', {restore:true});
    var jsAppFilter = $.filter('**/' + config.adminOptimized.app, {restore:true});
    var jsLibFilter = $.filter('**/' + config.adminOptimized.lib, {restore:true});

    return gulp
        .src(config.homeIndex)
        .pipe($.plumber())
        .pipe($.inject(gulp.src([
            config.temp + config.templateCache.file,
            config.temp + config.adminTemplateFile], {read: false}), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe($.inject(gulp.src(config.temp + config.adminRouteFile, {read: false}), {
            starttag: '<!-- inject:routes:js -->'
        }))    
        .pipe(assets)
        // Filter and Minify CSS
        .pipe(cssFilter)
        .pipe($.minifyCss())
        .pipe(cssFilter.restore)
		// Filter and Minify Lib JS
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore)
        // Filter, ngAnnotate and Minify App JS
        .pipe(jsAppFilter)
        //.pipe($.ngAnnotate({add:true}))
        .pipe($.uglify())
        .pipe(jsAppFilter.restore)
        // Restore all assets
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(config.adminBuild));
});

gulp.slurpedHome = false;
gulp.slurpedAdmin = false;

gulp.task('watch:home', function() {
    if(!gulp.slurpedHome){
        log('starting watcher');
        gulp.watch([
            config.homeJs,           
            config.homeHtml], ["optimize:home"]);
        gulp.slurpedHome = true;
    }    
});

gulp.task('watch:admin', function() {
    if(!gulp.slurpedAdmin){
        log('starting watcher');
        gulp.watch([
            config.adminJs,           
            config.adminHtml], ["optimize:admin"]);
        gulp.slurpedAdmin = true;
    }    
});

// Helper Tasks
gulp.task('images', ['clean-images'], function() {
    log('Copying compressed images to goApp folder');

    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts to goApp folder');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'font'));
});

gulp.task('styles', ['clean-styles'], function() {
    log('Compiling SASS -> CSS');

    return gulp
        .src(config.appScss)
        .pipe($.plumber())
        .pipe($.sass({includePaths:config.scss}))
        .pipe($.autoprefixer({browsers: config.browserversion}))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-images', function(done) {
    clean(config.build + 'img/**/*.*', done);
    done();
});

gulp.task('clean-fonts', function(done) {
    clean(config.build + 'font/**/*.*', done);
    done();
});

gulp.task('clean-styles', function(done) {
    clean(config.temp + '**/*.css', done);
    done();
});

gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.temp + 'templates/**.html',
        config.build + 'home/**/*.html',
        config.build + 'home/js/**/*.js',
        config.build + 'home/styles/**/*.css'
    );
    clean(files, done);
    done();
});

// Helper Functions
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
