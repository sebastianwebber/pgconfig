module.exports = function (grunt) {
    // load grunt tasks based on dependencies in package.json
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
        bower: {
            install: {
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
                options: {
                    production: true,
                    targetDir: './app/bower_components', 
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
                cwd: 'app',
                src: [
                    'partials/*.html',
                    'partials/tuning/*.html'
                ],
                dest: '.tmp/templates.js',
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
                    'dist/assets/js/*.js',
                    'dist/assets/css/*.css',
                ]
            }
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist',
                staging: '.tmp',
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
        clean: ['dist', '.tmp'],
        usemin: {
            html: [
                'dist/index.html'
            ]
        },
        copy: {
            html: {
                src: './app/index.html',
                dest: './dist/index.html'
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
