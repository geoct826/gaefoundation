module.exports = function() {
    var goApp = './app/';
    var client = './src/';
    var homeApp = './src/home/';
    var adminApp = './src/admin/';
    var root = './';
    var temp = './.tmp/';

    var config = {
        alljs: [
            client + '**/*.js'
        ],
        build: goApp + '/static/',
        images: client + 'img/**/*.*'
    };

    return config;
};
