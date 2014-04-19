# ARES server architecture

## Technology stack
- JavaScript onlny
- Server node.js
    - [expressjs](http://expressjs.com/)
    - [express-winston](https://github.com/heapsource/express-winston)
    - [async](https://github.com/caolan/async)
- MongoDB
    - [mongoose](http://mongoosejs.com/)

## Architectural overview
TODO image

Powerpoint slide 7

## Filesystem overview

    app.js              application; executed by PM2
    package.json        dependency defintion; used by npm install
    config/             configuration files (environment, routing, expressjs, ...)
    controller/         application controller, route dispatching
    model/              mongodb models
    middleware/         custom expressjs middleware (authentication, authorization, monitoring, ...)
    build/              deployable *.zip file, api documentation, ...
    test/