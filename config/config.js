var config = {
    development: {
        enableHelmet: false,
        port: 8080,
        db: 'mongodb://localhost/ares',
        env: 'development',
        init: function () {
            process.env.DEBUG = '*';
            return this;
        }
    },
    production: {}
};

var env = process.env.NODE_ENV || 'development';

module.exports = config[env].init();