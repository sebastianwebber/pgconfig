module.exports = function (grunt) {
    // load grunt tasks based on dependencies in package.json
    require('load-grunt-tasks')(grunt);

    grunt.config.init({

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
                    usemin: 'assets/js/app.js',
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
            // templates: {

            //     src: '.tmp/templates.js',
            //     dest: 'dist/assets/js/templates.js'
            // }
        },
    });

    grunt.registerTask('default', [
        'clean',
        'copy:html',
        'useminPrepare',
        'ngtemplates',
        'concat',
        'uglify',
        // 'concat:dist',
        // 'uglify:templates',
        'cssmin',
        'rev',
        'usemin',
    ]);
}
