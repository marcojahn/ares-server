module.exports = function (app) {

    app.use(require('../middleware/authentication').auth);
    //app.use(require('../middleware/authorization').isOwner);

    // default route
    app.route('/').get(function (req, res, next) {
        res.send(200, 'generic doorpage')
    });

    // public / anonymous routes
    app.use('/anonymous/session', require('../controller/session'));

    // secured routes
    app.use('/planes', require('../controller/planes'));
    app.use('/users', require('../controller/users'));

};