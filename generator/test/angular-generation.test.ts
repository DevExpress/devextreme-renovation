import mocha from "./helpers/mocha";
import generator from "../angular-generator";
import compile from "../component-compiler";
import path from "path";

import { createTestGenerator } from "./helpers/common";

mocha.describe("angular-generation", function () {
    const testGenerator = createTestGenerator("angular");
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            testGenerator.call(this, componentName, generator);
        };
    });

    this.beforeEach(function () {
        generator.setContext({ dirname: path.resolve(__dirname, "./test-cases/declarations") });
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

    mocha.it("props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("internal-state", function () { 
        this.testGenerator(this.test!.title);
    })

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

    mocha.it("spread-attribute", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("spread-attribute-without-ref", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("spread-attribute-with-custom-component", function () {
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

    mocha.it("method-without-decorator", function () {
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

    mocha.describe("Default option rules", function () {
        this.beforeEach(function () {
            generator.defaultOptionsModule = "../component_declaration/default_options";
            generator.setContext({
                dirname: path.resolve(__dirname, "./test-cases/expected/react"),
                defaultOptionsModule: path.resolve(generator.defaultOptionsModule)
            });
        });

        this.afterEach(function () { 
            generator.setContext(null);
            generator.defaultOptionsModule = "";
        });

        mocha.it("default-options-empty", function () { 
            this.testGenerator(this.test!.title);
        });
    });
});