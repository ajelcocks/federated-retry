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
    port: 3001,
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
      name: 'app1',
      remotes: {
        app2: `app2@http://localhost:3002/remoteEntry.js`,
      },
      shared: ['react'],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new WebpackShellPluginNext({
      onBuildEnd:{
        scripts: ['title App1 3001'],
        blocking: false,
        parallel: true
      }
    })
  ],
};
