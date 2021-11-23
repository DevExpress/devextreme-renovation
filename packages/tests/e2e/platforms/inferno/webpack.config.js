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
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: babelPresets,
            },
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
