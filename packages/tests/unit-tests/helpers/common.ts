import ts from "typescript";
import assert from "assert";
import fs from "fs";
import path from "path";
import Generator from "@devextreme-generator/core";

export function removeSpaces(value: string) {
  return value.replace(/(\s|\s)/gi, "");
}

function printNodeValue(node: ts.Node): string {
  if ((node as ts.Identifier).escapedText) {
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
  out.push(
    new Array(indent + 1).join(" ") +
      ts.SyntaxKind[node.kind] +
      "---" +
      printNodeValue(node)
  );
  indent++;
  ts.forEachChild(node, (node) => {
    print(node, out, indent);
  });
  indent--;
  return out;
}

export const assertCode = (code: string, expectedCode: string) => {
  assert.equal(printSourceCodeAst(code), printSourceCodeAst(expectedCode));
};

export function printSourceCodeAst(source: string) {
  return print(
    ts.createSourceFile(
      "result.tsx",
      source.replace(/};/gm, "}"),
      ts.ScriptTarget.ES2016,
      true
    )
  ).join("\n");
}

export function createTestGenerator(
  expectedFolder: string,
  checkCode = assertCode,
  expectedCodePath = (componentName: string) => `${componentName}.tsx`
) {
  return function testGenerator(
    this: any,
    componentName: string,
    generator: Generator,
    componentIndex: number = 0
  ) {
    const factory = require(path.resolve(
      `${__dirname}/../test-cases/componentFactory/${generator.getPlatform()}/${componentName}`
    ));
    const code = (this.code = generator.generate(factory)[componentIndex].code);
    const expectedPath = path.resolve(
      `${__dirname}/../test-cases/expected/${expectedFolder}/${expectedCodePath(
        componentName
      )}`
    );

    try {
      this.expectedCode = fs.readFileSync(expectedPath).toString();
      checkCode(code, this.expectedCode);
    } catch (e) {
      if (process.argv.includes("--replace")) {
        const realExpectedPath = path.resolve(
          `${__dirname}/../test-cases/expected/${expectedFolder}/${expectedCodePath(
            componentName
          )}`
        );
        if (
          expectedFolder === "vue" &&
          code.indexOf("<template>") === -1 &&
          code.indexOf("<script>") === -1
        ) {
          fs.writeFileSync(realExpectedPath, `<script>\n${code}</script>\n`);
        } else {
          fs.writeFileSync(realExpectedPath, code);
        }
      }
      throw e;
    }
  };
}
