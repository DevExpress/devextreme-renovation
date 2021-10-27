: npm  run bootstrap:ci
cd packages
del /S *.tgz
cd ..
npm run pack
cd ../DevExtreme
npm i ../devextreme-renovation/packages/declarations/package.tgz ../devextreme-renovation/packages/core-generator/package.tgz ../devextreme-renovation/packages/angular-generator/package.tgz ../devextreme-renovation/packages/vue-generator/package.tgz ../devextreme-renovation/packages/react-generator/package.tgz ../devextreme-renovation/packages/preact-generator/package.tgz ../devextreme-renovation/packages/inferno-generator/package.tgz ../devextreme-renovation/packages/build-helpers/package.tgz