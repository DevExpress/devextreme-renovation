import mocha from "./helpers/mocha";
import generator from "../inferno-generator";
import assert from "assert";

mocha.describe("Expressions", function () {
  mocha.describe("jsx", function () {
    mocha.describe("JsxOpeningElement", function () {
      mocha.it("Fragment", function () {
        const expression = generator.createJsxOpeningElement(
          generator.createIdentifier("Fragment"),
          [],
          []
        );

        assert.strictEqual(expression.toString(), "<Fragment >");
      });
    });

    mocha.describe("JsxClosingElement", function () {
      mocha.it("Fragment", function () {
        const expression = generator.createJsxClosingElement(
          generator.createIdentifier("Fragment")
        );

        assert.strictEqual(expression.toString(), "</Fragment>");
      });
    });
  });

  mocha.describe("ImportDeclaration", function () {
    mocha.it(
      "import Fragment from common_declaration should import it from inferno",
      function () {
        const expression = generator.createImportDeclaration(
          [],
          [],
          generator.createImportClause(
            undefined,
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("Fragment")
              ),
            ])
          ),
          generator.createStringLiteral("component_declaration/common")
        );

        assert.strictEqual(
          expression.toString(),
          `import {Fragment} from "inferno"`
        );
      }
    );
  });
});
