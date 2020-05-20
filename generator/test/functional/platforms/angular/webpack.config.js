const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    app: path.resolve('./test/functional/platforms/angular/src/main.ts')
  },

  output: {
    path: path.resolve('./test/functional/platforms/angular/dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx']
  },

  module: {
    rules: [{
      test: /\.tsx$/,
      loaders: [
        { 
          loader: 'ts-loader',
          options: {
            configFile: path.resolve('./test/functional/platforms/angular/tsconfig.json'),
          },
        }, 
        {
          loader: path.resolve('./test/functional/platforms/loader.js'),
          options: {
            platform: 'angular',
            defaultOptionsModule: "./component_declaration/default_options"
          }
        },
      ],
      exclude: ['/node_modules/']
    },
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: path.resolve('./test/functional/platforms/angular/src/tsconfig.json') }
          } , 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        include: path.resolve('./test/functional/platforms/angular/src/app'),
        loader: 'raw-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./test/functional/platforms/angular/src/index.html')
    })
  ]
};