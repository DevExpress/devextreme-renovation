import ts from "typescript";
import assert from "assert";
import fs from "fs";
import path from "path";
import { Generator } from "../../react-generator";

export function removeSpaces(value: string) { 
    return value.replace(/(\s|\s)/gi, "");
}

function printNodeValue(node: ts.Node):string { 
    if ((node as ts.Identifier).escapedText){ 
        return (node as ts.Identifier).escapedText.toString();
    }

    if (ts.isTemplateLiteral(node)) { 
        return removeSpaces((node as any).rawText || "");
    }

    if (ts.isStringLiteral(node)) { 
        return node.text;
    }

    if (ts.isJsxText(node)) { 
        return removeSpaces(node.text);
    }

    return "";
}

function print(node: ts.Node, out?: string[], indent = 0): string[] {
    if (!out) {
        return print(node, []);
    }
    out.push(new Array(indent + 1).join(' ')
        + ts.SyntaxKind[node.kind] + "---"
        + printNodeValue(node));
    indent++;
    ts.forEachChild(node, (node) => {
        print(node, out, indent);
    });
    indent--;
    return out;
}

export function printSourceCodeAst(source: string) { 
    return print(ts.createSourceFile("result.tsx", source, ts.ScriptTarget.ES2016, true)).join("\n");
}

export function createTestGenerator(expectedFolder: string){ 
    return function testGenerator(this: any, componentName: string, generator: Generator) {
        const factory = require(path.resolve(`${__dirname}/../test-cases/componentFactory/${componentName}`));
        const code = this.code = factory(generator).join("\n");
        this.expectedCode = fs.readFileSync(path.resolve(`${__dirname}/../test-cases/expected/${expectedFolder}/${componentName}.tsx`)).toString();
        assert.equal(printSourceCodeAst(code), printSourceCodeAst(this.expectedCode));
    }
}