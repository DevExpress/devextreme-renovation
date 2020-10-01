import assert from "assert";
import mocha from "./helpers/mocha";
import generator from "../angular-generator";
import compile from "../component-compiler";
import path from "path";

import { createTestGenerator, getModulePath } from "./helpers/common";
import { resolveModule } from "../base-generator/utils/path-utils";

mocha.describe("angular-generation", function () {
  const testGenerator = createTestGenerator("angular");
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

  mocha.it("pick-props", function () {
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

  mocha.it("empty-component", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("component-input", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("slots", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("effect", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("context", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("spread-attribute", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("spread-attribute-without-ref", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("spread-attribute-with-custom-component", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("dx-inner-widget", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("dx-widget-with-template", function () {
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

  mocha.it("template-transit", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("template-pass", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("Throw error if ref is passed to template", function () {
    try {
      this.testGenerator("template-with-ref");
    } catch (e) {
      assert.strictEqual(
        e,
        "Templates do not support refs. See 'headerTemplate' prop usage in view function"
      );
    }
  });

  mocha.it("method", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("method-use-apiref", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("method-without-decorator", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("model-value-disabled", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("model", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("list", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("globals-in-template", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("import-component", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("import-component-named", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("component-bindings-only", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("component-pass", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("jsx-function-in-view", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("refs", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("dx-widget-with-ref-prop", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("refs-as-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("implements", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("two-way-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("getter-with-complex-type", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("nested", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("nested-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("forward-ref-template", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("forward-ref-parent", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("forward-ref-child", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("export-default", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("export-named", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("export-named-api-ref", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("effects-with-iterable", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("portal", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("functions", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("external-functions", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("iterables-repeat", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("import-type", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("private", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("view-without-tag", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("view-without-tag-arrow", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("spread-in-view", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("template-default-value", function () {
    this.testGenerator(this.test!.title);
  });
  
  mocha.it("dynamic-component", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.describe("Default option rules", function () {
    this.beforeEach(function () {
      generator.options = {
        defaultOptionsModule: getModulePath(
          "component_declaration/default_options"
        ),
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

    mocha.it("required-props", function () {
      this.testGenerator(this.test!.title);
    });

    mocha.it("use-external-component-bindings", function () {
      this.testGenerator(this.test!.title);
    });
  });
});
