import assert from 'assert';

import { Decorators } from '@devextreme-generator/core';
import generator from '@devextreme-generator/inferno';
import factory from './helpers/create-component';
import mocha from './helpers/mocha';

const { createDecorator } = factory(generator);

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
    this.beforeEach(function () {
      generator.setContext({
        path: __filename,
        dirname: __dirname,
      });
    });

    this.afterEach(function () {
      generator.setContext(null);
    });
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
          generator.createStringLiteral("@devextreme-generator/declarations")
        );

        assert.strictEqual(
          expression.toString(),
          `import {Fragment} from "inferno"`
        );
      }
    );

    mocha.it(
      "import RefObject from common_declaration if Ref is imported",
      function () {
        const expression = generator.createImportDeclaration(
          [],
          [],
          generator.createImportClause(
            undefined,
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("Ref")
              ),
            ])
          ),
          generator.createStringLiteral("@devextreme-generator/declarations")
        );

        assert.strictEqual(
          expression.toString(),
          `import {RefObject} from "@devextreme/vdom"`
        );
      }
    );

    mocha.it(
      "import RefObject from common_declaration if ForwardRef is imported",
      function () {
        const expression = generator.createImportDeclaration(
          [],
          [],
          generator.createImportClause(
            undefined,
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("ForwardRef")
              ),
            ])
          ),
          generator.createStringLiteral("@devextreme-generator/declarations")
        );

        assert.strictEqual(
          expression.toString(),
          `import {RefObject} from "@devextreme/vdom"`
        );
      }
    );

    mocha.it(
      "import Component from common_declaration should import it from default modules path",
      function () {
        const expression = generator.createImportDeclaration(
          [],
          [],
          generator.createImportClause(
            undefined,
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("Component")
              ),
            ])
          ),
          generator.createStringLiteral("@devextreme-generator/declarations")
        );

        assert.strictEqual(
          expression.toString(),
          `import {BaseInfernoComponent,InfernoComponent} from "@devextreme/vdom"`
        );
      }
    );
  });

  mocha.describe("class-members/property", function () {
    mocha.describe("getDependency", function () {
      mocha.it("@Ref() p?:string", function () {
        const expression = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("p"),
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string")
        );

        assert.deepStrictEqual(expression.getDependency(), ["p.current"]);
      });

      mocha.it("@RefProp() p?:string", function () {
        const expression = generator.createProperty(
          [createDecorator(Decorators.RefProp)],
          [],
          generator.createIdentifier("p"),
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string")
        );

        expression.scope = "props";

        assert.deepStrictEqual(expression.getDependency(), [
          "props.p?.current",
        ]);
      });

      mocha.it("@Ref() p:string", function () {
        const expression = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("p"),
          undefined,
          generator.createKeywordTypeNode("string")
        );

        assert.deepStrictEqual(expression.getDependency(), []);
      });

      mocha.it("with unknown decorator should throw exception", function () {
        const expression = generator.createProperty(
          [createDecorator("SomeName")],
          [],
          generator.createIdentifier("p"),
          undefined,
          generator.createKeywordTypeNode("string")
        );

        let error = null;
        try {
          expression.getDependency();
        } catch (e) {
          error = e;
        }
        assert.strictEqual(error, "Can't parse property: p");
      });
    });
  });

  mocha.describe("TypeReferenceNode", function () {
    mocha.it("JSXTemplate", function () {
      const expression = generator.createTypeReferenceNode(
        generator.createIdentifier("JSXTemplate")
      );

      assert.strictEqual(expression.toString(), "any");
    });
  });
});
