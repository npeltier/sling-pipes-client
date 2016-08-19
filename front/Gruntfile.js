module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    var jsSources = ['bower_components/jsoneditor/dist/jsoneditor.min.js','bower_components/jquery/dist/jquery.min.js','src/main/javascript/pipes.js','src/main/javascript/**/*.js'],
        cssSources = ['bower_components/jsoneditor/dist/jsoneditor.min.css','target/classes/compiled.css'];
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/main/**/*.js']
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'target/classes/compiled.css': 'src/main/scss/main.scss'
                }
            }
        },
        jasmine:{
            test: {
              src: jsSources,
              options: {
                specs: 'src/test/javascript/specs/*Spec.js'
              }
            }
        },
        concat: {
            options: {
                separator:';\n\n',
            },
            js: {
                src: jsSources,
                dest: 'target/classes/dist/spc.js'
            },
            css: {
                src: cssSources,
                dest: 'target/classes/dist/spc.css'
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: 'bower_components/jsoneditor/dist/img/*', flatten: true, dest: 'target/classes/dist/img/', filter: 'isFile'}
                ]
            }
        }
    });
    grunt.registerTask('default', ['jshint','jasmine','sass','concat','copy']);
    grunt.registerTask('test', ['jshint','jasmine']);
};