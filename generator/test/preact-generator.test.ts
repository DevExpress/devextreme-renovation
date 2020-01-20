import mocha from "mocha";
import generator from "../preact-generator";
import compile from "../component-compiler";
import path from "path";
import assert from "assert";

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

    mocha.it("props-in-listener", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("slots", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("extend-props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.describe("react-generator: expressions", function () {
        mocha.it("Rename import if it is component declaration", function () {
            generator.setContext({ path: path.resolve(__dirname) });
            
            assert.equal(generator.createImportDeclaration(
                undefined,
                undefined,
                undefined,
                generator.createStringLiteral("./test-cases/declarations/empty-component")
            ), 'import "./test-cases/declarations/empty-component.p"');
        });

        mocha.it("Do not rename module without declaration", function () {
            generator.setContext({ path: path.resolve(__dirname) });
            
            assert.equal(generator.createImportDeclaration(
                undefined,
                undefined,
                undefined,
                generator.createStringLiteral("typescript")
            ), 'import "typescript"');
        });
    });
    
});
