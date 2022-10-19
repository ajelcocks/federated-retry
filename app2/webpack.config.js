const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const deps = require('./package.json').dependencies

const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3102,
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app2',
      library: { type: 'var', name: 'app2' },
      filename: 'remoteEntry.js',
      exposes: {
        './App2Button': './src/App2Button',
      },
      shared: {
        react: {
          singleton: true,
          version: deps['react']
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new WebpackShellPluginNext({
      onBuildEnd:{
        scripts: ['title App2 3102'],
        blocking: false,
        parallel: true
      }
    })
  ]
};
