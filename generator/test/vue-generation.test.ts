import mocha from "./helpers/mocha";
import generator from "../vue-generator";
import compile from "../component-compiler";
import path from "path";

import { createTestGenerator, assertCode } from "./helpers/common";

function getCodeFromSourceFile(code: string) { 
    const scriptTag = "<script>";
    const startPosition = code.indexOf(scriptTag) + scriptTag.length;
    const endPosition = code.indexOf("</script>");

    return code.slice(startPosition, endPosition);
}

mocha.describe("vue-generation", function () {
    const testGenerator = createTestGenerator(
        "vue",
        (code, expreactedCode) => 
            assertCode(getCodeFromSourceFile(code), getCodeFromSourceFile(expreactedCode)),
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

});
