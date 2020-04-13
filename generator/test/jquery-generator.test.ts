import mocha from "mocha";
import generator, { JQueryComponent } from "../jquery-generator";
import compile from "../component-compiler";
import path from "path";

import { printSourceCodeAst as getResult, createTestGenerator } from "./helpers/common";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

mocha.describe("jquery-generator", function () {
    const testGenerator = createTestGenerator("jquery");
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            generator.jqueryComponentRegistratorModule = "../component_declaration/jquery_component_registrator";
            generator.jqueryBaseComponentModule = "../component_declaration/jquery_base_component";
            generator.setContext({ 
                dirname: path.resolve(__dirname, "./test-cases/declarations"), 
                path: `${componentName}.tsx`,
                jqueryComponentRegistratorModule: path.resolve(generator.jqueryComponentRegistratorModule),
                jqueryBaseComponentModule: path.resolve(generator.jqueryBaseComponentModule)
            });
            testGenerator.call(this, componentName, generator);
        };
    });

    this.afterEach(function () {
        generator.setContext(null);
        generator.jqueryComponentRegistratorModule = "";
        generator.jqueryBaseComponentModule = "";

        if (this.currentTest!.state !== "passed") {
            console.log(this.code);
        }
        
        this.code = null;
        this.expectedCode = null;
    });

    mocha.it("component-input", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("empty-component", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("method", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("template", function () {
        this.testGenerator(this.test!.title);
    });
});
