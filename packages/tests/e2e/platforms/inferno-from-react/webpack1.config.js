const webpack = require("webpack");
const path = require("path");
const { getEntries, getPages } = require("../../helpers/pages");

module.exports = {
  mode: "development",
  entry: getEntries(path.resolve(__dirname, "./app/src"), "js"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
          // {
          //   loader: "@devextreme-generator/build-helpers/dist/webpack-loader",
          //   options: {
          //     // Попробуй переписать на platform: "inferno-from-react", на generator: new InfernoFromReactGenerator(),
          //     // Тогда не надо будет в build-helper знать о всех генераторах и в DevExtreme будет меньше зависимостей.
          //     platform: "inferno-from-react",
          //     tsConfig: path.resolve(__dirname, "./tsconfig.json"),
          //   },
          // },
          // {
          //   loader: "ts-loader",
          // },
          // Это кастомный лоадер, который позволяет переименовать js-ts Возможно есть стандартный.
          // {
          //   loader: "rename-all-js*-to-ts*",
          // },
          ///// Тут нужен tsconfig.react.json
          {
            loader: "@devextreme-generator/build-helpers/dist/webpack-loader",
            options: {
              platform: "react",
              tsConfig: path.resolve(__dirname, "./tsconfig.react.json"),
              defaultOptionsModule:
                path.resolve(__dirname, "../../../jquery-helpers/default_options"),
            },
          },
        ],
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"],
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
  },

  plugins: [
    ...getPages(path.resolve(__dirname, "./app/src")),
    new webpack.HotModuleReplacementPlugin(),
  ],
};