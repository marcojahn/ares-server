# Getting started

## Setup and tooling

- [IntelliJ](http://www.jetbrains.com/idea) or [WebStorm](http://www.jetbrains.com/webstorm)
    - [Coding conventions](#!/guide/coding_conventions) will be automatically applied with project checkout
    - Linter settings (JSHint, Closure Complier) will be automatically applied with project checkout
- GIT + Github
    - [Atlassian SourceTree](https://www.atlassian.com/software/sourcetree/) (optional)
- [MongoDB](https://www.mongodb.org/downloads) 2.6.0 (latest stable)
    - [Robomongo](http://robomongo.org/) (optional)
- node.js [0.10.26](http://nodejs.org/dist/v0.10.26/)
    - npm [1.4.7](http://nodejs.org/dist/npm/npm-1.4.7.zip)
    - [JSDuck](https://github.com/senchalabs/jsduck) (optional)
- httpd server
    - Apache or NGinx

## Version control

Github is used for version control.
Both projects client and server can be cloned from Github.

### Server

[ARES Server](https://github.com/marcojahn/ares-server.git)

    git clone https://github.com/marcojahn/ares-server.git

### Client

[ARES Client](https://github.com/marcojahn/ares-client.git)

Ares client must be checked out to an httpd server (e.g. Apache, NGinx, ...)

TODO server configuration / proxy

    git clone https://github.com/marcojahn/ares-client.git

## Setup and run ARES server

TODO Windows fu... (visual studio express, ...)

1. Switch to your git checkout directory
2. Resolve dependencies (initial or on package.json changes)

    npm install

3. Start server

    npm start

