const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve('./e2e/platforms/react/app/src/index.js'),
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
            configFile: path.resolve('./e2e/platforms/react/tsconfig.json'),
          },
        }, {
          loader: path.resolve('./e2e/platforms/loader.js'),
          options: {
            platform: 'react',
            defaultOptionsModule: "./build/component_declaration/default_options"
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
