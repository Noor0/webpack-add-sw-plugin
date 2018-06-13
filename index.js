const fs = require('fs');

function AddSW(options) {
	this.src = options.src;
	this.filename = options.filename;
}

AddSW.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, cb) => {
    fs.readFile(this.src, (err, data) => {
			const assets = Object.keys(compilation.assets).map(item => `"${item}"`);
			const { hash } = compilation;
			const { outputPath } = compiler;
			data = data
				.toString('utf8')
				.replace("%ASSETS%", `[${assets}]`)
				.replace("%VERSION%", hash);
			fs.writeFile(outputPath + this.filename, data);
		});
    cb();
  });
}

module.exports = AddSW;
