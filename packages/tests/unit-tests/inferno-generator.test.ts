import assert from 'assert';

import { Block, Decorator, Decorators, TypeExpression } from '@devextreme-generator/core';
import generator from '@devextreme-generator/inferno';
import factory from './helpers/create-component';
import mocha from './helpers/mocha';
import {
  removeSpaces,
} from "./helpers/common";
import { InfernoComponent } from 'inferno-generator/src/expressions/inferno-component';

const { createComponent, createDecorator } = factory(generator);

mocha.describe('Inferno tests', function () {
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
      "import Fragment from @devextreme-generator/declarations should import it from @devextreme/runtime/inferno",
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
      "import RefObject from @devextreme/runtime/inferno if Ref is imported",
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
          `import {RefObject} from "@devextreme/runtime/inferno"`
        );
      }
    );

    mocha.it(
      "import RefObject from @devextreme/runtime/inferno if ForwardRef is imported",
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
          `import {RefObject} from "@devextreme/runtime/inferno"`
        );
      }
    );

    mocha.it(
      "import Component from @devextreme-generator/declarations should import it from @devextreme/runtime/inferno",
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
          `import {BaseInfernoComponent,InfernoComponent,InfernoWrapperComponent,normalizeStyles} from "@devextreme/runtime/inferno"`
        );
      }
    );
  });
  mocha.describe("GetAccessor", function () {
    function createGetAccessor(
      type?: TypeExpression,
      block?: Block,
      name?: string,
      decorators?: Decorator[] | undefined
    ) {
      return generator.createGetAccessor(
        decorators,
        [],
        generator.createIdentifier(name || "name"),
        [],
        type,
        block ||
          generator.createBlock(
            [generator.createReturn(generator.createIdentifier("result"))],
            true
          )
      );
    }
    mocha.describe("memorize getAccessor with complex type", function () {
      mocha.it("Do not memorize union with simple type", function () {
        const simpleGetAccessor = createGetAccessor(
          generator.createUnionTypeNode([
          generator.createLiteralTypeNode(
            generator.createStringLiteral("1")
          ),
          generator.createLiteralTypeNode(
            generator.createStringLiteral("2")
          ),
        ]));
        assert.strictEqual(
          removeSpaces(simpleGetAccessor.toString()),
          removeSpaces(`get name():"1"|"2"{
            return result;
          }`),
        );
      });
      
      mocha.it("Memorize object literal type", function () {
        const getter = createGetAccessor(
          generator.createLiteralTypeNode(
            generator.createObjectLiteral([], false)
          )
        );

        assert.strictEqual(getter.isMemorized({members: [], isComponent: true}), true);
        assert.strictEqual(
          removeSpaces(getter.toString({members: [], isComponent:true})),
          removeSpaces(`get name():{}{
                          if(this.__getterCache["name"]!==undefined){
                              return this.__getterCache["name"];
                          };
                  
                          return this.__getterCache["name"]=( ():{} => {
                              return result;
                          })();
                      }`)
        );
      });
      mocha.it("Memorize Provider", function () {
        const getter = createGetAccessor(undefined,undefined,undefined,[createDecorator(Decorators.Provider)]);
        assert.strictEqual(getter.isMemorized({members: [], isComponent: true}), true);
        assert.strictEqual(
          removeSpaces(getter.toString({members: [], isComponent:true})),
          removeSpaces(`get name(): any {
                          if(this.__getterCache["name"]!==undefined){
                              return this.__getterCache["name"];
                          };
                  
                          return this.__getterCache["name"]=((): any => {
                              return result;
                          })();
                      }`)
        );
      });
    });
    mocha.describe("GetAccessor cache", function () {
      mocha.it("Do not generate if simple type", function () {
        const getter = createGetAccessor(
          generator.createKeywordTypeNode("string")
        );

        const component = createComponent([getter]) as InfernoComponent;

        const componentWillUpdate: string[] = [];
        assert.strictEqual(component.compileGetterCache(componentWillUpdate), "");
        assert.deepStrictEqual(componentWillUpdate, []);
      });

      mocha.it(
        "Create cache if component has getter with complex type",
        function () {
          const component = createComponent([
            createGetAccessor(
              generator.createArrayTypeNode(
                generator.createKeywordTypeNode("string")
              ),
              undefined,
              "g1"
            ),
            createGetAccessor(
              generator.createArrayTypeNode(
                generator.createKeywordTypeNode("number")
              ),
              undefined,
              "g2"
            ),
            createGetAccessor(
              generator.createKeywordTypeNode("number"),
              undefined,
              "g3"
            ),
          ]) as InfernoComponent;

          const componentWillUpdate: string[] = [];
          assert.strictEqual(
            removeSpaces(component.compileGetterCache(componentWillUpdate, {members: [], isComponent: true})),
            removeSpaces(`__getterCache: {
                        g1?:string[];
                        g2?:number[]
                    } = {}`)
          );
          assert.deepStrictEqual(
            componentWillUpdate.map(s => removeSpaces(s)), 
            []);
        }
      );
      mocha.it("generates componentWillUpdate and reset if dependant prop or state changes", function (){
        const component = createComponent([
          createGetAccessor(
            generator.createArrayTypeNode(generator.createKeywordTypeNode("number")),
            generator.createBlock([
              generator.createPropertyAccess(
                generator.createPropertyAccess(
                  generator.createThis(),
                  generator.createIdentifier("props")
                ),
                generator.createIdentifier("p")
              ),
              generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("s")
              ),
            ],
            true),
          ),
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p"),
            '',
            generator.createKeywordTypeNode("number")
          ),
          generator.createProperty(
            [createDecorator(Decorators.InternalState)],
            [],
            generator.createIdentifier("s"),
            '',
            generator.createKeywordTypeNode("number")
          )
        ]) as InfernoComponent;

        const componentWillUpdate: string[] = []
        assert.strictEqual(
          removeSpaces(component.compileGetterCache(componentWillUpdate, {members: [], isComponent: true})),
          removeSpaces(`__getterCache: {
                      name?: number[]
                  } = {}`)
        );
        assert.deepStrictEqual(
          componentWillUpdate.map(s => removeSpaces(s)),
            [
              removeSpaces(
                `if (this.props["p"] !== nextProps["p"] || this.state["s"] !== nextState["s"]) {
                  this.__getterCache["name"] = undefined;
                }`
              )
            ]
        );
      })
      mocha.it("Do not generate if has mutable dependency", function () {
        const getter = createGetAccessor(
          generator.createKeywordTypeNode("string"),
          new Block([generator.createReturn(generator.createPropertyAccess(generator.createThis(),generator.createIdentifier("someMutable")))], false)
        );

        const component = createComponent([getter]) as InfernoComponent;

        const ngOnChanges: string[] = [];
        assert.strictEqual(removeSpaces(component.compileGetterCache(ngOnChanges, {
          members: [
            generator.createProperty(
              [createDecorator(Decorators.Mutable)],
              [],
              generator.createIdentifier("someMutable")
            )], 
          isComponent:true
        })), removeSpaces(''));
        assert.deepStrictEqual(ngOnChanges.map(statement=> removeSpaces(statement)), []);
      });
    });
  });
  mocha.describe("class-members/property", function () {
    mocha.describe("getDependencyString", function () {
      mocha.it("@Ref() p?:string", function () {
        const expression = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("p"),
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string")
        );

        assert.deepStrictEqual(expression.getDependencyString(), ["p.current"]);
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

        assert.deepStrictEqual(expression.getDependencyString(), [
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

        assert.deepStrictEqual(expression.getDependencyString(), []);
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
          expression.getDependencyString();
        } catch (e) {
          error = e;
        }
        assert.strictEqual(error, "Can't parse property: p");
      });
    });
    mocha.describe("getDependency", function () {
      mocha.it("@Ref() p?:string", function () {
        const expression = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("p"),
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string")
        );

        assert.deepStrictEqual(expression.getDependency(), [expression]);
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

        assert.deepStrictEqual(expression.getDependency(), [expression]);
      });

      mocha.it("@Ref() p:string", function () {
        const expression = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("p"),
          undefined,
          generator.createKeywordTypeNode("string")
        );

        assert.deepStrictEqual(expression.getDependency(), [expression]);
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
});
