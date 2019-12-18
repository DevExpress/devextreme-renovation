import mocha from "mocha";
import generator from "../preact-generator";
import compile from "../component-compiler";

import { createTestGenerator } from "./helpers/common";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

mocha.describe("preact-generator", function () {
    const testGenerator = createTestGenerator("preact");
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            testGenerator.call(this, componentName, generator);
        };
    });

    this.afterEach(function () {
        if (this.currentTest!.state !== "passed") {
            console.log(this.code); // TODO: diff with expected
        }
        this.code = null;
        this.expectedCode = null;
    });

    mocha.it("props-in-listener", function () {
        this.testGenerator(this.test!.title);
    });
});
