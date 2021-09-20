import { compile } from '@devextreme-generator/build-helpers';
import generator from '@devextreme-generator/inferno';
import path from 'path';

import { createTestGenerator } from './helpers/common';
import mocha from './helpers/mocha';

mocha.describe("inferno-generator: jQuery generation", function () {
  const testGenerator = createTestGenerator("inferno-jquery");
  this.beforeAll(function () {
    compile(
      `${__dirname}/test-cases/declarations/src`,
      `${__dirname}/test-cases/componentFactory/inferno`,
      'inferno'
    );

    this.testGenerator = function (componentName: string) {
      generator.setContext({
        dirname: path.resolve(__dirname, "./test-cases/declarations/src"),
        path: `${componentName}.tsx`,
      });
      testGenerator.call(this, componentName, generator, 1);
    };
  });

  this.beforeEach(function () {
    generator.options = {
      jqueryComponentRegistratorModule: path.resolve(__dirname, "../jquery-helpers/jquery_component_registrator"),
      jqueryBaseComponentModule: path.resolve(__dirname, "../jquery-helpers/jquery_base_component"),
      defaultOptionsModule: path.resolve(__dirname, "../jquery-helpers/default_options")
    };
  });

  this.afterEach(function () {
    generator.setContext(null);
    generator.options = {};
    if (this.currentTest!.state !== "passed") {
      console.log(this.code); // TODO: diff with expected
    }
    this.code = null;
    this.expectedCode = null;
  });

  this.afterAll(() => {
    generator.resetCache();
  });

  mocha.it("jquery-empty", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("jquery-with-default-options", function () {
    this.testGenerator(this.test!.title);
  });
});
