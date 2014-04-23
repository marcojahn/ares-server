module.exports = function (app) {

    app.use(require('../middleware/authentication').auth);
    //app.use(require('../middleware/authorization').isOwner);

    // default route
    app.route('/').get(function (req, res, next) {
        res.send(200, 'generic doorpage')
    });

    // public / anonymous routes
    app.use('/anonymous/sessions', require('../controller/session'));

    // secured routes
    app.use('/monitoring', require('../controller/monitoring'));
    app.use('/planes', require('../controller/planes'));
    app.use('/users', require('../controller/users'));

};