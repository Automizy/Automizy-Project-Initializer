module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        requirejs: {
            compile: {
                options: {
                    baseUrl: "src/",
                    paths: {
						AutomizyProjectInitializer: ''
                    },
                    name: "AutomizyProjectInitializer/automizy-project-initializer",
                    optimize: "none",
                    out: "dist/automizy-project-initializer.js"
                }
            }
        },
		uglify: {
			all: {
				files: {
					"dist/automizy-project-initializer.min.js": ["dist/automizy-project-initializer.js"]
				},
				options: {
					preserveComments: false,
					sourceMap: true,
					sourceMapName: "dist/automizy-project-initializer.min.map",
					report: "min",
					beautify: {
						"ascii_only": true
					},
					compress: {
						hoist_funs: false,
						loops: false,
						unused: false,
						dead_code: false,
						conditionals: false,
						comparisons: false,
						evaluate: false,
						booleans: false,
						if_return: false,
						join_vars: false,
						warnings: false,
						negate_iife: false,
						drop_console: false
					}
				}
			}
		},
		copy: {
			copytodist: {
				files: [
                    {expand: true, cwd: 'src/vendor/', src: '**/*', dest: 'dist/vendor'}
				]
			}
		},
        compress: {
            main: {
                options: {
                    archive: 'dist/automizy-project-initializer.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd : "dist/",
                        src: [
                            './vendor/**',
                            './images/**',
                            './languages/**',
                            '*.js',
                            '*.css',
                            '*.map'
                        ]
                    }
                ]
            }
        }
    });
	
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadTasks('build/tasks');
    grunt.registerTask("default", ["requirejs", "require_optimizer", "uglify", "copy:copytodist", "compress"]);
    grunt.registerTask("bower", ["copy"]);
};

