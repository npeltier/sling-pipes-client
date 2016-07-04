module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/main/javascript/*.js','src/test/javascript/*.js']
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
        concat: {
            options: {
                separator: ';\n\n',
            },
            dist: {
                src: ['bower_components/jquery/dist/jquery.min.js','src/main/javascript/*.js'],
                dest: 'target/classes/dist/spc.js'
            },
        },
    });
    grunt.registerTask('default', ['jshint','sass','concat']);
};