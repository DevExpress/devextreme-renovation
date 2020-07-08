import assert from "assert";
import mocha from "./helpers/mocha";
import path from "path";
import sinon from "sinon";
import * as ComponentCompiler from "../component-compiler";
import fs from "fs";

import compiler from "./helpers/webpack-test-compiler";
import { PreactGenerator } from "../preact-generator";
import { ReactGenerator } from "../react-generator";
import { AngularGenerator } from "../angular-generator/angular-generator";
import { VueGenerator } from "../vue-generator/vue-generator";
import { assertCode } from "./helpers/common";

const fixtureFileName = "test/test-cases/declarations/src/props.tsx";

mocha.describe("webpack-loader", function () {
  this.beforeEach(function () {
    this.codeCompilerStub = sinon
      .stub(ComponentCompiler, "compileCode")
      .returns("const a = 10");
  });

  this.afterEach(function () {
    this.codeCompilerStub.restore();
  });

  mocha.describe("platforms", function () {
    mocha.it("unknown platform - throw exception", async function () {
      let error: Error | null = null;
      try {
        await compiler(fixtureFileName, { platform: "unknown" });
      } catch (e) {
        error = e;
      }

      assert.ok(error!.message!.indexOf("Invalid platform") > -1);
    });

    mocha.it("preact", async function () {
      const stats = await compiler(fixtureFileName, {
        platform: "preact",
        defaultOptionsModule: "options",
        jqueryBaseComponentModule: "jqueryBase",
        jqueryComponentRegistratorModule: "registrator",
      });

      const output = stats.toJson().modules![0].source;

      assert.strictEqual(this.codeCompilerStub.callCount, 1);
      const args = this.codeCompilerStub.lastCall.args;
      const generator = args[0] as PreactGenerator;
      assert.ok(generator instanceof PreactGenerator);
      assert.strictEqual(
        args[1],
        fs.readFileSync(path.resolve(fixtureFileName)).toString()
      );
      assert.deepEqual(args[2], {
        path: path.resolve(fixtureFileName),
        dirname: path.resolve("test/test-cases/declarations/src"),
      });
      assert.strictEqual(args[3], false);
      assert.strictEqual(output, this.codeCompilerStub());

      assert.deepEqual(generator.options, {
        defaultOptionsModule: "options",
        jqueryBaseComponentModule: "jqueryBase",
        jqueryComponentRegistratorModule: "registrator",
      });
    });

    mocha.it("react", async function () {
      await compiler(fixtureFileName, {
        platform: "react",
        defaultOptionsModule: "options",
        jqueryBaseComponentModule: "jqueryBase",
        jqueryComponentRegistratorModule: "registrator",
      });

      const args = this.codeCompilerStub.lastCall.args;

      const generator = args[0] as ReactGenerator;
      assert.ok(args[0] instanceof ReactGenerator);

      assert.deepEqual(generator.options, {
        defaultOptionsModule: "options",
      });
    });

    mocha.it("angular", async function () {
      await compiler(fixtureFileName, {
        platform: "angular",
      });

      const args = this.codeCompilerStub.lastCall.args;
      assert.ok(args[0] instanceof AngularGenerator);
    });

    mocha.it("vue", async function () {
      await compiler(fixtureFileName, {
        platform: "vue",
      });

      const args = this.codeCompilerStub.lastCall.args;
      assert.ok(args[0] instanceof VueGenerator);
    });
  });

  mocha.describe("with ts-compilation", function () {
    mocha.it("can set tsconfig", async function () {
      this.codeCompilerStub.returns("const a: number = 10");
      const stats = await compiler(fixtureFileName, {
        platform: "preact",
        tsConfig: "test/test-cases/tsconfig.json",
      });

      const output = stats.toJson().modules![0].source!;

      assertCode(output, '"use strict";\nconst a = 10;\n');
    });

    mocha.it("ignore ts errors", async function () {
      this.codeCompilerStub.returns("const a: string = null");
      const stats = await compiler(fixtureFileName, {
        platform: "preact",
        tsConfig: "test/test-cases/tsconfig.json",
      });

      const output = stats.toJson().modules![0].source!;

      assertCode(output, '"use strict";\nconst a = null;\n');
    });

    mocha.it("tsconfig error - use default", async function () {
      const stats = await compiler(fixtureFileName, {
        platform: "preact",
        tsConfig: "incorrect.tsconfig.json",
      });

      const output = stats.toJson().modules![0].source!;

      assertCode(output, "var a = 10;\n");
    });

    mocha.it(
      "tsconfig with extend - merge compiler options",
      async function () {
        const stats = await compiler(fixtureFileName, {
          platform: "preact",
          tsConfig: "test/test-cases/webpack-loader.test.tsconfig.json",
        });

        const output = stats.toJson().modules![0].source!;

        assertCode(output, "const a = 10;\n");
      }
    );
  });
});
