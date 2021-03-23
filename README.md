# Devextreme Generators

## Building

- `npm install`
- `npm run build` - build all generators and common modules (required for tests)
- `npm run build:watch` - build generators and modules in watch mode (required for tests)

## Publishing

## Using

### Installing

### Usage

#### With gulp

#### Generate component from file

```javascript
const { compileCode } = require('@devextreme-generator/core');
const reactGenerator = require('@devextreme-generator/react').default;

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
                            defaultOptionsModule: 'path',
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
