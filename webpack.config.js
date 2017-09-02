const path = require('path')
const webpack = require('webpack')

module.exports = function () {
  return {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].min.js',
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ],
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin(),
    ]
  }
}
