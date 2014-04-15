# Personal notes
start mongod:

    mongod --config /usr/local/etc/mongod.conf

# NodeJS with ExpressJS 4.0 and Mongoose

Project ARES (Airplane REservation System) is developed during PRODYNA PAC certification program and can be used as project template for upcoming projectsl.

## TODOs
- [HTTP Status codes](https://developer.yahoo.com/social/rest_api_guide/http-response-codes.html)

## Used Tools and Frameworks

## Setup
Due to the [bcrypt](https://github.com/ncb000gt/node.bcrypt.js/) dependency a c/c++ compile env must be available.
For compiling bcrypt [node-gyp](https://github.com/TooTallNate/node-gyp/) an its dependencies must be installed (good luck).

# Documentation
## Additional Links
### node.js
- [Exporting the right way(s)](http://bites.goodeggs.com/posts/export-this/#function)
- [NodeJS exports vs module exports](http://www.hacksparrow.com/node-js-exports-vs-module-exports.html)
### ExpressJS 4.0
- [Migration form ExpressJS 3.x to 4](http://scotch.io/bar-talk/expressjs-4-0-new-features-and-upgrading-from-3-0)
- [Alternative to ExpressJS 3.x express-resource-new](https://github.com/hyubs/express-path)
- [Express 4.0 Route API Documentation](http://expressjs.com/4x/api.html#router)
## Structure
## Important Files

## Security
For security (csrf, ...) the [Helmet](https://github.com/evilpacket/helmet) library is used.
Every HTTP method type except GET, OPTIONS, HEAD is intercepted by the middleware and a csrf token is needed.
Every token is limited to the session.

### Generating a token

    GET http://localhost:8080/anonymous/session/csrftoken
    {
        "csrftoken":"9Hr449b9JyQyx2yGtkk3jzeZ3pbc7C2Gwlvmo="
    }

### Using the token
- Add a HTTP header "X-CSRF-Token"
- add a parameter "_csrf" to either req.body or req.query

### Login procedure
1) POST to localhost:8080/anonymous/session
    {
        "username": "xyz",
        "password": "1234"
    }

### Authentication

### Authorization
Authorization is handled as api middleware.
Example:

    <controller>.<operation>(<String:REST>, authorize(<list>), <callback>) {});
    users.get('/:id', authorize('role:admin owner:id permission:read'), function (req, res, next) {


Now every request having "/:id" parameter will be checked by isOwner method and will compare if session user id equals given parameter id.
If not a HTTP 666 (TODO) Status is sent