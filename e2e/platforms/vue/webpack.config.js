const VueLoaderPlugin = require("vue-loader/lib/plugin");
const path = require("path");
const webpack = require("webpack");

const { getEntries, getPages } = require("../../helpers/pages");

module.exports = {
  mode: "development",
  entry: getEntries(path.resolve(__dirname, "./app/src"), "js"),
  module: {
    rules: [
      {
        test: /\.tsx$/,
        loaders: [
          {
            loader: "vue-loader",
          },
          {
            loader: path.resolve("./build/webpack-loader.js"),
            options: {
              platform: "vue",
              defaultOptionsModule:
                "./build/component_declaration/default_options",
            },
          },
        ],

        exclude: ["/node_modules/"],
      },

      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },

      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },

      {
        test: /\.ts$/,
        loaders: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          {
            loader: path.resolve("./build/webpack-loader.js"),
            options: {
              platform: "vue",
              defaultOptionsModule:
                "./build/component_declaration/default_options",
            },
          },
        ],

        exclude: ["/node_modules/"],
      },
    ],
  },

  resolve: {
    alias: { vue: "vue/dist/vue.esm.js" },
    extensions: [".js", ".tsx", ".ts"],
  },

  output: {
    path: path.resolve("./e2e/platforms/angular/dist"),
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
  },

  plugins: [
    ...getPages(path.resolve(__dirname, "./app/src")),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
