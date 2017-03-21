module.exports = function( grunt ) {
	grunt.registerTask("require_optimizer", function(arg1) {
		var jsFile = grunt.config([ 'requirejs', 'compile' ]).options.out;
		var fs = require('fs');
		var data = fs.readFileSync(jsFile);
		
		data = data.toString().replace(/requirejs.config[^;]*;/, '');
		data = data.toString().replace(/define\.amd[^;]*;/, '');
		data = data.toString().replace(/(define|require)\([^{]*{/g, '/*GRUNT_FLAG_1*/');
		data = data.toString().replace(/}\s*\)\s*;[\s]*\/\*GRUNT_FLAG_1\*\//g, '');
		data = data.toString().replace(/}\s*\)\s*;\s*$/, '');
		data = data.toString().replace(/\/\*GRUNT_FLAG_1\*\//g, "");

		data = '' +
			'window.AutomizyGlobalPlugins = window.AutomizyGlobalPlugins || {i:0};\r\n' +
			'window.AutomizyGlobalZIndex = window.AutomizyGlobalZIndex || 2000;\r\n' +
			'window.AutomizyProject = function(obj){\r\n' +
			'	' + data + '\r\n' +
			'}';
		
		fs.writeFileSync(jsFile, data);
	});
};