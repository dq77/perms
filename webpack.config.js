/*
 * @Author: 刁琪
 * @Date: 2020-11-30 10:34:05
 * @LastEditors: わからないよう
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    host: "0.0.0.0",
    hot: true,
    hotOnly: true,
    port: 8842,
    proxy: {
      "/picert": {
        pathRewrite: {"^/picert" : ""}, // 路径重写
        // target: "http://localhost:9305"
        target: "http://154.222.1.52:9305"
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: 'src/index.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
};