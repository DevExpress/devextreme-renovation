import mocha from "./helpers/mocha";
import generator from "../inferno-generator";
import assert from "assert";
import path from "path";
import { InfernoGenerator } from "../inferno-generator/inferno-generator";

import factory from "./helpers/create-component";
import { Decorators } from "../component_declaration/decorators";

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
          generator.createStringLiteral("component_declaration/common")
        );

        assert.strictEqual(
          expression.toString(),
          `import {Fragment} from "inferno"`
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
          generator.createStringLiteral("component_declaration/common")
        );

        assert.strictEqual(
          expression.toString(),
          `import {InfernoComponent} from "../modules/inferno/base_component"`
        );
      }
    );

    mocha.it(
      "import Component from common_declaration should import it from node_modules if modulesPath is set",
      function () {
        const generator = new InfernoGenerator();
        generator.options = { modulesPath: "devextreme-generator/modules" };
        generator.setContext({
          path: __filename,
          dirname: __dirname,
        });

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
          generator.createStringLiteral("component_declaration/common")
        );

        assert.strictEqual(
          expression.toString(),
          `import {InfernoComponent} from "devextreme-generator/modules/base_component"`
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
});

mocha.describe("Inferno-generator", function () {
  mocha.describe("getModulesPath", function () {
    mocha.it("default value", function () {
      assert.strictEqual(
        generator.getModulesPath(),
        path.resolve(__dirname, "../modules/inferno")
      );
    });

    mocha.it("with modulesPath in options", function () {
      const generator = new InfernoGenerator();
      const value = "devextreme-generator/modules/inferno";
      generator.options.modulesPath = value;
      assert.strictEqual(generator.getModulesPath(), value);
    });
  });
});
