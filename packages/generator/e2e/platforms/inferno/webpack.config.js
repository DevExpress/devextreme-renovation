const webpack = require("webpack");
const path = require("path");
const { getEntries, getPages } = require("../../helpers/pages");

const babelPresets = [
  "@babel/preset-env",
  [
    "@babel/preset-react",
    {
      pragma: "h",
    },
  ],
];

module.exports = {
  mode: "development",
  entry: getEntries(path.resolve(__dirname, "./app/src"), "js"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: "babel-loader",
            options: {
              presets: babelPresets,
            },
          },
          {
            loader: path.resolve("./build/webpack-loader.js"),
            options: {
              platform: "inferno",
              tsConfig: path.resolve("./e2e/platforms/inferno/tsconfig.json"),
              defaultOptionsModule:
                "./build/component_declaration/default_options",
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
            presets: babelPresets,
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
