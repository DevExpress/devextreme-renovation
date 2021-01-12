import mocha from "./helpers/mocha";
import generator from "../inferno-generator";
import compile from "../component-compiler";
import path from "path";

import { createTestGenerator, getModulePath } from "./helpers/common";

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

  // mocha.it("jquery-events", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-without-modules", function () {
  //   generator.options = {};
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-register-false", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-api", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-template", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-props-info", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-custom-base", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-custom-named-base", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-custom-base-with-module-import", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-export-named", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-element-type", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it("jquery-api-wrapper", function () {
  //   this.testGenerator(this.test!.title);
  // });

  // mocha.it(
  //   "should throw an error with TwoWay props without initializer",
  //   function () {
  //     let error;
  //     try {
  //       this.testGenerator("jquery-props-without-initializer");
  //     } catch (e) {
  //       error = e;
  //     }

  //     assert.strictEqual(
  //       error,
  //       "You should specify default value other than 'undefined' for the following TwoWay props: state2, state4"
  //     );
  //   }
  // );
});
