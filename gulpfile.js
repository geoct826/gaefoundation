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

gulp.task('gae-serve', ['optimize'], function() {
    return gulp
        .src('./app', {read: false})
        .pipe($.shell([
            'goapp serve <%= file.path%>'
    ], {
        templateData: {}
    }));
});

// Build Tasks
gulp.task('build-routes', function () {
    log('Creating routes from templates');
    var router = require('front-router');

    return gulp
        .src(config.homeTemplate + '**/*.html')
        .pipe(router({
            path: config.temp + 'routes.js',
            root: config.homeTemplate
        }))
        .pipe(gulp.dest(config.temp + 'templates'));
});

gulp.task('templatecache', function() {
    log('Creating $templateCache for foundation components');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options        
            ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('apptemplatecache', ['build-routes'], function() {
    log('Creating $templateCache for application templates');

    return gulp
        .src(config.temp + 'templates/**/*.html')
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.appTemplateCache.file,
            config.appTemplateCache.options        
            ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('wiredep', function() {
    log('Wire up the bower css/js and app js into index.html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.homeIndex)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.homeJs)))
        .pipe(gulp.dest(config.homeApp));
});

gulp.task('inject', ['wiredep', 'styles', 'templatecache', 'apptemplatecache'], function() {
    log('Wire up the app css into index.html');

    return gulp
        .src(config.homeIndex)
        .pipe($.inject(gulp.src(config.homeCss)))
        .pipe(gulp.dest(config.homeApp));
});

gulp.task('optimize', ['inject', 'watch'], function() {
    log('Optimizing javascript, css, and html files');

    var assets = $.useref.assets({searchPath: './'});
    var cssFilter = $.filter('**/*.css', {restore:true});
    var jsAppFilter = $.filter('**/' + config.homeOptimized.app, {restore:true});
    var jsLibFilter = $.filter('**/' + config.homeOptimized.lib, {restore:true});
    //var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.homeIndex)
        .pipe($.plumber())
        .pipe($.inject(gulp.src([
            config.temp + 'templates.js',
            config.temp + 'appTemplates.js'], {read: false}), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe($.inject(gulp.src(config.temp + 'routes.js', {read: false}), {
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


gulp.slurped = false;

gulp.task('watch', function() {
    if(!gulp.slurped){
        log('starting watcher');
        gulp.watch([
            config.homeJs,           
            config.homeTemplate + '**/*.html'], ["optimize"]);
        gulp.slurped = true;
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
