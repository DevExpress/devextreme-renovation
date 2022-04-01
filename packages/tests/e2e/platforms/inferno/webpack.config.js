const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { getEntries, getPages } = require("../../helpers/pages");

const infernoPath = path.resolve(__dirname, "./app/src");
const infernoPages = ["inferno-hooks", "inferno-class"].map(
  (page) =>
    new HtmlWebpackPlugin({
      filename: `${page}.html`,
      chunks: [page],
      template: `${infernoPath}/index.html`,
    }));
const infernoEntries =
  ["inferno-hooks", "inferno-class"].reduce((entries, page) => {
    return {
      ...entries,
      [page]: `${infernoPath}/${page}.js`,
    };
  }, {});

const babelOptions = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "loose": true,
        "modules": false
      },
    ]
  ],
  "plugins": [
    "@babel/plugin-syntax-jsx",
    [
      "babel-plugin-inferno",
      {
        "imports": true
      }
    ]
  ]
};

module.exports = {
  mode: "development",
  entry: {...getEntries((infernoPath), "js"), ...infernoEntries},
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: babelOptions,
          },
          {
            loader: "@devextreme-generator/build-helpers/dist/webpack-loader",
            options: {
              platform: "inferno",
              tsConfig: path.resolve(__dirname, "./tsconfig.json"),
              defaultOptionsModule:
                path.resolve(__dirname, "../../../jquery-helpers/default_options"),
            },
          },
        ],
        exclude: ["/node_modules/", "/testing-button/"],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            
          },
        ],
        include: ["/testing-button/"],
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions,
        },
      },
    ],
  },
  resolve: {
    alias: { "@devextreme/runtime/inferno": "@devextreme/runtime/dist/inferno" },
    extensions: [".js", ".tsx", ".ts"],
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
  },

  plugins: [
    ...getPages(path.resolve(__dirname, "./app/src"))
    .concat(infernoPages),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
