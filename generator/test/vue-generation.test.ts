import mocha from "./helpers/mocha";
import generator from "../vue-generator";
import compile from "../component-compiler";
import path from "path";

import { createTestGenerator, assertCode } from "./helpers/common";

function getPartFromSourceFile(code: string, tagName: string){ 
    const tag = `<${tagName}>`;
    const startPosition = code.indexOf(tag) + tag.length;
    const endPosition = code.indexOf(`</${tagName}>`);
    if (startPosition === -1 || endPosition === -1) { 
        return "";
    }

    return code.slice(startPosition, endPosition);
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
        (code, expreactedCode) => {
            assertCode(getCodeFromSourceFile(code), getCodeFromSourceFile(expreactedCode));
            assertCode(getTemplateFromSourceFile(code), getTemplateFromSourceFile(expreactedCode));
        },
        (componentName) => `${componentName}.vue`
    );
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

    mocha.it("internal-state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("refs", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("slots", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("template", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("Add processStyle method", function () {
        this.testGenerator("dx-inner-widget");
    });

    mocha.it("required-props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jsx-function-in-view", function () {
        this.testGenerator(this.test!.title);
    });

});
