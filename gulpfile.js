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

gulp.task('gae-serve', function() {
    return gulp
        .src('./app', {read: false})
        .pipe($.shell([
            'goapp serve <%= file.path%>'
    ], {
        templateData: {}
    }));
});

// Helper Tasks
gulp.task('images', ['clean-images'], function() {
    log('Copying compressed images to goApp folder');
    
    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('clean-images', function(done) {
    clean(config.build + 'img/**/*.*', done);
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
