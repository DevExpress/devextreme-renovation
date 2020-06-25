import mocha from "./helpers/mocha";
import generator from "../vue-generator";
import compile from "../component-compiler";
import path from "path";

import { createTestGenerator, assertCode, getModulePath } from "./helpers/common";

function getPartFromSourceFile(code: string, tagName: string){ 
    const tag = `<${tagName}>`;
    const startPosition = code.indexOf(tag);
    const endPosition = code.lastIndexOf(`</${tagName}>`);

    if (startPosition === -1 && endPosition === -1 && tagName==="script") { 
        return code;
    }

    if (startPosition === -1 || endPosition === -1) { 
        return "";
    }

    return code.slice(startPosition + tag.length, endPosition);
}

function getCodeFromSourceFile(code: string) { 
    return getPartFromSourceFile(code, "script");
}

function getTemplateFromSourceFile(code: string) { 
    const template = getPartFromSourceFile(code, "template");
    return String.raw`\`${template}\``;
}

mocha.describe("vue-generation", function () {
    const testGenerator = createTestGenerator(
        "vue",
        (code, expectedCode) => {
            assertCode(getCodeFromSourceFile(code), getCodeFromSourceFile(expectedCode));
            assertCode(getTemplateFromSourceFile(code), getTemplateFromSourceFile(expectedCode));
        },
        (componentName) => `${componentName}.vue`
    );
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations/src`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            testGenerator.call(this, componentName, generator);
        };
    });

    this.beforeEach(function () {
        generator.setContext({ dirname: path.resolve(__dirname, "./test-cases/declarations/src") });
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

    mocha.it("internal-state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("state-short-operator", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("refs", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("refs-as-props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("slots", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("template", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("import-component", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("dx-inner-widget", function () {
        this.testGenerator("dx-inner-widget");
    });

    mocha.it("component-bindings-only", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jsx-function-in-view", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("spread-attribute", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("effect", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("spread-attribute-with-custom-component", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("spread-props-attribute", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("model-value-disabled", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("model", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("method", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("list", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("implements", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("two-way-props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("forward-ref-parent", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("forward-ref-child", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("forward-ref-template", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.describe("Default option rules", function () {
        this.beforeEach(function () {
            generator.defaultOptionsModule = getModulePath("component_declaration/default_options");
            generator.setContext({
                dirname: path.resolve(__dirname, "./test-cases/declarations/src"),
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

        mocha.it("required-props", function () {
            this.testGenerator(this.test!.title);
        });

        mocha.it("use-external-component-bindings", function () {
            this.testGenerator(this.test!.title);
        });

        mocha.it("default-options-with-state", function () {
            this.testGenerator(this.test!.title);
        });
    });

    mocha.it("template-pass", function () {
        this.testGenerator(this.test!.title);
    });
});
