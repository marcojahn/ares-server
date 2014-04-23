# Dependency management

## NPM basics

NPM is used for node.js dependency management. It can handle multipe dependency targets (build production, dev, ...).

The [NPM repository](https://www.npmjs.org/) lists available public dependencies that can used within a project.

NPM can use a projects _package.json_ file to handle all dependencies automatically.

- [package.json API documentation](https://www.npmjs.org/doc/json.html)
- [package.json interactive cheatsheet](http://package.json.nodejitsu.com/)
- [Guide package dependencies done right](http://blog.nodejitsu.com/package-dependencies-done-right/)

### Example package.json

    {
        "name": "ares",
        "description": "Airplane REservation System",
        "version": "0.0.1",
        "author": "Marco Jahn <marco.jahn@gmail.com>",
        "contributors": [
            {
                "name": "Marco Jahn",
                "email": "marco.jahn@gmail.com"
            }
        ],
        "dependencies": {
            "body-parser": "^1.0.2",
            "cookie-parser": "^1.0.1",
            "csurf": "^1.1.0",
            "express": "^4.0.0",
            "express-session": "^1.0.3",
            "helmet": "^0.2.0",
            "method-override": "^1.0.0",
            "mongoose": "^3.8.8",
            "morgan": "^1.0.0",
            "bcrypt": "^0.7.7"
        },
        "devDependencies": {},
        "keywords": [],
        "repository": "",
        "scripts": {},
        "engines": {
            "node": ">= 0.10.0"
        },
        "license": "NONE"
    }


## Adding a new dependency

    npm install <dependency> --save

The _--save_ flag will update the project _package.json_ file

## Updating all dependencies

    npm update --save