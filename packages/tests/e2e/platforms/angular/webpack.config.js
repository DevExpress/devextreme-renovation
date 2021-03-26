const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { getPages, getEntries } = require("../../helpers/pages");

module.exports = {
  mode: "development",

  entry: {
    ...getEntries(path.resolve(__dirname, "./src"), "ts"),
  },

  output: {
    path: path.resolve(__dirname, "./dist"),
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
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "../../components"),
        loaders: [
          {
            loader: "@devextreme-generator/build-helpers/dist/webpack-loader",
            options: {
              platform: "angular",
              defaultOptionsModule: path.resolve(__dirname, "../../../jquery-helpers/default_options"),
              tsConfig: path.resolve(__dirname, "./tsconfig.json"),
            },
          },
        ],
        exclude: ["/node_modules/"],
      },
      {
        test: /\.ts$/,
        exclude: path.resolve(__dirname, "../../components"),
        loaders: [
          {
            loader: "ts-loader",
            options: {
              ignoreDiagnostics: [2614, 2769],
              configFile: path.resolve(__dirname, "./tsconfig.json"),
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
        include: path.resolve(__dirname, "./src/app"),
        loader: "raw-loader",
      },
    ],
  },

  plugins: [...getPages(path.resolve(__dirname, "./src"))],
};
