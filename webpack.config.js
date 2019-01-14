const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = [
  {
    entry: ['./app/stylesheets/app.scss'],
    output: {
      // This is necessary for webpack to compile
      // But we never use style-bundle.js
      path: path.resolve(__dirname, 'build/app'),

      filename: 'style-bundle.js',
    },
    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules'],
            }
          },
        ]
      }]
    },
    plugins : [
        new WriteFilePlugin()
    ]
  },
  {
    entry: "./app/javascript/app.js",
    output: {
      path: path.resolve(__dirname, 'build/app'),
      filename: "bundle.js"
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader'
        }]
      }]
    },
    plugins : [
        new WriteFilePlugin(),
        new CopyWebpackPlugin([
            { from: './app/index.html', to: "index.html" }
        ])
    ]
  }
];
