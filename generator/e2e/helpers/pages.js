const HtmlWebpackPlugin = require("html-webpack-plugin");

const PAGES = ["index", "native-components"];

const getPages = (path) =>
  PAGES.map(
    (page) =>
      new HtmlWebpackPlugin({
        filename: `${page}.html`,
        chunks: [page],
        template: `${path}/index.html`,
      })
  );

const getEntries = (path, ext) =>
  PAGES.reduce((entries, page) => {
    return {
      ...entries,
      [page]: `${path}/${page}.${ext}`,
    };
  }, {});

module.exports = {
  getPages,
  getEntries,
};
