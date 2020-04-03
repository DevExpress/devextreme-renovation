const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve('./test/functional/platforms/react/app/src/index.js'),
  module: {
    rules: [{
      test: /\.tsx?$/,
      loaders: [{ 
        loader: 'babel-loader',
        options: {
          presets: [ 
            "@babel/preset-env",
            "@babel/preset-react",
          ]
        }}, { 
          loader: 'ts-loader',
          options: {
            configFile: path.resolve('./test/functional/platforms/react/tsconfig.json'),
          },
        }, {
          loader: path.resolve('./test/functional/platforms/loader.js'),
          options: {
            platform: 'react'
          }
        },
      ],
      exclude: ['/node_modules/']
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: { 
        loader: 'babel-loader',
        options: {
          presets: [ 
            "@babel/preset-env",
            "@babel/preset-react",
          ]
        },
      },
    }]
  },
  
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
