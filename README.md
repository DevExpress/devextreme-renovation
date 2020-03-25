# devextreme-renovation

[![Build Status](https://dev.azure.com/pavelgruba/devextreme-renovation/_apis/build/status/DevExpress.devextreme-renovation?branchName=master)](https://dev.azure.com/pavelgruba/devextreme-renovation/_build/latest?definitionId=1&branchName=master)

## Generator

[![npm package](https://img.shields.io/npm/v/devextreme-generator?logo=npm&style=flat-square)](https://www.npmjs.org/package/devextreme-generator)


### Building
  - cwd
    `cd ./generator`
  - install packages
    `npm install`
  - build
    `npm run build` or `npm run build-dist` or `npm run dev`
  - test
    `npm test`
    
### Publishing

Increment version in [package.json](https://github.com/DevExpress/devextreme-renovation/blob/master/generator/package.json#L3) and commit it in the master. The package will be published automatically once tests passed.

### Using

#### Installing

    `npm install --save devextreme-generator`
    
#### Usage

##### With gulp

```javascript
// gulpfile.js
const { generateComponents } = require('devextreme-generator/component-compiler');
const generator = require('devextreme-generator/preact-generator').default;
// const generator = require('devextreme-generator/react-generator').default;
// const generator = require('devextreme-generator/angular-generator').default;

// Optional set defaultOptionsModule
generator.defaultOptionsModule = 'pathToYourModule or node_modules/devextreme-generator/component_declaration/default_options';

gulp.task('generate-components', function() {
    return gulp.src(SRC)
        .pipe(generateComponents(generator))
        .pipe(gulp.dest(DEST));
});

 ```
 
 ##### Generate component from file
 
 ```javascript
const { compileCode } = require('devextreme-generator/component-compiler');
const reactGenerator = require('devextreme-generator/react-generator').default;

const result = compileCode(generator, source, {
    path: path,
    dirname: dirname
});
 ```
