import mocha from "./helpers/mocha";
import assert from "assert";
import generator from "../vue-generator";

import { printSourceCodeAst as getAst, removeSpaces } from "./helpers/common";
import componentCreator from "./helpers/create-component";
import { toStringOptions } from "../angular-generator/types";
import { Decorators } from "../component_declaration/decorators";
import { VueComponent } from "../vue-generator/expressions/vue-component";
import { JsxExpression } from "../vue-generator/expressions/jsx/jsx-expression";

const {
  createDecorator,
  createComponentDecorator,
  createComponent,
} = componentCreator(generator);

mocha.describe("Vue-generator", function () {
  mocha.describe("Expressions", function () {
    mocha.describe("common", function () {
      mocha.it("NonNullExpression", function () {
        const expression = generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("field")
        );
        assert.equal(
          generator.createNonNullExpression(expression).toString(),
          "this.field"
        );
      });

      mocha.it("import .d module should be ignored", function () {
        const expression = generator.createImportDeclaration(
          [],
          [],
          undefined,
          generator.createStringLiteral("../dirname/component.types.d")
        );

        assert.strictEqual(expression.toString(), "");
      });

      mocha.it("createPropertyAccessChain", function () {
        const expression = generator.createPropertyAccessChain(
          generator.createIdentifier("a"),
          generator.createToken(generator.SyntaxKind.QuestionDotToken),
          generator.createIdentifier("b")
        );

        assert.equal(expression.toString(), "a?.b");
        assert.equal(
          expression.toString({
            members: [],
            newComponentContext: "",
          }),
          "(a===undefined||a===null?undefined:a.b)"
        );
        assert.equal(
          expression.toString({
            members: [],
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "a?.b"
        );
      });
    });

    mocha.describe(
      "Type expressions should generate empty string",
      function () {
        mocha.it("KeywordTypeNode", function () {
          assert.strictEqual(
            generator.createKeywordTypeNode("number").toString(),
            ""
          );
        });

        mocha.it("ArrayTypeNode", function () {
          assert.strictEqual(
            generator
              .createArrayTypeNode(generator.createKeywordTypeNode("number"))
              .toString(),
            ""
          );
        });

        mocha.it("ArrayTypeNode", function () {
          assert.strictEqual(
            generator
              .createArrayTypeNode(generator.createKeywordTypeNode("number"))
              .toString(),
            ""
          );
        });

        mocha.it("createLiteralTypeNode", function () {
          assert.strictEqual(
            generator
              .createLiteralTypeNode(generator.createStringLiteral("2"))
              .toString(),
            ""
          );
        });

        mocha.it("createIndexedAccessTypeNode", function () {
          const expression = generator.createIndexedAccessTypeNode(
            generator.createTypeReferenceNode(
              generator.createIdentifier("PageIndex"),
              undefined
            ),
            generator.createLiteralTypeNode(generator.createStringLiteral("1"))
          );

          assert.strictEqual(expression.toString(), "");
        });

        mocha.it("createIntersectionTypeNode", function () {
          assert.equal(
            generator.createIntersectionTypeNode([
              generator.createKeywordTypeNode("string"),
              generator.createKeywordTypeNode("number"),
            ]),
            ""
          );
        });

        mocha.it("createUnionTypeNode", function () {
          assert.equal(
            generator.createUnionTypeNode([
              generator.createKeywordTypeNode("string"),
              generator.createKeywordTypeNode("number"),
            ]),
            ""
          );
        });

        mocha.it("createParenthesizedType", function () {
          assert.equal(
            generator.createParenthesizedType(
              generator.createKeywordTypeNode("string")
            ),
            ""
          );
        });

        mocha.it("FunctionTypeNode", function () {
          assert.strictEqual(
            generator
              .createFunctionTypeNode(
                undefined,
                [],
                generator.createKeywordTypeNode("string")
              )
              .toString(),
            ""
          );
        });

        mocha.it("createTypeAliasDeclaration", function () {
          const literalNode = generator.createTypeLiteralNode([
            generator.createPropertySignature(
              [],
              generator.createIdentifier("b"),
              undefined,
              generator.createKeywordTypeNode("string")
            ),
          ]);
          const expression = generator.createTypeAliasDeclaration(
            undefined,
            ["export", "declare"],
            generator.createIdentifier("Name"),
            [],
            literalNode
          );

          assert.strictEqual(expression.toString(), "");
        });

        mocha.it("createTypeOperatorNode", function () {
          assert.equal(
            generator.createTypeOperatorNode(
              generator.createKeywordTypeNode("number")
            ),
            ""
          );
        });

        mocha.it("TypeReferenceNode", function () {
          const expression = generator.createTypeReferenceNode(
            generator.createIdentifier("NodeType"),
            undefined
          );
          assert.strictEqual(expression.toString(), "");
        });

        mocha.it("ArrowFunction with Token type should ignore it", function () {
          const expression = generator.createArrowFunction(
            undefined,
            undefined,
            [],
            generator.createToken(generator.SyntaxKind.VoidKeyword),
            generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
            generator.createBlock([], true)
          );

          assert.strictEqual(getAst(expression.toString()), getAst("()=>{}"));
        });

        mocha.it(
          "ArrowFunction with defined typeParameters should ignore it",
          function () {
            const expression = generator.createArrowFunction(
              undefined,
              [
                generator.createTypeParameterDeclaration(
                  generator.createIdentifier("SomeType")
                ),
              ],
              [],
              undefined,
              "",
              generator.createBlock([], true)
            );

            assert.strictEqual(getAst(expression.toString()), getAst("()=>{}"));
          }
        );

        mocha.it("Function with Token type should ignore it", function () {
          const expression = generator.createFunctionDeclaration(
            [],
            undefined,
            "",
            generator.createIdentifier("f"),
            undefined,
            [],
            generator.createToken(generator.SyntaxKind.VoidKeyword),
            generator.createBlock([], true)
          );

          assert.strictEqual(
            getAst(expression.toString()),
            getAst("function f(){}")
          );
        });

        mocha.it("InterfaceDeclaration", function () {
          const expression = generator.createInterfaceDeclaration(
            undefined,
            undefined,
            generator.createIdentifier("name"),
            undefined,
            undefined,
            []
          );

          assert.strictEqual(expression.toString(), "");
        });
      }
    );

    mocha.it("empty expression", function () {
      const expression = generator.createJsxElement(
        generator.createJsxOpeningElement(generator.createIdentifier("div")),
        [generator.createJsxExpression(undefined, undefined)],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(expression.toString(), "<div ></div>");
    });

    mocha.describe("Enum", function () {
      mocha.it("member", function () {
        const result = generator.createEnumMember(
          generator.createIdentifier("E1"),
          generator.createStringLiteral("test")
        );

        assert.equal(result.toString(), 'E1:"test"');
      });

      mocha.it("declaration", function () {
        const result = generator.createEnumDeclaration(
          [],
          ["export", "default"],
          generator.createIdentifier("MyEnum"),
          [
            generator.createEnumMember(generator.createIdentifier("E1")),
            generator.createEnumMember(
              generator.createIdentifier("E2"),
              generator.createStringLiteral("test1")
            ),
            generator.createEnumMember(
              generator.createIdentifier("E3"),
              generator.createStringLiteral("test2")
            ),
            generator.createEnumMember(
              generator.createIdentifier("E4"),
              generator.createNumericLiteral("10")
            ),
            generator.createEnumMember(generator.createIdentifier("E5")),
          ]
        );

        assert.strictEqual(
          getAst(result.toString()),
          getAst(`
            export default const MyEnum = {
              E1:0,
              E2:"test1",
              E3:"test2",
              E4:10,
              E5:11
            }
          `)
        );
      });

      mocha.it("empty declaration", function () {
        const result = generator.createEnumDeclaration(
          undefined,
          undefined,
          generator.createIdentifier("MyEnum"),
          []
        );

        assert.strictEqual(
          getAst(result.toString()),
          getAst("const MyEnum = {}")
        );
      });
    });
  });

  mocha.describe("Property", function () {
    const name = generator.createIdentifier("p");

    mocha.describe("Props", function () {
      const decorators = [createDecorator("OneWay")];

      mocha.describe("types", function () {
        mocha.it("Property with KeywordTypeNode", function () {
          const expression = generator.createProperty(
            decorators,
            undefined,
            name,
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("string"),
            undefined
          );

          assert.strictEqual(
            getAst(expression.toString({ members: [] })),
            getAst("p: {type: String}")
          );
          assert.strictEqual(expression.getter(), "p");
          assert.strictEqual(expression.getter("this"), "this.p");
        });

        mocha.it("Property with KeywordTypeNode - any", function () {
          const expression = generator.createProperty(
            decorators,
            undefined,
            name,
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("any"),
            undefined
          );

          assert.strictEqual(
            getAst(expression.toString({ members: [] })),
            getAst("p: {}")
          );
        });

        mocha.it("Property with KeywordTypeNode - undefined", function () {
          const expression = generator.createProperty(
            decorators,
            undefined,
            name,
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("undefined"),
            undefined
          );

          assert.strictEqual(
            getAst(expression.toString({ members: [] })),
            getAst("p: {}")
          );
          assert.strictEqual(expression.getter(), "p");
          assert.strictEqual(expression.getter("this"), "this.p");
        });

        mocha.it("Property with ArrayTypeNode", function () {
          const expression = generator.createProperty(
            decorators,
            undefined,
            name,
            undefined,
            generator.createArrayTypeNode(
              generator.createKeywordTypeNode("string")
            ),
            undefined
          );

          assert.strictEqual(
            getAst(expression.toString({ members: [] })),
            getAst("p: {type: Array}")
          );
        });

        mocha.it("Property with Function type", function () {
          const expression = generator.createProperty(
            decorators,
            undefined,
            name,
            undefined,
            generator.createFunctionTypeNode(
              undefined,
              [],
              generator.createKeywordTypeNode("string")
            ),
            undefined
          );

          assert.strictEqual(
            getAst(expression.toString({ members: [] })),
            getAst("p: {type: Function")
          );
        });

        mocha.it("Property with array as TypeReferenceNode", function () {
          const expression = generator.createProperty(
            decorators,
            undefined,
            name,
            undefined,
            generator.createTypeReferenceNode(
              generator.createIdentifier("Array"),
              [generator.createKeywordTypeNode("Number")]
            ),
            undefined
          );

          assert.strictEqual(
            getAst(expression.toString({ members: [] })),
            getAst("p: {type: Array")
          );
        });

        mocha.it("Property with custom TypeReferenceNode", function () {
          const expression = generator.createProperty(
            decorators,
            undefined,
            name,
            undefined,
            generator.createTypeReferenceNode(
              generator.createIdentifier("CustomType")
            ),
            undefined
          );

          assert.strictEqual(
            getAst(expression.toString({ members: [] })),
            getAst("p: {type: Object")
          );
        });

        mocha.it("Property with *Element type", function () {
          const elementTypes = [
            "Element",
            "HTMLElement",
            "HTMLDivElement",
            "SVGElement",
          ];
          elementTypes.forEach((type) => {
            const expression = generator.createProperty(
              decorators,
              undefined,
              name,
              undefined,
              generator.createTypeReferenceNode(
                generator.createIdentifier(type)
              ),
              undefined
            );

            assert.strictEqual(
              getAst(expression.toString({ members: [] })),
              getAst(`p: {type: ${type}`)
            );
          });
        });

        mocha.describe("Property with LiteralTypeNode", function () {
          mocha.it("Object", function () {
            const expression = generator.createProperty(
              decorators,
              undefined,
              name,
              undefined,
              generator.createLiteralTypeNode(
                generator.createObjectLiteral([], false)
              ),
              undefined
            );

            assert.strictEqual(
              getAst(expression.toString({ members: [] })),
              getAst("p: {type: Object}")
            );
          });

          mocha.it("string", function () {
            const expression = generator.createProperty(
              decorators,
              undefined,
              name,
              undefined,
              generator.createLiteralTypeNode(
                generator.createStringLiteral("10")
              ),
              undefined
            );

            assert.strictEqual(
              getAst(expression.toString({ members: [] })),
              getAst("p: {type: String}")
            );
          });

          mocha.it("number", function () {
            const expression = generator.createProperty(
              decorators,
              undefined,
              name,
              undefined,
              generator.createLiteralTypeNode(
                generator.createNumericLiteral("10")
              ),
              undefined
            );

            assert.strictEqual(
              getAst(expression.toString({ members: [] })),
              getAst("p: {type: Number}")
            );
          });
        });

        mocha.describe("Union", function () {
          mocha.it("Property with Union type", function () {
            const expression = generator.createProperty(
              decorators,
              undefined,
              name,
              undefined,
              generator.createUnionTypeNode([
                generator.createKeywordTypeNode("string"),
                generator.createKeywordTypeNode("number"),
              ]),
              undefined
            );

            assert.strictEqual(
              getAst(expression.toString({ members: [] })),
              getAst("p: {type: [String,Number]}")
            );
          });

          mocha.it("Property with Union type with undefined", function () {
            const expression = generator.createProperty(
              decorators,
              undefined,
              name,
              undefined,
              generator.createUnionTypeNode([
                generator.createKeywordTypeNode("string"),
                generator.createKeywordTypeNode("undefined"),
              ]),
              undefined
            );

            assert.strictEqual(
              getAst(expression.toString({ members: [] })),
              getAst("p: {type: [String]}")
            );
          });

          mocha.it("type should not have duplicates", function () {
            const expression = generator.createProperty(
              decorators,
              undefined,
              name,
              undefined,
              generator.createUnionTypeNode([
                generator.createLiteralTypeNode(
                  generator.createStringLiteral("10")
                ),
                generator.createLiteralTypeNode(
                  generator.createStringLiteral("11")
                ),
                generator.createLiteralTypeNode(
                  generator.createNumericLiteral("12")
                ),
              ]),
              undefined
            );

            assert.strictEqual(
              getAst(expression.toString({ members: [] })),
              getAst("p: {type: [String, Number]}")
            );
          });

          mocha.it(
            "type should be an array if only one type in the union",
            function () {
              const expression = generator.createProperty(
                decorators,
                undefined,
                name,
                undefined,
                generator.createUnionTypeNode([
                  generator.createLiteralTypeNode(
                    generator.createStringLiteral("10")
                  ),
                  generator.createLiteralTypeNode(
                    generator.createStringLiteral("11")
                  ),
                  generator.createLiteralTypeNode(
                    generator.createStringLiteral("12")
                  ),
                ]),
                undefined
              );

              assert.strictEqual(
                getAst(expression.toString({ members: [] })),
                getAst("p: {type: String}")
              );
            }
          );
        });

        mocha.it("Property without type", function () {
          const expression = generator.createProperty(
            decorators,
            undefined,
            name,
            undefined,
            undefined,
            undefined
          );

          assert.strictEqual(
            getAst(expression.toString({ members: [] })),
            getAst("p: {}")
          );
        });
      });

      mocha.it("Required property", function () {
        const expression = generator.createProperty(
          decorators,
          undefined,
          name,
          generator.SyntaxKind.ExclamationToken,
          generator.createKeywordTypeNode("string"),
          undefined
        );

        assert.strictEqual(
          getAst(expression.toString({ members: [] })),
          getAst(`p: {
                    type: String,
                    required: true
                }`)
        );
      });

      mocha.it("Property with initializer - number", function () {
        const expression = generator.createProperty(
          decorators,
          undefined,
          name,
          undefined,
          undefined,
          generator.createNumericLiteral("10")
        );

        assert.strictEqual(
          getAst(expression.toString({ members: [] })),
          getAst(`p: { 
            type: Number,
            default(){
              return 10;
          }}`)
        );
      });

      mocha.it("Property with initializer - string", function () {
        const expression = generator.createProperty(
          decorators,
          undefined,
          name,
          undefined,
          undefined,
          generator.createStringLiteral("10")
        );

        assert.strictEqual(
          getAst(expression.toString({ members: [] })),
          getAst(`p: { 
            type: String,
            default(){
              return "10";
          }}`)
        );
      });

      mocha.it("Property with initializer - function", function () {
        const expression = generator.createProperty(
          decorators,
          undefined,
          name,
          undefined,
          generator.createFunctionTypeNode(
            undefined,
            [],
            generator.createKeywordTypeNode("string")
          ),
          generator.createArrowFunction(
            [],
            [],
            [],
            undefined,
            generator.SyntaxKind.EqualsGreaterThanToken,
            generator.createNull()
          )
        );

        assert.strictEqual(
          getAst(expression.toString({ members: [] })),
          getAst(`p: { 
            type: Function,
            default: () => null
          }`)
        );
      });

      mocha.describe("Slots", function () {
        mocha.it("default slot", function () {
          const expression = generator.createProperty(
            [createDecorator("Slot")],
            undefined,
            name,
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("boolean"),
            generator.createTrue()
          );

          assert.strictEqual(expression.toString({ members: [] }), "");
          assert.strictEqual(expression.getter("this"), "this.$slots.p");
        });

        mocha.it("default slot", function () {
          const expression = generator.createProperty(
            [createDecorator("Slot")],
            undefined,
            generator.createIdentifier("default"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("boolean"),
            generator.createTrue()
          );

          assert.strictEqual(expression.toString({ members: [] }), "");
          assert.strictEqual(expression.getter("this"), "this.$slots.default");
        });

        mocha.it("children slot", function () {
          const expression = generator.createProperty(
            [createDecorator("Slot")],
            undefined,
            generator.createIdentifier("children"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("boolean"),
            generator.createTrue()
          );

          assert.strictEqual(expression.toString({ members: [] }), "");
          assert.strictEqual(expression.getter("this"), "this.$slots.default");
        });
      });

      mocha.describe("Template", function () {
        mocha.it(
          "Template props toString should return empty string",
          function () {
            const expression = generator.createProperty(
              [createDecorator("Template")],
              undefined,
              name,
              generator.SyntaxKind.QuestionToken,
              generator.createKeywordTypeNode("boolean"),
              generator.createTrue()
            );

            assert.strictEqual(expression.toString({ members: [] }), "");
          }
        );
      });
    });

    mocha.describe("Internal state", function () {
      const decorators = [createDecorator("InternalState")];

      mocha.it("without initializer", function () {
        const expression = generator.createProperty(
          decorators,
          undefined,
          name,
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string"),
          undefined
        );

        assert.strictEqual(
          getAst(expression.toString({ members: [] })),
          getAst("p: undefined")
        );
        assert.strictEqual(expression.getter(), "p");
      });

      mocha.it("with initializer", function () {
        const expression = generator.createProperty(
          decorators,
          undefined,
          name,
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string"),
          generator.createNumericLiteral("10")
        );

        assert.strictEqual(
          getAst(expression.toString({ members: [] })),
          getAst("p: 10")
        );
      });
    });

    mocha.describe("Event", function () {
      mocha.it("toString should return empty string", function () {
        const expression = generator.createProperty(
          [createDecorator("Event")],
          undefined,
          name,
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("function"),
          undefined
        );

        assert.strictEqual(expression.toString({ members: [] }), "");
      });
    });

    mocha.describe("Refs", function () {
      mocha.it("toString should return empty string", function () {
        const expression = generator.createProperty(
          [createDecorator("Ref")],
          undefined,
          name,
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("HtmlDivElement"),
          undefined
        );

        assert.strictEqual(expression.toString({ members: [] }), "");
      });

      mocha.it("getter", function () {
        const expression = generator.createProperty(
          [createDecorator("Ref")],
          undefined,
          name,
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("HtmlDivElement"),
          undefined
        );

        assert.strictEqual(expression.getter("this"), "this.$refs.p");
        assert.strictEqual(expression.getter(""), "p");
      });
    });
  });

  mocha.describe("Call", function () {
    mocha.it("Call with typeParameter", function () {
      assert.equal(
        generator
          .createCall(
            generator.createIdentifier("a"),
            [
              generator.createTypeParameterDeclaration(
                generator.createIdentifier("TypeParameter")
              ),
            ],
            []
          )
          .toString(),
        "a()"
      );
    });

    mocha.it("CallChain with typeParameter", function () {
      assert.equal(
        generator
          .createCallChain(
            generator.createIdentifier("a"),
            generator.SyntaxKind.QuestionDotToken,
            [
              generator.createTypeParameterDeclaration(
                generator.createIdentifier("TypeParameter")
              ),
            ],
            []
          )
          .toString(),
        "a?.()"
      );
    });

    mocha.it("Call expression generates usual call if not event", function () {
      assert.equal(
        generator
          .createCall(generator.createIdentifier("a"), undefined, [
            generator.createNumericLiteral("10"),
          ])
          .toString(),
        "a(10)"
      );
    });

    mocha.it("Call expression generates emit if call Event", function () {
      const member = generator.createProperty(
        [createDecorator("Event")],
        undefined,
        generator.createIdentifier("onClick")
      );
      assert.strictEqual(
        generator
          .createCall(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("onClick")
            ),
            undefined,
            [generator.createNumericLiteral("10")]
          )
          .toString({
            members: [member],
            componentContext: "this",
            newComponentContext: "this",
          }),
        "this.onClick(10)"
      );
    });

    mocha.it("CallChain expression generates emit if call Event", function () {
      const member = generator.createProperty(
        [createDecorator("Event")],
        undefined,
        generator.createIdentifier("onClick")
      );
      assert.strictEqual(
        generator
          .createCallChain(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("onClick")
            ),
            generator.SyntaxKind.QuestionDotToken,
            undefined,
            [generator.createNumericLiteral("10")]
          )
          .toString({
            members: [member],
            componentContext: "this",
            newComponentContext: "this",
          }),
        "this.onClick(10)"
      );
    });

    mocha.it("CallChain Identifer that is call event", function () {
      const member = generator.createProperty(
        [createDecorator("Event")],
        undefined,
        generator.createIdentifier("onClick")
      );
      assert.strictEqual(
        generator
          .createCallChain(
            generator.createIdentifier("click"),
            generator.SyntaxKind.QuestionDotToken,
            undefined,
            [generator.createNumericLiteral("10")]
          )
          .toString({
            members: [member],
            componentContext: "this",
            newComponentContext: "this",
            variables: {
              click: generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("onClick")
              ),
            },
          }),
        "this.onClick(10)"
      );
    });

    mocha.it(
      "CallChain expression generates usual call if not event",
      function () {
        assert.strictEqual(
          generator
            .createCallChain(
              generator.createIdentifier("a"),
              generator.SyntaxKind.QuestionDotToken,
              undefined,
              [generator.createNumericLiteral("10")]
            )
            .toString(),
          "a?.(10)"
        );
      }
    );
  });

  mocha.describe("Methods", function () {
    mocha.it("Method with options", function () {
      const expression = generator.createMethod(
        [createDecorator("SomeDecorator")],
        ["public"],
        undefined,
        generator.createIdentifier("m"),
        undefined,
        undefined,
        [],
        undefined,
        generator.createBlock([], false)
      );

      assert.strictEqual(
        getAst(
          expression.toString({
            members: [],
          })
        ),
        getAst("m(){}")
      );
    });

    mocha.it("Method with parameters", function () {
      const expression = generator.createMethod(
        [],
        [],
        undefined,
        generator.createIdentifier("m"),
        undefined,
        undefined,
        [
          generator.createParameter(
            [],
            [],
            undefined,
            generator.createIdentifier("p1"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("number"),
            generator.createNumericLiteral("10")
          ),
          generator.createParameter(
            [],
            [],
            undefined,
            generator.createIdentifier("p2"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("number")
          ),
        ],
        undefined,
        generator.createBlock([], false)
      );

      assert.strictEqual(
        getAst(
          expression.toString({
            members: [],
          })
        ),
        getAst(`m(p1=10, p2){}`)
      );
    });

    mocha.it("Parameter with spread", function () {
      const parameter = generator.createParameter(
        [],
        [],
        "...",
        generator.createIdentifier("a"),
        undefined,
        generator.createKeywordTypeNode("object[]"),
        undefined
      );

      assert.equal(parameter.toString(), "...a");
      assert.equal(parameter.typeDeclaration(), "a:any");
    });

    mocha.it("GetAccessor", function () {
      const expression = generator.createGetAccessor(
        [createDecorator("SomeDecorator")],
        ["public"],
        generator.createIdentifier("m"),
        [],
        undefined,
        generator.createBlock([], false)
      );

      assert.strictEqual(
        getAst(
          expression.toString({
            members: [],
          })
        ),
        getAst("m(){}")
      );
      assert.strictEqual(expression.getter(), "m");
      assert.strictEqual(expression.getter("this"), "this.m");
    });
  });

  mocha.describe("Template", function () {
    mocha.describe("View Function", function () {
      const viewFunctionBlock = generator.createBlock(
        [
          generator.createReturn(
            generator.createJsxSelfClosingElement(
              generator.createIdentifier("div"),
              [],
              []
            )
          ),
        ],
        false
      );

      mocha.it(
        "Function that returns jsx converts to empty string",
        function () {
          const expression = generator.createFunctionDeclaration(
            undefined,
            undefined,
            "",
            generator.createIdentifier("view"),
            undefined,
            [],
            undefined,
            viewFunctionBlock
          );

          assert.strictEqual(expression.toString(), "");
        }
      );

      mocha.it(
        "ArrowFunction that returns jsx converts to empty string",
        function () {
          const expression = generator.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            generator.SyntaxKind.EqualsGreaterThanToken,
            viewFunctionBlock
          );

          assert.strictEqual(expression.toString(), "");
        }
      );

      mocha.it("skip jsx function from variable declaration", function () {
        const functionDeclaration = generator.createFunctionExpression(
          [],
          "",
          undefined,
          [],
          [],
          undefined,
          viewFunctionBlock
        );

        const expression = generator.createVariableStatement(
          [generator.SyntaxKind.ExportKeyword],
          generator.createVariableDeclarationList(
            [
              generator.createVariableDeclaration(
                generator.createIdentifier("viewFunction"),
                undefined,
                functionDeclaration
              ),
            ],
            generator.SyntaxKind.ConstKeyword
          )
        );

        assert.strictEqual(expression.toString(), "");
      });

      mocha.it(
        "Can use jsx variable twice. Self-closing element should be cloned correctly",
        function () {
          const block = generator.createBlock(
            [
              generator.createVariableStatement(
                [],
                generator.createVariableDeclarationList(
                  [
                    generator.createVariableDeclaration(
                      generator.createIdentifier("v"),
                      undefined,
                      generator.createJsxSelfClosingElement(
                        generator.createIdentifier("span")
                      )
                    ),
                  ],
                  generator.SyntaxKind.ConstKeyword
                )
              ),
              generator.createReturn(
                generator.createJsxElement(
                  generator.createJsxOpeningElement(
                    generator.createIdentifier("div"),
                    [],
                    []
                  ),
                  [
                    generator.createJsxExpression(
                      undefined,
                      generator.createBinary(
                        generator.createIdentifier("c1"),
                        generator.SyntaxKind.AmpersandAmpersandToken,
                        generator.createIdentifier("v")
                      )
                    ),
                    generator.createJsxExpression(
                      undefined,
                      generator.createBinary(
                        generator.createIdentifier("c2"),
                        generator.SyntaxKind.AmpersandAmpersandToken,
                        generator.createIdentifier("v")
                      )
                    ),
                  ],
                  generator.createJsxClosingElement(
                    generator.createIdentifier("div")
                  )
                )
              ),
            ],
            false
          );

          const expression = generator.createFunctionDeclaration(
            [],
            [],
            "",
            generator.createIdentifier("View"),
            [],
            [],
            undefined,
            block
          );

          assert.strictEqual(expression.toString(), "");
          assert.strictEqual(
            removeSpaces(
              expression.getTemplate({
                members: [],
              }) as string
            ),
            removeSpaces(`<div >
                        <span v-if="c1"/>
                        <span v-if="c2"/>
                    </div>`)
          );
        }
      );

      mocha.it(
        "Can use jsx variable twice. jsx element should be cloned correctly",
        function () {
          const block = generator.createBlock(
            [
              generator.createVariableStatement(
                [],
                generator.createVariableDeclarationList(
                  [
                    generator.createVariableDeclaration(
                      generator.createIdentifier("v"),
                      undefined,
                      generator.createJsxElement(
                        generator.createJsxOpeningElement(
                          generator.createIdentifier("span"),
                          undefined,
                          []
                        ),
                        [],
                        generator.createJsxClosingElement(
                          generator.createIdentifier("span")
                        )
                      )
                    ),
                  ],
                  generator.SyntaxKind.ConstKeyword
                )
              ),
              generator.createReturn(
                generator.createJsxElement(
                  generator.createJsxOpeningElement(
                    generator.createIdentifier("div"),
                    [],
                    []
                  ),
                  [
                    generator.createJsxExpression(
                      undefined,
                      generator.createBinary(
                        generator.createIdentifier("c1"),
                        generator.SyntaxKind.AmpersandAmpersandToken,
                        generator.createIdentifier("v")
                      )
                    ),
                    generator.createJsxExpression(
                      undefined,
                      generator.createBinary(
                        generator.createIdentifier("c2"),
                        generator.SyntaxKind.AmpersandAmpersandToken,
                        generator.createIdentifier("v")
                      )
                    ),
                  ],
                  generator.createJsxClosingElement(
                    generator.createIdentifier("div")
                  )
                )
              ),
            ],
            false
          );

          const expression = generator.createFunctionDeclaration(
            [],
            [],
            "",
            generator.createIdentifier("View"),
            [],
            [],
            undefined,
            block
          );

          assert.strictEqual(expression.toString(), "");
          assert.strictEqual(
            removeSpaces(
              expression.getTemplate({
                members: [],
              }) as string
            ),
            removeSpaces(`<div >
                        <span v-if="c1"></span>
                        <span v-if="c2"></span>
                    </div>`)
          );
        }
      );

      mocha.it("Wrap single template in fragment. Function", function () {
        const block = generator.createBlock(
          [
            generator.createReturn(
              generator.createJsxSelfClosingElement(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("model"),
                    generator.createIdentifier("props")
                  ),
                  generator.createIdentifier("contentTemplate")
                )
              )
            ),
          ],
          false
        );

        const expression = generator.createFunctionDeclaration(
          [],
          [],
          "",
          generator.createIdentifier("View"),
          [],
          [
            generator.createParameter(
              [],
              [],
              undefined,
              generator.createIdentifier("model")
            ),
          ],
          undefined,
          block
        );

        const templateProperty = generator.createProperty(
          [createDecorator(Decorators.Template)],
          undefined,
          generator.createIdentifier("contentTemplate")
        );

        assert.strictEqual(expression.toString(), "");
        assert.strictEqual(
          removeSpaces(
            expression.getTemplate({
              members: [templateProperty],
            }) as string
          ),
          removeSpaces(
            `<div style="display:contents"><slot name="contentTemplate"></slot></div>`
          )
        );
      });

      mocha.it("Wrap single template in fragment. ArrowFunction", function () {
        const block = generator.createBlock(
          [
            generator.createReturn(
              generator.createJsxSelfClosingElement(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("model"),
                    generator.createIdentifier("props")
                  ),
                  generator.createIdentifier("contentTemplate")
                )
              )
            ),
          ],
          false
        );

        const expression = generator.createArrowFunction(
          [],
          [],
          [
            generator.createParameter(
              [],
              [],
              undefined,
              generator.createIdentifier("model")
            ),
          ],
          undefined,
          generator.SyntaxKind.EqualsGreaterThanToken,
          block
        );

        const templateProperty = generator.createProperty(
          [createDecorator(Decorators.Template)],
          undefined,
          generator.createIdentifier("contentTemplate")
        );

        assert.strictEqual(expression.toString(), "");
        assert.strictEqual(
          removeSpaces(
            expression.getTemplate({
              members: [templateProperty],
            }) as string
          ),
          removeSpaces(
            `<div style="display:contents"><slot name="contentTemplate"></slot></div>`
          )
        );
      });
    });
  });

  mocha.describe("Component Input", function () {
    mocha.it("Component Binding should be an object", function () {
      const expression = generator.createClassDeclaration(
        [createDecorator("ComponentBindings")],
        ["export"],
        generator.createIdentifier("Props"),
        [],
        [],
        [
          generator.createProperty(
            [createDecorator("OneWay")],
            [],
            generator.createIdentifier("p"),
            undefined,
            generator.createKeywordTypeNode("string"),
            undefined
          ),
          generator.createProperty(
            [createDecorator("OneWay")],
            [],
            generator.createIdentifier("p1"),
            undefined,
            generator.createKeywordTypeNode("number"),
            undefined
          ),
        ]
      );

      assert.strictEqual(
        getAst(expression.toString()),
        getAst(`export const Props = {
                p: {type: String},
                p1: {type: Number}
            }`)
      );
    });

    mocha.it("Component with heritage clauses", function () {
      const expression = generator.createClassDeclaration(
        [createDecorator("ComponentBindings")],
        ["export"],
        generator.createIdentifier("Props"),
        [],
        [
          generator.createHeritageClause(generator.SyntaxKind.ExtendsKeyword, [
            generator.createExpressionWithTypeArguments(
              undefined,
              generator.createIdentifier("Base")
            ),
          ]),
        ],
        [
          generator.createProperty(
            [createDecorator("OneWay")],
            [],
            generator.createIdentifier("p"),
            undefined,
            generator.createKeywordTypeNode("string"),
            undefined
          ),
        ]
      );

      assert.strictEqual(
        getAst(expression.toString()),
        getAst(`export const Props = {
                ...Base,
                p: {type: String}
            }`)
      );
    });
  });

  mocha.describe("Component", function () {
    mocha.describe("Compile Effects", function () {
      this.beforeEach(function () {
        this.effect = generator.createMethod(
          [createDecorator("Effect")],
          [],
          undefined,
          generator.createIdentifier("e"),
          undefined,
          undefined,
          [],
          undefined,
          generator.createBlock([], true)
        );
      });

      mocha.it("should add watch for properties in dependency", function () {
        this.effect.body = generator.createBlock(
          [
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("p")
            ),
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("p2")
            ),
          ],
          false
        );

        const component = createComponent(
          ["p", "p1", "p2"]
            .map((name) =>
              generator.createProperty(
                [createDecorator("OneWay")],
                undefined,
                generator.createIdentifier(name),
                undefined,
                undefined,
                undefined
              )
            )
            .concat(this.effect)
        ) as VueComponent;

        const watch = component.generateWatch([]);

        assert.strictEqual(
          getAst(watch),
          getAst(`watch: {
                    p: ["__schedule_e"],
                    p2: ["__schedule_e"]
                }`)
        );
      });

      mocha.it("should watch all props if props in dependency", function () {
        this.effect.body = generator.createBlock(
          [
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("props")
            ),
          ],
          false
        );

        const component = createComponent(
          ["p", "p1", "p2"]
            .map((name) =>
              generator.createProperty(
                [createDecorator("OneWay")],
                undefined,
                generator.createIdentifier(name),
                undefined,
                undefined,
                undefined
              )
            )
            .concat(this.effect)
        ) as VueComponent;

        const watch = component.generateWatch([]);

        assert.strictEqual(
          getAst(watch),
          getAst(`watch: {
                    p: ["__schedule_e"],
                    p1: ["__schedule_e"],
                    p2: ["__schedule_e"]
                }`)
        );
      });

      mocha.it(
        "should not generate watch if there is not any dependency",
        function () {
          const component = createComponent(
            ["p", "p1"]
              .map((name) =>
                generator.createProperty(
                  [createDecorator("OneWay")],
                  undefined,
                  generator.createIdentifier(name),
                  undefined,
                  undefined,
                  undefined
                )
              )
              .concat(this.effect)
          ) as VueComponent;

          const methods: string[] = [];
          const watch = component.generateWatch(methods);

          assert.strictEqual(watch, "");
          assert.deepEqual(methods, []);
        }
      );

      mocha.it("two effect have same dependency", function () {
        const effect = generator.createMethod(
          [createDecorator("Effect")],
          [],
          undefined,
          generator.createIdentifier("e1"),
          undefined,
          undefined,
          [],
          undefined,
          generator.createBlock(
            [
              generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("p")
              ),
            ],
            true
          )
        );

        this.effect.body = generator.createBlock(
          [
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("p")
            ),
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("p2")
            ),
          ],
          false
        );

        const component = createComponent(
          ["p", "p1", "p2"]
            .map((name) =>
              generator.createProperty(
                [createDecorator("OneWay")],
                undefined,
                generator.createIdentifier(name),
                undefined,
                undefined,
                undefined
              )
            )
            .concat([this.effect, effect])
        ) as VueComponent;

        const methods: string[] = [];
        const watch = component.generateWatch(methods);

        assert.strictEqual(
          getAst(watch),
          getAst(`watch: {
                    p: ["__schedule_e", "__schedule_e1"],
                    p2: ["__schedule_e"]
                }`)
        );

        assert.strictEqual(
          getAst(`{
                    ${methods.join(",\n")}
                }`),
          getAst(`{
                    __schedule_e() {
                        this.__scheduleEffect(0, "__e");
                   },
                   __schedule_e1() {
                        this.__scheduleEffect(1, "__e1");
                   },
                   __scheduleEffect(index, name){
                    if(!this.__scheduleEffects[index]){
                            this.__scheduleEffects[index]=()=>{
                                this.__destroyEffects[index]&&this.__destroyEffects[index]();
                                this.__destroyEffects[index]=this[name]();
                                this.__scheduleEffects[index] = null;
                            }
                            this.$nextTick(()=>this.__scheduleEffects[index]&&this.__scheduleEffects[index]());
                        }
                   }
               }`)
        );
      });
    });
  });

  mocha.describe("Template Generation", function () {
    mocha.describe("Elements", function () {
      mocha.it("Self-closing element", function () {
        const expression = generator.createJsxSelfClosingElement(
          generator.createIdentifier("span")
        );

        assert.strictEqual(expression.toString(), "<span />");
      });

      mocha.it("element", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(generator.createIdentifier("div")),
          [],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(expression.toString(), "<div ></div>");
      });

      mocha.it(
        "Element with two children: should not be any whitespace symbols between elements",
        function () {
          const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div")
            ),
            [
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("span")
              ),
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("span")
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          assert.strictEqual(
            expression.toString(),
            "<div ><span /><span /></div>"
          );
        }
      );

      mocha.it("element with attributes", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            [],
            [
              generator.createJsxAttribute(
                generator.createIdentifier("a"),
                generator.createNumericLiteral("10")
              ),

              generator.createJsxAttribute(
                generator.createIdentifier("b"),
                generator.createStringLiteral("word")
              ),
            ]
          ),
          [],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(
          removeSpaces(expression.toString()),
          removeSpaces(`<div :a="10" b="word"></div>`)
        );
      });

      mocha.it(`JsxSpreadAttribute replace " -> '`, function () {
        const expression = generator.createJsxSpreadAttribute(
          generator.createObjectLiteral(
            [
              generator.createPropertyAssignment(
                generator.createIdentifier("a"),
                generator.createStringLiteral("str")
              ),
            ],
            false
          )
        );

        assert.strictEqual(expression.toString(), `v-bind="{a:'str'}"`);
      });

      mocha.describe("Attributes", function () {
        mocha.it("title attribute", function () {
          const expression = generator.createJsxAttribute(
            generator.createIdentifier("title"),
            generator.createNumericLiteral("10")
          );

          assert.strictEqual(expression.toString(), `:title="10"`);
        });

        mocha.it("style -> v-bind:style", function () {
          const expression = generator.createJsxAttribute(
            generator.createIdentifier("style"),
            generator.createJsxExpression(
              undefined,
              generator.createIdentifier("value")
            )
          );

          assert.strictEqual(
            expression.toString(),
            `v-bind:style="__processStyle(value)"`
          );
        });

        mocha.it("className -> v-bind:class", function () {
          const expression = generator.createJsxAttribute(
            generator.createIdentifier("className"),
            generator.createJsxExpression(
              undefined,
              generator.createIdentifier("value")
            )
          );

          assert.strictEqual(expression.toString(), `v-bind:class="value"`);
        });

        mocha.it("className -> class", function () {
          const expression = generator.createJsxAttribute(
            generator.createIdentifier("className"),
            generator.createJsxExpression(
              undefined,
              generator.createStringLiteral("value")
            )
          );

          assert.strictEqual(expression.toString(), `class="value"`);
        });

        mocha.it("Parse style with options should fill hasClass", function () {
          const expression = generator.createJsxAttribute(
            generator.createIdentifier("style"),
            generator.createJsxExpression(
              undefined,
              generator.createIdentifier("value")
            )
          );

          const options: toStringOptions = {
            members: [],
          };

          assert.strictEqual(
            expression.toString(options),
            `v-bind:style="__processStyle(value)"`
          );
          assert.strictEqual(options.hasStyle, true);
        });
      });

      mocha.describe("Fragment", function () {
        mocha.it("Fragment -> div", function () {
          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("Fragment"),
              undefined,
              []
            ),
            [],
            generator.createJsxClosingElement(
              generator.createIdentifier("Fragment")
            )
          );

          assert.strictEqual(
            element.toString(),
            `<div style="display: contents" ></div>`
          );
        });
      });
    });

    mocha.describe("Conditional Rendering", function () {
      mocha.it(
        "notJsxExpr && <element></element> -> <element v-if='notJsxExpr'></element>",
        function () {
          const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div"),
              undefined,
              []
            ),
            [
              generator.createJsxExpression(
                undefined,
                generator.createBinary(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("input")
                  ),
                  generator.createToken(
                    generator.SyntaxKind.AmpersandAmpersandToken
                  ),
                  generator.createJsxElement(
                    generator.createJsxOpeningElement(
                      generator.createIdentifier("input"),
                      undefined,
                      []
                    ),
                    [],
                    generator.createJsxClosingElement(
                      generator.createIdentifier("input")
                    )
                  )
                )
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          assert.strictEqual(
            expression.children[0].toString(),
            `<input v-if="viewModel.input"></input>`
          );
        }
      );

      mocha.it(
        "notJsxExpr && <element/> -> <element v-if='notJsxExpr'>",
        function () {
          const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div"),
              undefined,
              []
            ),
            [
              generator.createJsxExpression(
                undefined,
                generator.createBinary(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("input")
                  ),
                  generator.createToken(
                    generator.SyntaxKind.AmpersandAmpersandToken
                  ),
                  generator.createJsxSelfClosingElement(
                    generator.createIdentifier("input"),
                    undefined,
                    []
                  )
                )
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          assert.strictEqual(
            expression.children[0].toString(),
            `<input v-if="viewModel.input"/>`
          );
        }
      );

      mocha.it(
        "condition?then:else - <div v-if='condition'> <div v-else>",
        function () {
          const attribute = generator.createJsxAttribute(
            generator.createIdentifier("a"),
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("value")
            )
          );

          const property = generator.createGetAccessor(
            [],
            [],
            generator.createIdentifier("value"),
            [],
            undefined,
            undefined
          );
          property.prefix = "_";

          const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div"),
              undefined,
              []
            ),
            [
              generator.createJsxExpression(
                undefined,
                generator.createConditional(
                  generator.createIdentifier("condition"),
                  generator.createJsxSelfClosingElement(
                    generator.createIdentifier("input"),
                    [],
                    [attribute]
                  ),
                  generator.createJsxSelfClosingElement(
                    generator.createIdentifier("input"),
                    [],
                    [attribute]
                  )
                )
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          assert.strictEqual(
            removeSpaces(
              expression.children[0].toString({
                componentContext: "viewModel",
                newComponentContext: "",
                members: [property],
              })
            ),
            removeSpaces(
              `<input :a="_value" v-if="condition"/>\n<input :a="_value" v-else/>`
            )
          );
        }
      );

      mocha.it(
        "non jsx conditional - condition?then:else - {{then}} {{else}}'",
        function () {
          const thenStatement = generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier("value")
          );

          const elseStatement = generator.createPrefix(
            generator.SyntaxKind.ExclamationToken,
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("value")
            )
          );

          const property = generator.createGetAccessor(
            [],
            [],
            generator.createIdentifier("value"),
            [],
            undefined,
            undefined
          );
          property.prefix = "_";

          const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div"),
              undefined,
              []
            ),
            [
              generator.createJsxExpression(
                undefined,
                generator.createConditional(
                  generator.createIdentifier("condition"),
                  thenStatement,
                  elseStatement
                )
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          assert.strictEqual(
            removeSpaces(
              expression.children[0].toString({
                componentContext: "viewModel",
                newComponentContext: "",
                members: [property],
              })
            ),
            removeSpaces(
              `<template v-if="condition">{{_value}}</template><template v-else>{{!_value}}</template>`
            )
          );
        }
      );

      mocha.it(
        "condition?<element>:expr - <element><template>{expr}</template>'",
        function () {
          const thenStatement = generator.createJsxSelfClosingElement(
            generator.createIdentifier("input"),
            [],
            []
          );

          const elseStatement = generator.createPropertyAccess(
            generator.createPropertyAccess(
              generator.createIdentifier("model"),
              generator.createIdentifier("props")
            ),
            generator.createIdentifier("value")
          );

          const property = generator.createProperty(
            [createDecorator("Template")],
            [],
            generator.createIdentifier("template")
          );

          generator.createJsxExpression(
            undefined,
            generator.createConditional(
              generator.createIdentifier("condition"),
              thenStatement,
              elseStatement
            )
          );

          const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div"),
              undefined,
              []
            ),
            [
              generator.createJsxExpression(
                undefined,
                generator.createConditional(
                  generator.createIdentifier("condition"),
                  generator.createJsxSelfClosingElement(
                    generator.createPropertyAccess(
                      generator.createPropertyAccess(
                        generator.createIdentifier("model"),
                        generator.createIdentifier("props")
                      ),
                      generator.createIdentifier("template")
                    ),
                    undefined,
                    [
                      generator.createJsxAttribute(
                        generator.createIdentifier("text"),
                        generator.createJsxExpression(
                          undefined,
                          generator.createPropertyAccess(
                            generator.createPropertyAccess(
                              generator.createIdentifier("model"),
                              generator.createIdentifier("props")
                            ),
                            generator.createIdentifier("text")
                          )
                        )
                      ),
                    ]
                  ),
                  generator.createIdentifier("text")
                )
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          assert.strictEqual(
            removeSpaces(
              expression.children[0].toString({
                componentContext: "model",
                newComponentContext: "",
                members: [property],
              })
            ),
            removeSpaces(`
                    <slot name="template" v-bind:text="props.text" v-if="condition"></slot>
                    <template v-else>{{text}}</template>
                `)
          );
        }
      );

      mocha.describe("Slots with conditional rendering", function () {
        this.beforeEach(function () {
          this.slotProperty = generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("children"),
            generator.SyntaxKind.QuestionToken,
            undefined,
            undefined
          );

          this.slotExpression = generator.createPropertyAccess(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("props")
            ),
            generator.createIdentifier("children")
          );

          this.toStringOptions = {
            members: [this.slotProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          } as toStringOptions;
        });

        function createElement(children: JsxExpression[]) {
          return generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div"),
              undefined,
              []
            ),
            children,
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );
        }

        mocha.it("slot? slot: alternative content", function () {
          const element = createElement([
            generator.createJsxExpression(
              undefined,
              generator.createConditional(
                this.slotExpression,
                this.slotExpression,
                generator.createIdentifier("alternative")
              )
            ),
          ]);

          assert.strictEqual(
            removeSpaces(element.children[0].toString(this.toStringOptions)),
            removeSpaces(`
                     <template v-if="$slots.default"><slot></slot></template>
                     <template v-else>{{alternative}}</template>
                  `)
          );
        });

        mocha.it("render slot if template is not exist", function () {
          const element = createElement([
            generator.createJsxExpression(
              undefined,
              generator.createBinary(
                generator.createPrefix(
                  generator.SyntaxKind.ExclamationToken,
                  generator.createIdentifier("template")
                ),
                generator.SyntaxKind.AmpersandAmpersandToken,
                this.slotExpression
              )
            ),
          ]);

          const templateProperty = generator.createProperty(
            [createDecorator(Decorators.Template)],
            [],
            generator.createIdentifier("template")
          );

          assert.strictEqual(
            removeSpaces(
              element.children[0].toString({
                ...this.toStringOptions,
                members: [...this.toStringOptions.members, templateProperty],
                variables: {
                  template: generator.createPropertyAccess(
                    generator.createPropertyAccess(
                      generator.createIdentifier("viewModel"),
                      generator.createIdentifier("props")
                    ),
                    generator.createIdentifier("template")
                  ),
                },
              })
            ),
            removeSpaces(`
                        <template v-if="!$scopedSlots.template"><slot></slot></template>
                  `)
          );
        });
      });
    });

    mocha.describe("Parse Map function", function () {
      mocha.it(".map((item)=><div>) -> v-for", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createCall(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("items")
                  ),
                  generator.createIdentifier("map")
                ),
                undefined,
                [
                  generator.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      generator.createParameter(
                        undefined,
                        undefined,
                        undefined,
                        generator.createIdentifier("items"),
                        undefined,
                        undefined,
                        undefined
                      ),
                    ],
                    undefined,
                    generator.createToken(
                      generator.SyntaxKind.EqualsGreaterThanToken
                    ),
                    generator.createJsxElement(
                      generator.createJsxOpeningElement(
                        generator.createIdentifier("div"),
                        undefined,
                        generator.createJsxAttributes([])
                      ),
                      [],
                      generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                      )
                    )
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(
          expression.children[0].toString(),
          `<div v-for="items of viewModel.items"></div>`
        );
      });

      mocha.it(".map((item)=>item) -> *ngFor", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createCall(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("items")
                  ),
                  generator.createIdentifier("map")
                ),
                undefined,
                [
                  generator.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      generator.createParameter(
                        undefined,
                        undefined,
                        undefined,
                        generator.createIdentifier("items"),
                        undefined,
                        undefined,
                        undefined
                      ),
                    ],
                    undefined,
                    generator.createToken(
                      generator.SyntaxKind.EqualsGreaterThanToken
                    ),
                    generator.createIdentifier("items")
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(
          expression.children[0].toString(),
          `<template v-for="items of viewModel.items">{{items}}</template>`
        );
      });

      mocha.it(".map((item)=>{}) -> empty string", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createCall(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("items")
                  ),
                  generator.createIdentifier("map")
                ),
                undefined,
                [
                  generator.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      generator.createParameter(
                        undefined,
                        undefined,
                        undefined,
                        generator.createIdentifier("items"),
                        undefined,
                        undefined,
                        undefined
                      ),
                    ],
                    undefined,
                    generator.createToken(
                      generator.SyntaxKind.EqualsGreaterThanToken
                    ),
                    generator.createBlock([], false)
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(expression.children[0].toString(), "");
      });

      mocha.it(
        ".map((item, index)=><div>) -> v-for='(item, index) of items'",
        function () {
          const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div"),
              undefined,
              []
            ),
            [
              generator.createJsxExpression(
                undefined,
                generator.createCall(
                  generator.createPropertyAccess(
                    generator.createPropertyAccess(
                      generator.createIdentifier("viewModel"),
                      generator.createIdentifier("items")
                    ),
                    generator.createIdentifier("map")
                  ),
                  undefined,
                  [
                    generator.createArrowFunction(
                      undefined,
                      undefined,
                      [
                        generator.createParameter(
                          undefined,
                          undefined,
                          undefined,
                          generator.createIdentifier("items"),
                          undefined,
                          undefined,
                          undefined
                        ),
                        generator.createParameter(
                          undefined,
                          undefined,
                          undefined,
                          generator.createIdentifier("i"),
                          undefined,
                          undefined,
                          undefined
                        ),
                      ],
                      undefined,
                      generator.createToken(
                        generator.SyntaxKind.EqualsGreaterThanToken
                      ),
                      generator.createJsxElement(
                        generator.createJsxOpeningElement(
                          generator.createIdentifier("div"),
                          undefined,
                          generator.createJsxAttributes([])
                        ),
                        [],
                        generator.createJsxClosingElement(
                          generator.createIdentifier("div")
                        )
                      )
                    ),
                  ]
                )
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          assert.strictEqual(
            expression.children[0].toString(),
            `<div v-for="(items,i) of viewModel.items"></div>`
          );
        }
      );

      mocha.it("map with key attribute", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createCall(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("items")
                  ),
                  generator.createIdentifier("map")
                ),
                undefined,
                [
                  generator.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      generator.createParameter(
                        undefined,
                        undefined,
                        undefined,
                        generator.createIdentifier("item"),
                        undefined,
                        undefined,
                        undefined
                      ),
                    ],
                    undefined,
                    generator.createToken(
                      generator.SyntaxKind.EqualsGreaterThanToken
                    ),
                    generator.createJsxElement(
                      generator.createJsxOpeningElement(
                        generator.createIdentifier("div"),
                        undefined,
                        generator.createJsxAttributes([
                          generator.createJsxAttribute(
                            generator.createIdentifier("key"),
                            generator.createPropertyAccess(
                              generator.createIdentifier("item"),
                              generator.createIdentifier("id")
                            )
                          ),
                        ])
                      ),
                      [],
                      generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                      )
                    )
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(
          removeSpaces(expression.children[0].toString()),
          removeSpaces(
            `<div :key="item.id" v-for="item of viewModel.items"></div>`
          )
        );
      });

      mocha.it("map inside an other map", function () {
        const insideExpression = generator.createCall(
          generator.createPropertyAccess(
            generator.createIdentifier("item"),
            generator.createIdentifier("map")
          ),
          undefined,
          [
            generator.createArrowFunction(
              undefined,
              undefined,
              [
                generator.createParameter(
                  undefined,
                  undefined,
                  undefined,
                  generator.createIdentifier("_"),
                  undefined,
                  undefined,
                  undefined
                ),
                generator.createParameter(
                  undefined,
                  undefined,
                  undefined,
                  generator.createIdentifier("i"),
                  undefined,
                  undefined,
                  undefined
                ),
              ],
              undefined,
              generator.createToken(
                generator.SyntaxKind.EqualsGreaterThanToken
              ),
              generator.createJsxElement(
                generator.createJsxOpeningElement(
                  generator.createIdentifier("div"),
                  undefined,
                  generator.createJsxAttributes([
                    generator.createJsxAttribute(
                      generator.createIdentifier("key"),
                      generator.createIdentifier("i")
                    ),
                  ])
                ),
                [],
                generator.createJsxClosingElement(
                  generator.createIdentifier("div")
                )
              )
            ),
          ]
        );

        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createCall(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("items")
                  ),
                  generator.createIdentifier("map")
                ),
                undefined,
                [
                  generator.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      generator.createParameter(
                        undefined,
                        undefined,
                        undefined,
                        generator.createIdentifier("item"),
                        undefined,
                        undefined,
                        undefined
                      ),
                    ],
                    undefined,
                    generator.createToken(
                      generator.SyntaxKind.EqualsGreaterThanToken
                    ),
                    generator.createJsxElement(
                      generator.createJsxOpeningElement(
                        generator.createIdentifier("div"),
                        undefined,
                        generator.createJsxAttributes([
                          generator.createJsxAttribute(
                            generator.createIdentifier("key"),
                            generator.createPropertyAccess(
                              generator.createIdentifier("item"),
                              generator.createIdentifier("id")
                            )
                          ),
                        ])
                      ),
                      [
                        generator.createJsxExpression(
                          undefined,
                          insideExpression
                        ),
                      ],
                      generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                      )
                    )
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        ).children[0] as JsxExpression;

        assert.strictEqual(
          removeSpaces(expression.toString()),
          removeSpaces(
            `<div :key="item.id" v-for="item of viewModel.items">
                            <div :key="i" v-for="(_,i) of item"></div>
                        </div>`
          )
        );
      });

      mocha.it("Parse map with destruction", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createCall(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("items")
                  ),
                  generator.createIdentifier("map")
                ),
                undefined,
                [
                  generator.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      generator.createParameter(
                        undefined,
                        undefined,
                        undefined,
                        generator.createObjectBindingPattern([
                          generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("p1")
                          ),
                          generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("p2")
                          ),
                        ]),
                        undefined,
                        undefined,
                        undefined
                      ),
                    ],
                    undefined,
                    generator.createToken(
                      generator.SyntaxKind.EqualsGreaterThanToken
                    ),
                    generator.createJsxElement(
                      generator.createJsxOpeningElement(
                        generator.createIdentifier("div"),
                        undefined,
                        generator.createJsxAttributes([])
                      ),
                      [
                        generator.createJsxExpression(
                          undefined,
                          generator.createIdentifier("p1")
                        ),
                        generator.createJsxExpression(
                          undefined,
                          generator.createIdentifier("p2")
                        ),
                      ],
                      generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                      )
                    )
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        const property = generator.createProperty(
          [createDecorator("OneWay")],
          undefined,
          generator.createIdentifier("p1")
        );

        assert.strictEqual(
          expression.children[0].toString({
            members: [property],
            componentContext: "model",
            newComponentContext: "",
          }),
          `<div v-for="{p1,p2} of viewModel.items">{{p1}}{{p2}}</div>`
        );
      });
    });

    mocha.describe("Template", function () {
      mocha.it("<template/> -> <slot></slot>", function () {
        const expression = generator.createJsxSelfClosingElement(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier("template")
          ),
          [],
          []
        );

        const templateProperty = generator.createProperty(
          [createDecorator("Template")],
          [],
          generator.createIdentifier("template"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          undefined
        );

        assert.strictEqual(
          expression.toString({
            members: [templateProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          `<slot name="template" ></slot>`
        );
      });

      mocha.it("Template with parameters", function () {
        const expression = generator.createJsxSelfClosingElement(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier("template")
          ),
          [],
          [
            generator.createJsxAttribute(
              generator.createIdentifier("p1"),
              generator.createNumericLiteral("10")
            ),
            generator.createJsxAttribute(
              generator.createIdentifier("p2"),
              generator.createStringLiteral("11")
            ),
          ]
        );

        const templateProperty = generator.createProperty(
          [createDecorator("Template")],
          [],
          generator.createIdentifier("template"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          undefined
        );

        assert.strictEqual(
          expression.toString({
            members: [templateProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          `<slot name="template" v-bind:p1="10" v-bind:p2="'11'"></slot>`
        );
      });

      mocha.it("<template></template> -> <slot></slot>", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("template")
            ),
            undefined,
            []
          ),
          [],
          generator.createJsxClosingElement(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("template")
            )
          )
        );

        const templateProperty = generator.createProperty(
          [createDecorator("Template")],
          [],
          generator.createIdentifier("template"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          undefined
        );

        assert.strictEqual(
          expression.toString({
            members: [templateProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          `<slot name="template" ></slot>`
        );
      });

      mocha.it("Template with spread attribute", function () {
        const expression = generator.createJsxSelfClosingElement(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier("template")
          ),
          [],
          [
            generator.createJsxSpreadAttribute(
              generator.createIdentifier("item")
            ),
          ]
        );

        const templateProperty = generator.createProperty(
          [createDecorator("Template")],
          [],
          generator.createIdentifier("template"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          undefined
        );

        assert.strictEqual(
          expression.toString({
            members: [templateProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          `<slot name="template" v-bind="item"></slot>`
        );
      });

      mocha.it("Template with condition", function () {
        const expression = generator.createJsxSelfClosingElement(
          generator.createPropertyAccess(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("props")
            ),
            generator.createIdentifier("template")
          ),
          [],
          []
        );

        const element = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createBinary(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("props")
                  ),
                  generator.createIdentifier("template")
                ),
                generator.SyntaxKind.AmpersandAmpersandToken,
                expression
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        const templateProperty = generator.createProperty(
          [createDecorator("Template")],
          [],
          generator.createIdentifier("template"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          undefined
        );

        assert.strictEqual(
          element.children[0].toString({
            members: [templateProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          `<slot name="template" v-if="$scopedSlots.template"></slot>`
        );
      });
    });

    mocha.describe("Slot", function () {
      mocha.it("children slot is default", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            [],
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createPropertyAccess(
                generator.createPropertyAccess(
                  generator.createIdentifier("viewModel"),
                  generator.createIdentifier("props")
                ),
                generator.createIdentifier("children")
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        const slotProperty = generator.createProperty(
          [createDecorator("Slot")],
          [],
          generator.createIdentifier("children"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          undefined
        );

        assert.strictEqual(
          expression.toString({
            members: [slotProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          `<div ><slot></slot></div>`
        );
      });

      mocha.it("named slot", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("div"),
            [],
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createPropertyAccess(
                generator.createPropertyAccess(
                  generator.createIdentifier("viewModel"),
                  generator.createIdentifier("props")
                ),
                generator.createIdentifier("slotName")
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        const slotProperty = generator.createProperty(
          [createDecorator("Slot")],
          [],
          generator.createIdentifier("slotName"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          undefined
        );

        assert.strictEqual(
          expression.toString({
            members: [slotProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          `<div ><slot name="slotName"></slot></div>`
        );
      });
    });

    mocha.describe("Import widget.", function () {
      this.beforeEach(function () {
        generator.setContext({
          dirname: __dirname,
        });
        generator.createImportDeclaration(
          [],
          [],
          generator.createImportClause(
            generator.createIdentifier("DxWidget"),
            undefined
          ),
          generator.createStringLiteral(
            "./test-cases/declarations/src/component-input"
          )
        );
      });

      this.afterEach(function () {
        generator.setContext(null);
      });

      mocha.it("<DxWidget></DxWidget> -> <dx-widget></dx-widget>", function () {
        const element = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("DxWidget")
          ),
          [],
          generator.createJsxClosingElement(
            generator.createIdentifier("DxWidget")
          )
        );

        assert.strictEqual(element.toString(), "<DxWidget ></DxWidget>");
      });

      mocha.it("<DxWidget/> -> <dx-widget/>", function () {
        const element = generator.createJsxSelfClosingElement(
          generator.createIdentifier("DxWidget"),
          []
        );

        assert.strictEqual(element.toString(), "<DxWidget />");
      });

      mocha.it("Process eventChange - @event-change", function () {
        generator.createClassDeclaration(
          [createComponentDecorator({})],
          [],
          generator.createIdentifier("Widget"),
          [],
          [],
          [
            generator.createProperty(
              [createDecorator("Event")],
              [],
              generator.createIdentifier("eventChange"),
              undefined,
              undefined,
              undefined
            ),
          ]
        );

        const element = generator.createJsxSelfClosingElement(
          generator.createIdentifier("Widget"),
          [],
          [
            generator.createJsxAttribute(
              generator.createIdentifier("eventChange"),
              generator.createIdentifier("value")
            ),
          ]
        );

        assert.strictEqual(
          element.toString({
            members: [],
          }),
          `<Widget @event-change="value"/>`
        );
      });

      mocha.it(
        "Process statePropChange - @update:state-prop if stateProp is TwoWay prop",
        function () {
          generator.createClassDeclaration(
            [createComponentDecorator({})],
            [],
            generator.createIdentifier("Widget"),
            [],
            [],
            [
              generator.createProperty(
                [createDecorator("Event")],
                [],
                generator.createIdentifier("statePropChange"),
                undefined,
                undefined,
                undefined
              ),
              generator.createProperty(
                [createDecorator("TwoWay")],
                [],
                generator.createIdentifier("stateProp")
              ),
            ]
          );

          const element = generator.createJsxSelfClosingElement(
            generator.createIdentifier("Widget"),
            [],
            [
              generator.createJsxAttribute(
                generator.createIdentifier("statePropChange"),
                generator.createIdentifier("value")
              ),
            ]
          );

          assert.strictEqual(
            element.toString({
              members: [],
            }),
            `<Widget @update:state-prop="value"/>`
          );
        }
      );

      mocha.describe("Pass slots via attribute", function () {
        this.beforeEach(function () {
          generator.setContext({
            dirname: __dirname,
          });

          const defaultSlot = generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("children")
          );

          const namedSlot = generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("namedSlot")
          );

          generator.createClassDeclaration(
            [createComponentDecorator({})],
            [],
            generator.createIdentifier("Widget"),
            [],
            [],
            [defaultSlot, namedSlot]
          );
        });

        this.afterEach(function () {
          generator.setContext(null);
        });

        mocha.it("Self-closing element", function () {
          const slotProperty = generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("children")
          );
          const element = generator.createJsxSelfClosingElement(
            generator.createIdentifier("Widget"),
            [],
            [
              generator.createJsxAttribute(
                generator.createIdentifier("children"),
                generator.createPropertyAccess(
                  generator.createIdentifier("props"),
                  generator.createIdentifier("children")
                )
              ),
            ]
          );

          assert.strictEqual(
            element.toString({
              componentContext: "",
              newComponentContext: "",
              members: [slotProperty],
            }),
            `<Widget ><slot></slot></Widget>`
          );
        });

        mocha.it("Self-closing element with two slots", function () {
          const slotProperty = generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("children")
          );

          const namedSlot = generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("namedSlot")
          );

          const element = generator.createJsxSelfClosingElement(
            generator.createIdentifier("Widget"),
            [],
            [
              generator.createJsxAttribute(
                generator.createIdentifier("children"),
                generator.createPropertyAccess(
                  generator.createIdentifier("props"),
                  generator.createIdentifier("children")
                )
              ),
              generator.createJsxAttribute(
                generator.createIdentifier("namedSlot"),
                generator.createPropertyAccess(
                  generator.createIdentifier("props"),
                  generator.createIdentifier("namedSlot")
                )
              ),
            ]
          );

          assert.strictEqual(
            element.toString({
              componentContext: "",
              newComponentContext: "",
              members: [slotProperty, namedSlot],
            }),
            `<Widget ><slot></slot><slot name="namedSlot"></slot></Widget>`
          );
        });

        mocha.it("spread props with slot", function () {
          const slotProperty = generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("children")
          );
          const element = generator.createJsxSelfClosingElement(
            generator.createIdentifier("Widget"),
            [],
            [
              generator.createJsxSpreadAttribute(
                generator.createPropertyAccess(
                  generator.createIdentifier(generator.SyntaxKind.ThisKeyword),
                  generator.createIdentifier("props")
                )
              ),
            ]
          );

          assert.strictEqual(
            element.toString({
              componentContext: "this",
              newComponentContext: "",
              members: [slotProperty],
            }),
            `<Widget v-bind="{...props,...{children:undefined}}"><slot></slot></Widget>`
          );
        });

        mocha.it("element with closing tag", function () {
          const slotProperty = generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("children")
          );

          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("Widget"),
              [],
              [
                generator.createJsxAttribute(
                  generator.createIdentifier("children"),
                  generator.createPropertyAccess(
                    generator.createIdentifier("props"),
                    generator.createIdentifier("children")
                  )
                ),
              ]
            ),
            [
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("span")
              ),
            ],
            generator.createJsxClosingElement(
              generator.createIdentifier("Widget")
            )
          );

          assert.strictEqual(
            element.toString({
              componentContext: "",
              newComponentContext: "",
              members: [slotProperty],
            }),
            `<Widget ><span /><slot></slot></Widget>`
          );
        });
      });

      mocha.describe("Pass Widget to template property", function () {
        const getComponent = () =>
          generator.createClassDeclaration(
            [createDecorator(Decorators.Component)],
            [],
            generator.createIdentifier("ComponentWithTemplate"),
            [],
            [],
            [
              generator.createProperty(
                [createDecorator(Decorators.Template)],
                [],
                generator.createIdentifier("contentTemplate")
              ),
            ]
          );

        mocha.it(
          "Pass widget into template. self-closing element",
          function () {
            const component = getComponent();

            const element = generator.createJsxSelfClosingElement(
              generator.createIdentifier("ComponentWithTemplate"),
              [],
              [
                generator.createJsxAttribute(
                  generator.createIdentifier("contentTemplate"),
                  generator.createIdentifier("DxWidget")
                ),
              ]
            );

            assert.strictEqual(
              removeSpaces(
                element.toString({
                  members: component.members,
                })
              ),
              removeSpaces(`
                        <ComponentWithTemplate>
                            <template v-slot:contentTemplate="slotProps">
                                <DxWidget :height="slotProps.height"
                                    :width="slotProps.width"
                                    :children="slotProps.children"/>
                            </template>
                        </ComponentWithTemplate>
                    `)
            );
          }
        );

        mocha.it("Pass widget into template. Element", function () {
          const component = getComponent();

          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("ComponentWithTemplate"),
              [],
              [
                generator.createJsxAttribute(
                  generator.createIdentifier("contentTemplate"),
                  generator.createIdentifier("DxWidget")
                ),
              ]
            ),
            [],
            generator.createJsxClosingElement(
              generator.createIdentifier("ComponentWithTemplate")
            )
          );

          assert.strictEqual(
            removeSpaces(
              element.toString({
                members: component.members,
              })
            ),
            removeSpaces(`
                        <ComponentWithTemplate>
                            <template v-slot:contentTemplate="slotProps">
                                <DxWidget 
                                    :height="slotProps.height"
                                    :width="slotProps.width"
                                    :children="slotProps.children"/>
                            </template>
                        </ComponentWithTemplate>
                    `)
          );
        });
      });
    });
  });
});
