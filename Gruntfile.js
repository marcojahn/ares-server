module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var appConfig = {
        app: 'app',
        buildFilePut: 'build',
        build: 'build/ares',
        docs: 'build/docs',
        targetFileName: 'ares.zip',
        docsTargetFileName: 'docs.zip',
        sources: [
            'config/*',
            'controller/*',
            'middleware/*',
            'model/*',
            'util/**/*.js',
            'app.js'
        ]
    };

    try {
        appConfig.dependencies = require('./package.json').dependencies || [];
    } catch (e) {}

    grunt.initConfig({
        appconfig: appConfig,
        clean: {
            build: {
                files: [{
                    dot: true,
                    src: [
                        '<%= appconfig.build %>'
                    ]
                }]
            },
            docs: {
                files: [{
                    dot: true,
                    src: [
                        '<%= appconfig.docs %>'
                    ]
                }]
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    dest: '<%= appconfig.build %>',
                    src: '<%= appconfig.sources %>'
                }, {
                    expand: true,
                    dest: '<%= appconfig.build %>',
                    src: [
                        'node_modules/**'
                    ],
                    filter: function (filepath) {
                        // only include node modules which are non dev dependencies, according to package.json
                        var depname = filepath.substring(filepath.indexOf("/")+1, filepath.indexOf("/", filepath.indexOf("/")+1));
                        return Object.keys(appConfig.dependencies).indexOf(depname) !== -1;
                    }
                }]
            }
        },
        mochaTest: {
            xml: {
                options: {
                    reporter: 'XUnit',
                    require: 'test/blanket',
                    captureFile: 'build/coverage.xml'
                },
                src: ['test/**/*.js']
            },
            test: {
                options: {
                    reporter: 'spec',
                    // Require blanket wrapper here to instrument other required
                    // files on the fly.
                    //
                    // NB. We cannot require blanket directly as it
                    // detects that we are not running mocha cli and loads differently.
                    //
                    // NNB. As mocha is 'clever' enough to only run the tests once for
                    // each file the following coverage task does not actually run any
                    // tests which is why the coverage instrumentation has to be done here
                    require: 'test/blanket'
                },
                src: ['test/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: 'build/coverage.html'
                },
                src: ['test/**/*.js']
            }
        },
        compress: {
            build: {
                options: {
                    archive: '<%= appconfig.buildFilePut %>' + '/<%= appconfig.targetFileName %>'
                },
                files: [{
                    expand: true, cwd: '<%= appconfig.build %>', src: ['**'], dest: 'ares/'
                }]
            },
            docs: {
                options: {
                    archive: '<%= appconfig.buildFilePut %>' + '/<%= appconfig.docsTargetFileName %>'
                },
                files: [{
                    expand: true, cwd: '<%= appconfig.docs %>', src: ['**'], dest: 'ares/'
                }]
            }
        },
        complexity: {
            generic: {
                src: '<%= appconfig.sources %>',
                options: {
                    breakOnErrors: true,
                    jsLintXML: '<%= appconfig.buildFilePut %>' + '/report.xml', // create XML JSLint-like report
                    checkstyleXML: '<%= appconfig.buildFilePut %>' + '/checkstyle.xml', // create checkstyle report
                    errorsOnly: false,               // show only maintainability errors
                    cyclomatic: 8, //[5, 7, 12],          // or optionally a single value, like 3
                    halstead: 25, //[8, 13, 20],           // or optionally a single value, like 8
                    maintainability: 80,//100
                    hideComplexFunctions: false,      // only display maintainability
                    broadcast: false                 // broadcast data over event-bus
                }
            }
        },
        shell: {
            docs: {
                command: 'jsduck' +
                    ' --builtin-classes' +
                    ' --images docs/images' +
                    ' --welcome docs/welcome/ares-welcome.html' +
                    ' --tags docs/jsducktags' +
                    ' --guides docs/guides.json' +
                    ' config/ controller/ middleware/ model/ util/ app.js' +
                    ' --output <%= appconfig.docs %>'
            }
        },
        jshint: {
            options: {
                force: true,
                //reporter: require('jshint-stylish'),
                //reporterOutput: '<%= appconfig.buildFilePut %>' + '/jshint'
                reporter: require('jshint-junit-reporter'),
                reporterOutput: '<%= appconfig.buildFilePut %>' + '/jshint-junit-output.xml',

                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: false,

                globals: {
                    'exports': true
                }

            },
            all: '<%= appconfig.sources %>'
        }
    });

    grunt.loadNpmTasks('grunt-complexity');
    grunt.registerTask('complexityReport', ['complexity']);

    grunt.registerTask('jsduck', [
        'clean:docs',
        'shell:docs',
        'compress:docs'
    ]);

    // TODO test istanbul for test coverage
    // https://github.com/taichi/grunt-istanbul
    // https://github.com/gregjopa/express-app-testing-demo
    grunt.registerTask('testcov', [
        //'mochaTest:xml',
        'mochaTest:test',
        'mochaTest:coverage'
    ]);

    grunt.registerTask('test', ['mochaTest:test']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('build', [
        'clean:build',
        'jsduck',
        'jshint',
        'complexity',
        //'mochaTest:xml',
        'mochaTest:test',
        'mochaTest:coverage',
        'copy:build',
        'compress:build'
    ]);
};