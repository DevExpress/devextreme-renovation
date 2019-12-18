import ts from "typescript";

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