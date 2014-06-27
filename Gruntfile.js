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
            all: {
                options: {
                    reporter: 'spec'
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
        }
    });

    grunt.registerTask('build', [
        'clean:build',
        'jsduck',
        'complexity',
        'mochaTest',
        'copy:build',
        'compress:build'
    ]);

    grunt.loadNpmTasks('grunt-complexity');
    grunt.registerTask('complexityReport', ['complexity']);

    grunt.registerTask('jsduck', [
        'clean:docs',
        'shell:docs',
        'compress:docs'
    ]);

};