module.exports = function (grunt) {
    // load grunt tasks based on dependencies in package.json
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
        dirs: {
            source: 'src',
            output: 'dist',
            temp: '.tmp',
            template_dir: 'app/templates'
        },
        bower: {
            install: {
                options: {
                    production: true,
                    targetDir: '<%= dirs.source %>/bower_components',
                    install: true,
                    verbose: false,
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
        },
        ngtemplates: {
            app: {
                cwd: '<%= dirs.source %>',
                src: [
                    '<%= dirs.template_dir %>/*.html',
                    '<%= dirs.template_dir %>/**/*.html',
                ],
                dest: '<%= dirs.temp %>/templates.js',
                options: {
                    module: 'pgconfig.templates',
                    standalone: true,
                    usemin: 'assets/js/app.min.js',
                    prefix: '/',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }

                }
            },

            dev: {
                cwd: '<%= dirs.source %>',
                src: [
                    '<%= dirs.template_dir %>/*.html',
                    '<%= dirs.template_dir %>/**/*.html',
                ],
                dest: '<%= dirs.temp %>/templates.js',
                options: {
                    module: 'pgconfig.templates',
                    standalone: true,
                    prefix: '/',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }

                }
            }
        },
        rev: {
            files: {
                options: {
                    algorithm: 'md5',
                    length: 16,
                    encoding: 'utf8'
                },
                src: [
                    '<%= dirs.output %>/assets/js/*.js',
                    '<%= dirs.output %>/assets/css/*.css',
                ]
            }
        },
        useminPrepare: {
            html: '<%= dirs.source %>/index.html',
            options: {
                dest: '<%= dirs.output %>',
                staging: '<%= dirs.temp %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglify'],
                            css: ['concat', 'cssmin']
                        }
                    }
                }
            }
        },
        clean: ['<%= dirs.output %>', '<%= dirs.temp %>'],
        usemin: {
            html: [
                'dist/index.html'
            ]
        },
        copy: {
            html: {
                src: '<%= dirs.source %>/index.html',
                dest: '<%= dirs.output %>/index.html',
            },
        },
        concat: {
            options: {
                // Replace all 'use strict' statements in the code with a single one at the top
                banner: "'use strict';\n",
                process: function (src, filepath) {
                    if (filepath.toLowerCase().indexOf('.js') != -1)
                        return '\n// Source file: ' + filepath + ' \n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    else
                        return '\n/* Source file: ' + filepath + ' */\n' + src;
                },
            },
            vendorjs: {
                src: [
                    // '<%= dirs.output %>/assets/js/app.min.js',
                    '<%= dirs.source %>/bower_components/ngclipboard/dist/ngclipboard.js',
                ],
                dest: '<%= dirs.output %>/assets/js/vendor.min.js'
            },
            appjs: {
                src: [
                    // '<%= dirs.output %>/assets/js/app.min.js',
                    '<%= dirs.source %>/app/*.js',
                    '<%= dirs.source %>/app/**/**.js',
                    '<%= dirs.temp %>/templates.js',
                ],
                dest: '<%= dirs.output %>/assets/js/app.min.js'
            },
            css: {
                options: {
                    banner: '',
                },
                src: [
                    '<%= dirs.source %>/app/styles/*.css',
                ],
                dest: '<%= dirs.output %>/assets/css/style.min.css'
            }

        },
        watch: {
            dev: {
                files: [
                    'Gruntfile.js',
                    '<%= dirs.source %>/app/**.js',
                    '<%= dirs.source %>/app/**/**.js',
                    '<%= dirs.source %>/**/*.html',
                    '<%= dirs.source %>/styles/*.css'
                ],
                tasks: [
                    'clean',
                    'copy:html',
                    'useminPrepare',
                    'ngtemplates:dev',
                    'concat:appjs',
                    'concat:vendorjs',
                    'concat:css',
                    'usemin',
                    // 'clean:1',
                ],
                options: {
                    // atBegin: true
                    livereload: true
                }
            },
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8000,
                    base: '<%= dirs.output %>',
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'bower',
        'copy:html',
        'useminPrepare',
        'ngtemplates:app',
        'concat',
        'uglify',
        'cssmin',
        'rev',
        'usemin',
        'clean:1',
    ]);

    grunt.registerTask('dev', ['bower', 'connect:server', 'watch:dev']);
}
