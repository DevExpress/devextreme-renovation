import path from 'path';

import compile from '../packages/core/src/component-compiler';
import generator from '../packages/inferno';
import { createTestGenerator, getModulePath } from './helpers/common';
import mocha from './helpers/mocha';

mocha.describe("inferno-generator: jQuery generation", function () {
  const testGenerator = createTestGenerator("inferno-jquery");
  this.beforeAll(function () {
    compile(
      `${__dirname}/test-cases/declarations/src`,
      `${__dirname}/test-cases/componentFactory`
    );

    this.testGenerator = function (componentName: string) {
      generator.setContext({
        dirname: path.resolve(__dirname, "./test-cases/declarations/src"),
        path: getModulePath(`${componentName}.tsx`),
      });
      testGenerator.call(this, componentName, generator, 1);
    };
  });

  this.beforeEach(function () {
    generator.options = {
      jqueryComponentRegistratorModule: getModulePath(
        "component_declaration/jquery_component_registrator"
      ),
      jqueryBaseComponentModule: getModulePath(
        "component_declaration/jquery_base_component"
      ),
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
});
