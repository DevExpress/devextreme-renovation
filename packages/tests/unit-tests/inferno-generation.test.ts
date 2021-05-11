import { resolveModule } from '@devextreme-generator/core';
import { compile } from '@devextreme-generator/build-helpers';
import generator from '@devextreme-generator/inferno';
import path from 'path';

import { createTestGenerator } from './helpers/common';
import mocha from './helpers/mocha';

mocha.describe("inferno-generation", function () {
  const testGenerator = createTestGenerator("inferno");
  this.beforeAll(function () {
    compile(
      `${__dirname}/test-cases/declarations/src`,
      `${__dirname}/test-cases/componentFactory`
    );
    this.testGenerator = function (componentName: string) {
      generator.setContext({
        dirname: path.resolve(__dirname, "./test-cases/declarations/src"),
        path: resolveModule(
          path.resolve(
            __dirname,
            `./test-cases/declarations/src/${componentName}`
          ),
          generator.cache
        )!,
      });
      testGenerator.call(this, componentName, generator);
    };
  });

  this.afterEach(function () {
    if (this.currentTest!.state !== "passed") {
      console.log(this.currentTest?.ctx?.code); // TODO: diff with expected
    }
    generator.setContext(null);
    if (this.currentTest?.ctx) {
      this.currentTest.ctx.code = null;
      this.currentTest.ctx.expectedCode = null;
    }
  });

  this.afterAll(() => {
    generator.resetCache();
  });

  mocha.it("class", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("state", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("state-short-operator", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("internal-state", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("component-input", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("effect", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("context", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("dx-inner-widget", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("dx-widget-with-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("spread-props-attribute", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("template", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("method", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("method-use-apiref", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("import-component", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("component-bindings-only", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("refs", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("nested", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("nested-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("export-default", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("portal", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("mutable-state", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("object-with-current", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("jsx-function-in-view", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("function-declaration", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.describe("Default option rules", function () {
    this.beforeEach(function () {
      generator.options = {
        defaultOptionsModule: path.resolve(__dirname, "../jquery-helpers/default_options"),
      };
      generator.setContext({
        dirname: path.resolve(__dirname, "./test-cases/declarations/src"),
      });
    });

    this.afterEach(function () {
      generator.setContext(null);
      generator.options = {};
    });

    mocha.it("default-options-empty", function () {
      this.testGenerator(this.test!.title);
    });
  });
});
