# Middleware
TODO explain middleware

For special middleware requirements the corresponding features will be implemented and will be located in /middleware.
A middleware implementation behaves like an interceptor that is executed during a client <-> server roundtrip.
Middleware code is executed before the route implementation is executed.

## Simple middleware example

    // example auth interceptor
    function auth (req, res, next) {
        if (req.session.user.role === 'admin') {
            next();
        } else {
            res.json(401, {success: false, reason: 'NOT_AUTHORIZED');
        }
    };

    users.put('/:id', auth, function (req, res, next) {
        // if authentication passes this code will be executed
        res.json(200, {success: true});
    });

## Parameterized middleware

    // example auth interceptor
    function auth (options) {
        // given options can be accessed here

        return function (req, res, next) {
            // option based checks
        };

    };

    users.put('/:id', auth('role:admin'), function (req, res, next) {
        // if authentication passes this code will be executed
        res.json(200, {success: true});
    });