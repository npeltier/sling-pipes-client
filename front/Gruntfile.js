module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    var sources = ['bower_components/jquery/dist/jquery.min.js','src/main/javascript/pipes.js','src/main/javascript/**/*.js'];
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
                    'target/classes/dist/spc.css': 'src/main/scss/main.scss'
                }
            }
        },
        jasmine:{
            test: {
              src: sources,
              options: {
                specs: 'src/test/javascript/specs/*Spec.js'
              }
            }
        },
        concat: {
            options: {
                separator: ';\n\n',
            },
            dist: {
                src: sources,
                dest: 'target/classes/dist/spc.js'
            },
        },
    });
    grunt.registerTask('default', ['jshint','jasmine','sass','concat']);
    grunt.registerTask('test', ['jshint','jasmine']);
};