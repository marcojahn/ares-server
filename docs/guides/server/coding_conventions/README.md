# ARES Coding Conventions

## Naming conventions

All resources (including server side controllers, ...) except models(!) must use pluralized naming conventions (planes, users, ...).

    REST resource       Controller      Model           MongoDB collection
    /users              users.js        user.js         users
    /monitoring         monitoring      monitoring.js   monitoring
    /planes             planes.js       plane.js        planes
    ...

## Language

The overall project language will be american englisch (en-us).

These rule applies to
    - domain specific wording
    - API Doc
    - Documentation and guides

## Coding conventions

As stated in the [Getting started](!#/guides/getting_started) guide; all hinting/linting settings will be checked out and updated using the VCS system.

All rules will be processed and used for IDE hinting automatically.

JSHint settings will be also used and checked during Grunt build system automatically.

## Clean code

- The following rules apply
    - Methods implement only one level im business logic; otherwise refactor
    - Method names reveal the implementation
    - Variables must be understandable without documentation
- 30 <?> rule
    - A maximum of 30 files per folder/package
    - A maximum of 30 <?> per file; that summarizes up for
        - methods
        - configurations
        - properties
        - route definitions
    - A maximum of 30 instructions per method

## Documentation

- At least every public method, config, property, route definition must be documented using JSDuck API doc syntax.
- Custom tags have been implemented to use JSDuck for server side API Doc generation.

    @route              specifies the implemented route
    @authorization      authorization requirements for that route
    @anonymous          route can be uses anonymous (boolean indicator)

- A complete list of available API Doc tags is available on the JSDuck github project wiki.

### Example class header

    /**
     * @class ares.server.controller.Users
     *
     * User controller does / defines routes...
     *
     * @author Marco Jahn <marco.jahn@prodyna.com>
     */

     // some code here

     /**
      * @route GET /
      *
      * @anonymous
      * Sends a list of users
      */
     users.get('/', function (req, res, next) {});

     /**
      * @route GET /:id
      * Sends a list of users.
      *
      *     {
      *         success: true,
      *         totalCount: 5,
      *         records: [
      *             {
      *                 id: 1,
      *                 username: 'foobar'
      *             },
      *             ...
      *         ]
      *     }
      *
      * @param {Number} id User id.
      *
      * @authorization {role} admin Authorization additional text
      * @authorization {owner} id Owner additional text
      *
      * @return {Users} List of users.
      */
     users.get('/:id', authorize('role:admin owner:id'), function (req, res, next) {});

The above example will result in the following API Doc output.

{@img apidoc-example.png API Doc example 200 200}

### Generating API Doc

The API Doc is generated using JSDuck.

Create custom API Doc including guides and custom tags

    jsduck --builtin-classes --welcome docs/welcome/ares-welcome.html --tags docs/jsducktags/ --guides docs/guides.json <src_dir(s)> --output <output_dir>

API Doc generation is triggered automatically by the following build actions
- Grunt build process (dev + prod)
- Grunt task

    grunt generate:apidoc

## Namespacing

Namespacing itself is only used for API Doc.

Prefix is @class; examples

    @class <projectname>.<env>.<type+package>.<className>
    @class pacflight.server.controller.Planes
    @class pacflight.server.controller.util.PlaneSimulator
    @class pacflight.server.model.Planes
    @class pacflight.client.model.Planes

## node.js modules

[Export this: Interface Design patterns for node.js modules](http://bites.goodeggs.com/posts/export-this/)

The node.js module defintions and rules can be obtained from the [Server Architecture Guide - Part file structure](#!/guide/server_architecture-section-file-structure).

## REST interface

The conventions for naming and implementing REST interfaces can be obtained from the [REST interace](#!/guide/rest_interface) documentation.