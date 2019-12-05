import assert from "assert";
import mocha from "mocha";
import ts from "typescript";
import fs from "fs";
import generator from "../react-generator";

import compile from "../component-compiler";

function print(node: ts.Node, out?: string[], indent = 0): string[] {
    if (!out) {
        return print(node, []);
    }
    out.push(new Array(indent + 1).join(' ')
        + ts.SyntaxKind[node.kind] + "---"
        + ((node as ts.Identifier).escapedText ? (node as ts.Identifier).escapedText : ""));
    indent++;
    ts.forEachChild(node, (node) => {
        print(node, out, indent);
    });
    indent--;
    return out;
}

function getResult(source:string) { 
    return print(ts.createSourceFile("result", source, ts.ScriptTarget.ES2015, true)).join("\n");
}

function testGenerator(this: any, componentName:string, generator:any) {
    const factory = require(`${__dirname}/test-cases/componentFactory/${componentName}`);
    const code = this.code = factory(generator).join("\n");
    this.expectedCode =  fs.readFileSync(`${__dirname}/test-cases/expected/react/${componentName}.tsx`).toString();
    assert.equal(getResult(code), getResult(this.expectedCode));
}


mocha.describe("react-generator", function () { 
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function(componentName:string) { 
            testGenerator.call(this, componentName, generator);
        };
    });

    this.afterEach(function() { 
        if (this.currentTest!.state !== "passed") { 
            console.log(this.code); // TODO: diff with expected
        }
        this.code = null;
        this.expectedCode = null;
    });

    mocha.it("variable-declaration", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("functions", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("objects", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("conditions", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("imports", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("empty-component", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("simple-block", function() {
        this.testGenerator(this.test!.title);  
    });

    mocha.it("props", function() {
        this.testGenerator(this.test!.title);  
    });

    mocha.it("internal-state", function () {
        this.testGenerator(this.test!.title);
    });
   
    mocha.it("state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("listen", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("listen-with-target", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("props-in-listener", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jsx-events", function () {
        this.testGenerator(this.test!.title);
    });
    
});