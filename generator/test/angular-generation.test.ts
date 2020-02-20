import mocha from "mocha";
import generator from "../angular-generator";
import compile from "../component-compiler";
import path from "path";

import { printSourceCodeAst as getResult, createTestGenerator } from "./helpers/common";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

mocha.describe("angular-generation", function () {
    const testGenerator = createTestGenerator("angular");
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            testGenerator.call(this, componentName, generator);
        };
    });

    this.beforeEach(function () {
        generator.setContext({ path: path.resolve(__dirname, "./test-cases/declarations") });
    });

    this.afterEach(function () {
        generator.setContext(null);
        if (this.currentTest!.state !== "passed") {
            console.log(this.code); // TODO: diff with expected
        }
        this.code = null;
        this.expectedCode = null;
    });

    mocha.it("props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("empty-component", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("slots", function () {
        this.testGenerator(this.test!.title);
    });
});