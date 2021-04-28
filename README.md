# Devextreme Generators

**This version are compatible with latest version of DevExtreme**

## Building

- `npm install`
- `npm run build` - build all generators and common modules (required for webpack, e2e tests and avoiding TS errors in generated tests)

## Development

All changes should be merged in `master` branch. After that, these changes should be cherry-picked to the desired version of generator (branch `releases/v*`).

## Testing

### Unit tests

- `npm run test` - run all test (unit and generated)
- `npm run test:with-replace` - run all test and replace failed generated tests

### e2e tests

- `npm run build` - e2e tests use webpack which require to compile sources
- `npm run test:testcafe` - run e2e tests
- `npm run testcafe:start-test-servers` - start testcafe server to check e2e tests run frameworks on next ports:

    - http://localhost:3000/ - Angular
    - http://localhost:3001/ - React
    - http://localhost:3002/ - Vue
    - http://localhost:3003/ - Preact
    - http://localhost:3004/ - Inferno

## Publishing

New version are published automatically by GitHub actions. For this, you need to create a special PR, prepared by script:

- Checkout to version, which you will update (`releases/v*`)
- Make sure that you have no `release` branch locally (could have stayed after previous release)
- Run publish script based on changes since last release:
    - `npm run publish:patch` - fixes, improvements and refactor
    - `npm run publish:minor` - new features, probably after that you need to create a PR in DevExtreme repo (to use these features)
    - `npm run publish:major` - Breaking Changes or next version to continue development while code freeze
- Make sure that all packages are updated. After that, changes will be committed to `release` branch and pushed
- Go to GitHub and create a PR to right branch (`releases/v*`). Check name of PR, it should be `v*.*.*`

After merge, GihHub action will check that version updated in right branch and publish new version.

## Using

### Installing

### Generators

These packages need to be installed for development

Generators:
- `npm install --save-dev @devextreme-generator/core`
- `npm install --save-dev @devextreme-generator/angular`
- `npm install --save-dev @devextreme-generator/inferno`
- `npm install --save-dev @devextreme-generator/react`
- `npm install --save-dev @devextreme-generator/vue`

Declarations

- `npm install --save-dev @devextreme-generator/declarations`

Build tools:

- `npm install --save-dev @devextreme-generator/build-helpers`


### Usage

#### With gulp

```js
// gulpfile.js
const { generateComponents } = require('@devextreme-generator/build-helpers');
const generator = require('@devextreme-generator/inferno').default;
// const generator = require('@devextreme-generator/react').default;
// const generator = require('@devextreme-generator/angular').default;

// Optional set options
generator.options = {
    defaultOptionsModule: 'pathToYourModule',
    jqueryComponentRegistratorModule: 'path',
    jqueryBaseComponentModule: 'component_wrapper/component',
};

gulp.task('generate-components', function() {
    return gulp.src(SRC)
        .pipe(generateComponents(generator))
        .pipe(gulp.dest(DEST));
});
```

#### Generate component from file

```javascript
const { compileCode } = require('@devextreme-generator/core');
const generator = require('@devextreme-generator/inferno').default;

const result = compileCode(generator, source, {
    path: path,
    dirname: dirname
});
 ```

#### With webpack

```javascript
// webpack.config.js

module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: '@devextreme-generator/build-helpers/dist/webpack-loader',
                        options: {
                            platform: 'inferno',
                            defaultOptionsModule: 'pathToYourModule',
                            jqueryComponentRegistratorModule: 'path',
                            jqueryBaseComponentModule: 'component_wrapper/component',
                            // ...
                            tsConfig: path.resolve('./inferno.tsconfig.json')
                        },
                    },
                ],
                exclude: ['/node_modules/'],
            },
            // ...
            ]
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts'],
    }
};

 ```
