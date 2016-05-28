module.exports = function (grunt) {
    // load grunt tasks based on dependencies in package.json
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
        dirs: {
            source: 'app',
            output: 'dist',
            temp: '.tmp'
        },
        bower: {
            install: {
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
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
                    'partials/*.html',
                    'partials/tuning/*.html'
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
            html: 'app/index.html',
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
    });

    grunt.registerTask('default', [
        'clean',
        'bower',
        'copy:html',
        'useminPrepare',
        'ngtemplates',
        'concat',
        'uglify',
        'cssmin',
        'rev',
        'usemin',
        'clean:1',
    ]);
}
