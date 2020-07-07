const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",

  entry: {
    app: path.resolve("./e2e/platforms/angular/src/main.ts"),
  },

  output: {
    path: path.resolve("./e2e/platforms/angular/dist"),
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
  },

  resolve: {
    extensions: [".ts", ".js", ".tsx"],
  },

  module: {
    rules: [
      {
        test: /\.tsx$/,
        loaders: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve("./e2e/platforms/angular/tsconfig.json"),
            },
          },
          {
            loader: path.resolve("./build/webpack-loader.js"),
            options: {
              platform: "angular",
              defaultOptionsModule: "./component_declaration/default_options",
            },
          },
        ],
        exclude: ["/node_modules/"],
      },
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: path.resolve(
                "./e2e/platforms/angular/src/tsconfig.json"
              ),
            },
          },
          "angular2-template-loader",
        ],
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: "file-loader?name=assets/[name].[hash].[ext]",
      },
      {
        test: /\.css$/,
        include: path.resolve("./e2e/platforms/angular/src/app"),
        loader: "raw-loader",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve("./e2e/platforms/angular/src/index.html"),
    }),
  ],
};
