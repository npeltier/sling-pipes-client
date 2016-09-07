module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-http');
    var jsSources = ['bower_components/jsoneditor/dist/jsoneditor.min.js','bower_components/jquery/dist/jquery.min.js','src/main/javascript/pipes.js','src/main/javascript/**/*.js'],
        cssSources = ['bower_components/jsoneditor/dist/jsoneditor.min.css','target/classes/compiled.css'];
    var httpOptions = function(host,port, ext, user, pass) {
        return {
            url: 'http://' + host + ':' + port + '/etc/sling/pipes-client/dist/spc.' + ext + '/jcr:content',
            method: 'POST',
            form: function (form) {
                form.append('jcr:data', grunt.file.read('target/classes/dist/spc.' + ext));
            },
            auth: {
                'user': user,
                'pass': pass
            }
        }
    };
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
            js: {
                options: {
                    separator:';\n\n',
                },
                src: jsSources,
                dest: 'target/classes/dist/spc.js'
            },
            css: {
                options: {
                    separator:';\n\n',
                },
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
        },
        http: {
            js: { 'options' : httpOptions('localhost','4502','js','admin','admin')},
            css: { 'options' : httpOptions('localhost','4502','css','admin','admin')},
        }
    });
    grunt.registerTask('default', ['jshint','jasmine','sass','concat','copy']);
    grunt.registerTask('test', ['jshint','jasmine']);
    grunt.registerTask('deployjs',['jshint','jasmine','concat:js','http:js']);
    grunt.registerTask('deploycss',['sass','concat:css','http:css']);
};