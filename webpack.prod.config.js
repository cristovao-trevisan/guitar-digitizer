'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const plugins = [
  new HtmlWebpackPlugin({
    template: './app/index.ejs'
  }),
  new ExtractTextPlugin('[name].bundle.css'),
  new ProgressBarPlugin(),
  new webpack.optimize.UglifyJsPlugin()
]

module.exports = {
  target: 'node-webkit',
  entry: {
    app: './app/index',
    vendor: ['react', 'react-dom', 'semantic-ui-react']
  },
  output: {
    path: path.join(__dirname, 'www'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'file-loader?name=assets/[name].[hash].[ext]'
      }
    ]
  },
  plugins,
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['.js']
  },
  externals: {
    'node-pitchfinder': 'nodePitchfinder',
    usb: 'usb',
    midi: 'midi'
  }
}
