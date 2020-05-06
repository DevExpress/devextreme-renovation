const { getOptions } = require('loader-utils');
const { compileCode } = require('../../../build/component-compiler');
const reactGenerator = require('../../../build/react-generator').default;
const agularGenerator = require('../../../build/angular-generator').default;
const vueGenerator = require('../../../build/vue-generator').default;
const path = require("path");

module.exports = function(source) {
  const { platform } = getOptions(this);
  let generator = null;

  switch(platform) {
    case 'react':
      generator = reactGenerator;
      break;
    case 'angular':
      generator = agularGenerator;
      break;
    case 'vue':
      generator = vueGenerator;
      break;
    default:
      throw new Error('Invalid platform');
  }

  const normalizedPath = path.normalize(this.resourcePath);
  const moduleParts = normalizedPath.split(/(\/|\\)/);
  const folderPath = path.resolve(moduleParts.slice(0, moduleParts.length - 2).join("/"));
  
  return compileCode(generator, source, {
    path: this.resourcePath,
    dirname: folderPath
  });
}