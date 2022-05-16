const path = require("path");

const servers = [
  {
    platform: "Angular",
    port: 3000,
    contentBase: path.join(__dirname, "./platforms/angular/app/dist/"),
    config: require("./platforms/angular/webpack.config"),
    instance: null,
  },
  {
    platform: "React",
    port: 3001,
    contentBase: path.join(__dirname, "./platforms/react/app/dist/"),
    config: require("./platforms/react/webpack.config"),
    instance: null,
  },
  {
    platform: "Inferno",
    port: 3004,
    contentBase: path.join(__dirname, "./platforms/inferno/app/dist/"),
    config: require("./platforms/inferno/webpack.config"),
    instance: null,
  },
];

module.exports = servers;
