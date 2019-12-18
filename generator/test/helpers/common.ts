import ts from "typescript";
import assert from "assert";
import fs from "fs";
import path from "path";

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

export function printSourceCodeAst(source: string) { 
    return print(ts.createSourceFile("result", source, ts.ScriptTarget.ES2015, true)).join("\n");
}

export function createTestGenerator(expectedFolder: string){ 
    return function testGenerator(this: any, componentName: string, generator: any) {
        const factory = require(path.resolve(`${__dirname}/../test-cases/componentFactory/${componentName}`));
        const code = this.code = factory(generator).join("\n");
        this.expectedCode = fs.readFileSync(path.resolve(`${__dirname}/../test-cases/expected/${expectedFolder}/${componentName}.tsx`)).toString();
        assert.equal(printSourceCodeAst(code), printSourceCodeAst(this.expectedCode));
    }
}