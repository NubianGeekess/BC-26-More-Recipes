const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [path.join(__dirname, 'client/Index.jsx')],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/bundle.js',
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('./css/styles.css')
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: ['transform-class-properties', 'transform-object-rest-spread']
        }
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.(jpe?g|gif|png)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      },
      {
        test: /\.mp4$/,
        // options: {
        //   limit: 2000000,
        //   mimetype: 'video/mp4'
        // }
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  node: {
    dns: 'empty',
    net: 'empty',
    fs: 'empty'
  }
};