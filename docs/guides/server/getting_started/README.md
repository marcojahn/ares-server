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

## Setup and tooling (client)
- [Sencha CMD 5 (Beta)](http://cdn.sencha.com/cmd/beta/5.0.0.116/release-notes.html)

    If already installed use the following command from your command line
    senche upgrade --beta

### Windows
ARES developers using Windows must install additional software to resolve and compile NPM dependencies.

- Visual Studio Express Desktop Edition
- OpenSSL Binary and Sourcecode

Alternativelly developers using Windows can use a virtual machine image for developing ARES.

An [ARES Vagrant Box](https://github.com/marcojahn/ares-vagrant.git) can be optained from the github project.

## Version control

Github is used for version control.
Both projects client and server can be cloned from Github.

### Server

[ARES Server](https://github.com/marcojahn/ares-server.git)

    git clone https://github.com/marcojahn/ares-server.git

### Client

[ARES Client](https://github.com/marcojahn/ares-client.git)

Ares client must be checked out to an httpd server (e.g. Apache, NGinx, ...)

    git clone https://github.com/marcojahn/ares-client.git

To prevent cross origin/domain security the used httpd server must be configured to proxy all requests from localhost/WebService to localhost:8080

    Apache example
    RewriteEngine On
    RewriteRule ^/WebService/(.*) http://127.0.0.1:8080/$1 [NC,P]

## Setup and run ARES server

1. Switch to your git checkout directory
2. Resolve dependencies (initial or on package.json changes)

    npm install

3. Start server

    npm start

