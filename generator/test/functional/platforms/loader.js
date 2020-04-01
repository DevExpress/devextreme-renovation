const { getOptions } = require('loader-utils');
const { compileCode } = require('../../../build/component-compiler');
const reactGenerator = require('../../../build/react-generator').default;
const agularGenerator = require('../../../build/angular-generator').default;
//const vueGenerator = require('../../../build/vue-generator').default;

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
    // case 'vue':
    //   generator = vueGenerator;
    //   break;
    default:
      throw new Error('Invalid platform');
  }
  
  return compileCode(generator, source, {
    path: this.resourcePath,
    dirname: 'dirname'
  });
}