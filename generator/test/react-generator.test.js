const assert = require("assert");
const generator = require("../react-generator");
const fs = require("fs");
const ts = require("typescript");

function print(node, out, indent=0) {
    if (!out) { 
        return print(node, []);
    }
    out.push(new Array(indent + 1).join(' ') + ts.SyntaxKind[node.kind]);
    indent++;
    ts.forEachChild(node, (node) => { 
        print(node, out, indent);
    });
    indent--;
    return out;
}

function getResult(source) { 
    return print(ts.createSourceFile("result", source, ts.ScriptTarget.ES2015, true)).join("\n");
}


function testGenerator(componentName, generator) {
    const factory = require(`./componentFactory/${componentName}`);
    const code = this.code = factory(generator).join("\n");
    this.expectedCode =  fs.readFileSync(`${__dirname}/expected/react/${componentName}.js`).toString();
    assert.equal(getResult(code), getResult(this.expectedCode));
}

describe("react-generator", function() {
    this.beforeAll(function() {
        this.testGenerator = function(componentName) { 
            testGenerator.call(this, componentName, generator);
        };
    });

    this.afterEach(function() { 
        if (this.currentTest.state !== "passed") { 
            console.log(this.code); // TODO: diff with expected
        }
        this.code = null;
        this.expectedCode = null;
    });

    it("empty-component", function() {
        this.testGenerator("empty-component");  
    });

    it("internal-state", function() {
        this.testGenerator("internal-state");  
    });

    it("state", function() { 
        this.testGenerator("state");
    });

    it("listen", function() { 
        this.testGenerator("listen");
    });

    it("simple block", function() {
        this.testGenerator("simple-block");
    });

    it("listen-with-target", function() {
        this.testGenerator("listen-with-target");
    });

    it("functions", function() {
        this.testGenerator("functions");
    });
});