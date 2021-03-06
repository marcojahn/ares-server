# REST Interface

All resources (including server side controllers, ...) except models(!) must use pluralized naming conventions (planes, users, ...).

Every REST resource follows the following principle

    http(s)://<host:port>/resource

    e.g.
    http://localhost:8080/users/1234

Using Apache http with ExtJS client REST resources will be prefixed with a *WebService/ folder*

    http(s)://<host:port>/WebService/<resource>

    e.g. http://localhost/WebService/users/1234

## Response

HTTP Status Codes will be used for every response indicating the success (or not).

    200     Request successfull, result within response body
    404     Request not successfull, error message within response body
    ...

    Example
    HTTP Status         Response
    200                 {success: true, totalCount: 5, results: [{ /* data */ }]}
    404                 {success: false, reason: 'RESOURCE_NOT_FOUND'}
    401                 {success: false, reason: 'NOT_AUTHORIZED'}

## REST interface to controller mapping

Example based on *users*

    Method      REST resource   Action                  Data in request body        Controller
    GET         /users          list of all users       no                          users.get('/', ...)
    GET         /users/:id      user defined by id      no                          users.get('/:id', ...)
    POST        /users          create a new user       yes                         users.post('/', ...)
    PUT         /users/:id      update a user by id     yes                         users.put('/:id', ...)
    DELETE      /users/:id      delete a user by id     no                          users.delete('/:id', ...)

## Implementing a REST interface

    /**
     * @route GET /
     *
     * @anonymous
     * Sends a list of users
     */
    users.get('/', function (req, res, next) {
        User.find({}, function (err, user) {
             /* if (err) handle your error*/

            res.json(200, {
                success: true,
                total: user.length,
                records: user
            });
        });
    });

    // definition in config/routes.js
    var users = require('./controller/users');
    app.resource('users', users);

## Controllables

As explained above simple actions based on resources are directly handles by REST defintion and HTTP methods (CRUD).

But when *to do* things based on resources REST resources must implement and specify _controllables_ a client can interact with.

Example

    DELETE http://localhost:8080/monitoring/purge

Will delete all records within the _monitoring_ collection.

## Matrix parameters

TODO

    http://localhost:8080/monitoring/aggregate/route;path=/users

    monitoring.get('/aggregate/route;path=:route(*)', function (req, res, next) {});