const path = require('path')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	entry: {
		server: './src/server.js'
	},
	target: 'node',
  devtool: '#source-map',
	output: {
		filename: 'server.bundle.js',
		libraryTarget: 'commonjs2'
	},
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },	
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        exclude: /node_modules/,
        include: [resolve('src')]
      }
		],
	}
}