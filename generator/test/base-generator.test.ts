import assert from "assert";
import mocha from "./helpers/mocha";
import Generator from "../base-generator";
import {
  printSourceCodeAst as getAst,
  assertCode,
  removeSpaces,
} from "./helpers/common";
import {
  Expression,
  SimpleExpression,
} from "../base-generator/expressions/base";
import ts from "typescript";
import {
  ElementAccess,
  PropertyAccess,
} from "../base-generator/expressions/property-access";
import { Class } from "../base-generator/expressions/class";
import { ComponentInput } from "../base-generator/expressions/component-input";
import { Component, getProps } from "../base-generator/expressions/component";
import { ImportDeclaration } from "../base-generator/expressions/import";
import sinon from "sinon";

import path from "path";

const generator = new Generator();

import componentCreator from "./helpers/create-component";
import { toStringOptions } from "../base-generator/types";
import { BindingPattern } from "../base-generator/expressions/binding-pattern";
import { Property, Method } from "../base-generator/expressions/class-members";
import { Decorators } from "../component_declaration/decorators";
import { TypeExpression } from "../base-generator/expressions/type";

const { createComponentDecorator, createDecorator } = componentCreator(
  generator
);

mocha.describe("base-generator: expressions", function () {
  mocha.describe("Base Expressions", function () {
    mocha.it("Expression", function () {
      const expression = new Expression();

      assert.strictEqual(expression.toString(), "");
      assert.deepEqual(expression.getDependency(), []);
      assert.deepEqual(expression.getAllDependency(), []);
    });
  });

  mocha.describe("common expressions", function () {
    mocha.it("Identifier", function () {
      const identifier = generator.createIdentifier("a");
      assert.equal(identifier, "a");
      assert.deepEqual(identifier.getDependency(), []);
    });

    mocha.it("createVoid", function () {
      const expression = generator.createVoid(
        generator.createNumericLiteral("0")
      );

      assert.strictEqual(expression.toString(), "void 0");
    });

    mocha.it("createTypeOf", function () {
      const expression = generator.createTypeOf(
        generator.createIdentifier("b")
      );

      assert.strictEqual(expression.toString(), "typeof b");
    });

    mocha.it("NonNullExpression", function () {
      const expression = generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("field")
      );
      assert.equal(
        generator.createNonNullExpression(expression).toString(),
        "this.field!"
      );
    });

    mocha.it("createNew", function () {
      assert.equal(
        generator
          .createNew(generator.createIdentifier("a"), undefined, [
            generator.createStringLiteral("a"),
            generator.createNumericLiteral("10"),
          ])
          .toString(),
        'new a("a",10)'
      );
    });

    mocha.it("Call", function () {
      assert.equal(
        generator
          .createCall(generator.createIdentifier("a"), undefined, [
            generator.createStringLiteral("a"),
            generator.createNumericLiteral("10"),
          ])
          .toString(),
        'a("a",10)'
      );
    });

    mocha.it("Call with typeArguments", function () {
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
        "a<TypeParameter>()"
      );
    });

    mocha.it("createCallChain", function () {
      const expression = generator.createCallChain(
        generator.createPropertyAccessChain(
          generator.createIdentifier("model"),
          generator.createToken(generator.SyntaxKind.QuestionDotToken),
          generator.createIdentifier("onClick")
        ),
        undefined,
        undefined,
        [generator.createIdentifier("e")]
      );

      assert.deepEqual(expression.toString(), "model?.onClick(e)");
      assert.deepEqual(expression.getDependency(), []);
    });

    mocha.it(
      "createCallChain without question mark and parameters",
      function () {
        const expression = generator.createCallChain(
          generator.createPropertyAccessChain(
            generator.createIdentifier("model"),
            undefined,
            generator.createIdentifier("onClick")
          ),
          undefined,
          undefined,
          undefined
        );

        assert.deepEqual(expression.toString(), "model.onClick()");
        assert.deepEqual(expression.getDependency(), []);
      }
    );

    mocha.it("Paren", function () {
      assert.equal(
        generator.createParen(generator.createIdentifier("a")).toString(),
        "(a)"
      );
    });

    mocha.it("createDelete", function () {
      assert.equal(
        generator
          .createDelete(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("field")
            )
          )
          .toString(),
        "delete this.field"
      );
    });

    mocha.it("createAsExpression", function () {
      const expression = generator.createAsExpression(
        generator.createThis(),
        generator.createKeywordTypeNode(generator.SyntaxKind.AnyKeyword)
      );

      assert.strictEqual(expression.toString(), "this as any");
    });

    mocha.it("Throw", function () {
      const property = generator.createProperty(
        [createDecorator(Decorators.OneWay)],
        [],
        generator.createIdentifier("p")
      );

      const expression = generator.createThrow(
        generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("p")
        )
      );

      assert.strictEqual(
        expression.toString({
          componentContext: generator.SyntaxKind.ThisKeyword,
          newComponentContext: "",
          members: [property],
        }),
        "throw p"
      );

      assert.deepEqual(expression.getDependency(), ["p"]);
    });
  });

  mocha.describe("literal expressions", function () {
    mocha.it("createStringLiteral", function () {
      assert.strictEqual(generator.createStringLiteral("a").toString(), `"a"`);
      assert.strictEqual(
        generator.createStringLiteral('"a"').toString(),
        `"\\"a\\""`,
        "double quote in string"
      );
      assert.strictEqual(
        generator.createStringLiteral('"a"').toString(),
        `"\\"a\\""`,
        "double quote with backslash in string"
      );
    });

    mocha.it("createNumericLiteral", function () {
      assert.strictEqual(generator.createNumericLiteral("10").toString(), "10");
    });

    mocha.it("ArrayLiteral", function () {
      assert.equal(
        generator
          .createArrayLiteral(
            [
              generator.createNumericLiteral("1"),
              generator.createIdentifier("a"),
            ],
            true
          )
          .toString(),
        "[1,a]"
      );
    });

    mocha.it("createArrayTypeNode", function () {
      assert.strictEqual(
        generator
          .createArrayTypeNode(
            generator.createKeywordTypeNode(generator.SyntaxKind.NumberKeyword)
          )
          .toString(),
        "number[]"
      );
    });

    mocha.it("createLiteralTypeNode", function () {
      assert.strictEqual(
        generator
          .createLiteralTypeNode(generator.createStringLiteral("2"))
          .toString(),
        '"2"'
      );
    });

    mocha.describe("ObjectLiteral", function () {
      mocha.it("createObjectLiteral", function () {
        const objectLiteral = generator.createObjectLiteral(
          [
            generator.createShorthandPropertyAssignment(
              generator.createIdentifier("a"),
              undefined
            ),
            generator.createPropertyAssignment(
              generator.createIdentifier("k"),
              generator.createIdentifier("a")
            ),
            generator.createSpreadAssignment(generator.createIdentifier("obj")),
          ],
          true
        );
        assert.equal(objectLiteral.toString(), "{a,\nk:a,\n...obj}");
      });

      mocha.it("ObjectLiteral: Can remove property", function () {
        const objectLiteral = generator.createObjectLiteral(
          [
            generator.createShorthandPropertyAssignment(
              generator.createIdentifier("a"),
              undefined
            ),
            generator.createPropertyAssignment(
              generator.createIdentifier("k"),
              generator.createIdentifier("a")
            ),
            generator.createSpreadAssignment(generator.createIdentifier("obj")),
          ],
          true
        );

        objectLiteral.removeProperty("k");

        assert.equal(objectLiteral.toString(), "{a,\n...obj}");
      });

      mocha.it("can use computed property", function () {
        const property = generator.createProperty(
          [],
          [],
          generator.createIdentifier("p")
        );

        const expression = generator.createObjectLiteral(
          [
            generator.createPropertyAssignment(
              generator.createComputedPropertyName(
                generator.createPropertyAccess(
                  generator.createThis(),
                  generator.createIdentifier("p")
                )
              ),
              generator.createIdentifier("v")
            ),
          ],
          false
        );

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: "this",
            newComponentContext: "",
          }),
          "{[p]:v}"
        );

        assert.deepEqual(expression.getDependency(), ["p"]);
      });
    });

    mocha.it("createRegularExpressionLiteral", function () {
      const expression = generator.createRegularExpressionLiteral("/d+/");

      assert.strictEqual(expression.toString(), "/d+/");
    });
  });

  mocha.describe("Operators", function () {
    mocha.it("Binary", function () {
      const expression = generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("field")
      );

      assert.equal(
        generator
          .createBinary(
            expression,
            generator.SyntaxKind.EqualsToken,
            expression
          )
          .toString(),
        "this.field = this.field"
      );
    });

    mocha.it("instanceof", function () {
      const expression = generator.createBinary(
        generator.createIdentifier("a"),
        generator.SyntaxKind.InstanceOfKeyword,
        generator.createIdentifier("b")
      );

      assert.equal(expression.toString(), "a instanceof b");
    });

    mocha.it("Prefix", function () {
      const expression = generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("field")
      );
      assert.equal(
        generator
          .createPrefix(generator.SyntaxKind.ExclamationToken, expression)
          .toString(),
        "!this.field"
      );
    });

    mocha.it("Postfix", function () {
      const expression = generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("field")
      );
      assert.equal(
        generator
          .createPostfix(expression, generator.SyntaxKind.PlusPlusToken)
          .toString(),
        "this.field++"
      );
    });
  });

  mocha.describe("Type expressions", function () {
    mocha.it("TypeQueryNode", function () {
      const expression = generator.createTypeQueryNode(
        generator.createIdentifier("Component")
      );

      assert.strictEqual(expression.toString(), "typeof Component");
    });

    mocha.it("TypeReferenceNode", function () {
      const expression = generator.createTypeReferenceNode(
        generator.createIdentifier("Node"),
        []
      );

      assert.equal(expression.toString(), "Node");
    });

    mocha.it("TypeReferenceNode with typeArguments", function () {
      const expression = generator.createTypeReferenceNode(
        generator.createIdentifier("Node"),
        [
          generator.createArrayTypeNode(
            generator.createKeywordTypeNode("string")
          ),
          generator.createArrayTypeNode(
            generator.createKeywordTypeNode("number")
          ),
        ]
      );

      assert.equal(expression.toString(), "Node<string[],number[]>");
    });

    mocha.it("createTypeLiteralNode", function () {
      const propertySignatureWithQuestionToken = generator.createPropertySignature(
        [],
        generator.createIdentifier("a"),
        generator.SyntaxKind.QuestionToken,
        generator.createKeywordTypeNode("string")
      );

      const propertySignatureWithoutQuestionToken = generator.createPropertySignature(
        [],
        generator.createIdentifier("b"),
        undefined,
        generator.createKeywordTypeNode("string")
      );

      assert.equal(
        generator.createTypeLiteralNode([
          propertySignatureWithQuestionToken,
          propertySignatureWithoutQuestionToken,
        ]),
        "{a?:string,b:string}"
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

      assert.strictEqual(
        expression.toString(),
        "export declare type Name = {b:string}"
      );
    });

    mocha.it("createTypeAliasDeclaration with TypeParameters", function () {
      const expression = generator.createTypeAliasDeclaration(
        undefined,
        undefined,
        generator.createIdentifier("Name"),
        [
          generator.createTypeParameterDeclaration(
            generator.createIdentifier("T")
          ),
        ],
        generator.createTypeReferenceNode(generator.createIdentifier("T"))
      );

      assert.strictEqual(expression.toString(), " type Name<T> = T");
    });

    mocha.it("createTypeAliasDeclaration without modifiers", function () {
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
        undefined,
        generator.createIdentifier("Name"),
        [],
        literalNode
      );

      assert.strictEqual(expression.toString(), " type Name = {b:string}");
    });

    mocha.it("createIndexedAccessTypeNode", function () {
      const expression = generator.createIndexedAccessTypeNode(
        generator.createTypeReferenceNode(
          generator.createIdentifier("PageIndex"),
          undefined
        ),
        generator.createLiteralTypeNode(generator.createStringLiteral("1"))
      );

      assert.strictEqual(expression.toString(), `PageIndex["1"]`);
    });

    mocha.it("createIntersectionTypeNode", function () {
      assert.equal(
        generator.createIntersectionTypeNode([
          generator.createKeywordTypeNode("string"),
          generator.createKeywordTypeNode("number"),
        ]),
        "string&number"
      );
    });

    mocha.it("createUnionTypeNode", function () {
      assert.equal(
        generator.createUnionTypeNode([
          generator.createKeywordTypeNode("string"),
          generator.createKeywordTypeNode("number"),
        ]),
        "string|number"
      );
    });

    mocha.it("createTypeOperatorNode", function () {
      assert.equal(
        generator.createTypeOperatorNode(
          generator.createKeywordTypeNode("number")
        ),
        "keyof number"
      );
    });

    mocha.it("createParenthesizedType", function () {
      assert.equal(
        generator.createParenthesizedType(
          generator.createKeywordTypeNode("string")
        ),
        "(string)"
      );
    });

    mocha.describe("createPropertySignature", function () {
      mocha.it("Only name is defined", function () {
        assert.strictEqual(
          generator
            .createPropertySignature(
              undefined,
              generator.createIdentifier("a"),
              undefined
            )
            .toString(),
          "a"
        );
      });

      mocha.it("with type", function () {
        assert.strictEqual(
          generator
            .createPropertySignature(
              undefined,
              generator.createIdentifier("a"),
              undefined,
              generator.createKeywordTypeNode("string")
            )
            .toString(),
          "a:string"
        );
      });

      mocha.it("with question token token", function () {
        assert.strictEqual(
          generator
            .createPropertySignature(
              undefined,
              generator.createIdentifier("a"),
              generator.SyntaxKind.QuestionToken,
              generator.createKeywordTypeNode("string")
            )
            .toString(),
          "a?:string"
        );
      });

      mocha.it("with initializer", function () {
        assert.strictEqual(
          generator
            .createPropertySignature(
              undefined,
              generator.createIdentifier("a"),
              generator.SyntaxKind.QuestionToken,
              generator.createKeywordTypeNode("number"),
              generator.createNumericLiteral("10")
            )
            .toString(),
          "a?:number=10"
        );
      });

      mocha.it("ExpressionWithTypeArguments with type arguments", function () {
        const expression = generator.createExpressionWithTypeArguments(
          [
            generator.createTypeReferenceNode(
              generator.createIdentifier("WidgetProps"),
              undefined
            ),
          ],
          generator.createIdentifier("JSXComponent")
        );

        assert.strictEqual(expression.toString(), "JSXComponent<WidgetProps>");
        assert.strictEqual(expression.type.toString(), "WidgetProps");
      });

      mocha.it(
        "ExpressionWithTypeArguments without type arguments",
        function () {
          const expression = generator.createExpressionWithTypeArguments(
            [],
            generator.createIdentifier("Component")
          );

          assert.strictEqual(expression.toString(), "Component");
          assert.strictEqual(expression.type.toString(), "Component");
        }
      );
    });

    mocha.it("createIndexSignature", function () {
      const expression = generator.createIndexSignature(
        undefined,
        undefined,
        [
          generator.createParameter(
            undefined,
            undefined,
            undefined,
            generator.createIdentifier("name"),
            undefined,
            generator.createKeywordTypeNode(generator.SyntaxKind.StringKeyword),
            undefined
          ),
        ],
        generator.createKeywordTypeNode(generator.SyntaxKind.NumberKeyword)
      );

      assert.equal(expression.toString(), "[name:string]:number");
    });

    mocha.it("createQualifiedName", function () {
      const expression = generator.createQualifiedName(
        generator.createIdentifier("left"),
        generator.createIdentifier("right")
      );

      assert.strictEqual(expression.toString(), "left.right");
    });

    mocha.it("createMethodSignature", function () {
      assert.strictEqual(
        generator
          .createMethodSignature(
            undefined,
            [],
            undefined,
            generator.createIdentifier("name"),
            undefined
          )
          .toString(),
        "name():any"
      );

      assert.strictEqual(
        generator
          .createMethodSignature(
            undefined,
            [],
            generator.createKeywordTypeNode("string"),
            generator.createIdentifier("name"),
            generator.SyntaxKind.QuestionToken
          )
          .toString(),
        "name()?:string"
      );

      assert.strictEqual(
        generator
          .createMethodSignature(
            undefined,
            [
              generator.createParameter(
                undefined,
                undefined,
                undefined,
                generator.createIdentifier("a"),
                undefined,
                generator.createKeywordTypeNode("string")
              ),
              generator.createParameter(
                undefined,
                undefined,
                undefined,
                generator.createIdentifier("b"),
                undefined,
                generator.createKeywordTypeNode("string")
              ),
            ],
            undefined,
            generator.createIdentifier("name"),
            undefined
          )
          .toString(),
        "name(a:string,b:string):any"
      );
    });

    mocha.describe("TypeParameterDeclaration", function () {
      mocha.it("only name is defined", function () {
        const expression = generator.createTypeParameterDeclaration(
          generator.createIdentifier("T")
        );

        assert.strictEqual(expression.toString(), "T");
      });

      mocha.it("with constraint", function () {
        const expression = generator.createTypeParameterDeclaration(
          generator.createIdentifier("T"),
          generator.createTypeReferenceNode(
            generator.createIdentifier("I"),
            undefined
          )
        );

        assert.strictEqual(expression.toString(), "T extends I");
      });

      mocha.it("with default", function () {
        const expression = generator.createTypeParameterDeclaration(
          generator.createIdentifier("T"),
          undefined,
          generator.createTypeReferenceNode(
            generator.createIdentifier("I"),
            undefined
          )
        );

        assert.strictEqual(expression.toString(), "T = I");
      });
    });

    mocha.it("TypePredicateNodeWithModifier", function () {
      assert.strictEqual(
        generator
          .createTypePredicateNodeWithModifier(
            undefined,
            generator.createIdentifier("obj"),
            generator.createTypeReferenceNode(
              generator.createIdentifier("Type")
            )
          )
          .toString(),
        "obj is Type"
      );
    });

    mocha.it("TupleTypeNode", function () {
      assert.strictEqual(
        generator
          .createTupleTypeNode([
            generator.createKeywordTypeNode("string"),
            generator.createKeywordTypeNode("number"),
          ])
          .toString(),
        "[string, number]"
      );
    });

    mocha.it("InferTypeNode", function () {
      assert.strictEqual(
        generator
          .createInferTypeNode(generator.createKeywordTypeNode("string"))
          .toString(),
        "infer string"
      );
    });

    mocha.it("ConditionalTypeNode", function () {
      assert.strictEqual(
        generator
          .createConditionalTypeNode(
            generator.createKeywordTypeNode("c"),
            generator.createKeywordTypeNode("e"),
            generator.createKeywordTypeNode("t"),
            generator.createKeywordTypeNode("f")
          )
          .toString(),
        "c extends e ? t : f"
      );
    });
  });

  mocha.describe("Statements", function () {
    mocha.it("ReturnStatement", function () {
      assert.strictEqual(
        generator.createReturn(generator.createNumericLiteral("10")).toString(),
        "return 10;"
      );
      assert.strictEqual(generator.createReturn().toString(), "return ;");
    });

    mocha.it("createEmptyStatement", function () {
      assert.strictEqual(generator.createEmptyStatement().toString(), "");
    });

    mocha.it("createDebuggerStatement", function () {
      assert.strictEqual(
        generator.createDebuggerStatement().toString(),
        "debugger"
      );
    });

    mocha.it("Block", function () {
      assert.strictEqual(
        generator.createBlock([], true).toString().replace(/\s+/g, ""),
        "{}"
      );
      const expression = generator.createBlock(
        [
          generator.createCall(generator.createIdentifier("i"), undefined, []),
          generator.createReturn(generator.createIdentifier("i")),
        ],
        true
      );

      const actualString = expression.toString();
      assert.strictEqual(getAst(actualString), getAst("{i(); return i;}"));
    });

    mocha.it("CreateBreak", function () {
      assert.strictEqual(generator.createBreak().toString(), "break");
    });

    mocha.it("CreateSuper", function () {
      assert.strictEqual(generator.createSuper().toString(), "super");
    });
  });

  mocha.describe("Conditions", function () {
    mocha.describe("If", function () {
      mocha.it("w/o else statement", function () {
        const expression = generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("field")
        );
        const condition = generator.createTrue();

        assert.equal(
          getAst(generator.createIf(condition, expression).toString()),
          getAst("if(true)this.field")
        );
      });

      mocha.it("with else statement", function () {
        const expression = generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("field")
        );
        const condition = generator.createTrue();

        assert.equal(
          getAst(
            generator.createIf(condition, expression, expression).toString()
          ),
          getAst("if(true) this.field else this.field")
        );
      });
    });

    mocha.it("createConditional", function () {
      const expression = generator.createConditional(
        generator.createIdentifier("a"),
        generator.createFalse(),
        generator.createTrue()
      );

      assert.equal(expression.toString(), "a?false:true");
    });

    mocha.it("createSwitch", function () {
      const clause1 = generator.createCaseClause(
        generator.createNumericLiteral("1"),
        [
          generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("name")
          ),
          generator.createBreak(),
        ]
      );
      const clause2 = generator.createDefaultClause([
        generator.createVariableDeclarationList(
          [
            generator.createVariableDeclaration(
              generator.createIdentifier("a"),
              undefined,
              generator.createStringLiteral("str")
            ),
          ],
          generator.NodeFlags.Const
        ),
        generator.createBreak(),
      ]);

      const block = generator.createCaseBlock([clause1, clause2]);

      const expression = generator.createSwitch(
        generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("expr")
        ),
        block
      );
      const actualString = expression.toString();
      assert.equal(
        getAst(actualString),
        getAst(`
            switch(this.expr){
                case 1:
                    this.name;
                    break;
                default:
                    const a = "str";
                    break;
            }
            `)
      );

      assert.deepEqual(expression.getDependency(), ["expr", "name"]);
    });
  });

  mocha.describe("Property Assignment", function () {
    mocha.it("PropertyAssignment", function () {
      assert.equal(
        generator
          .createPropertyAssignment(
            generator.createIdentifier("k"),
            generator.createIdentifier("a")
          )
          .toString(),
        "k:a"
      );
    });

    mocha.it("ShorthandPropertyAssignment", function () {
      const propertyAssignment = generator.createShorthandPropertyAssignment(
        generator.createIdentifier("k"),
        undefined
      );
      assert.equal(propertyAssignment.toString(), "k");
      assert.equal(propertyAssignment.key, "k");
      assert.equal(propertyAssignment.value, "k");
    });

    mocha.it("ShorthandPropertyAssignment with expression", function () {
      const propertyAssignment = generator.createShorthandPropertyAssignment(
        generator.createIdentifier("k"),
        generator.createIdentifier("v")
      );
      assert.equal(propertyAssignment.toString(), "k:v");
      assert.equal(propertyAssignment.key, "k");
      assert.equal(propertyAssignment.value, "v");
    });

    mocha.it("SpreadAssignment", function () {
      const propertyAssignment = generator.createSpreadAssignment(
        generator.createIdentifier("obj")
      );
      assert.equal(propertyAssignment.toString(), "...obj");
    });
  });

  mocha.describe("Property Access", function () {
    mocha.it("PropertyAccess", function () {
      const expression = generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("field")
      );

      assert.equal(expression.toString(), "this.field");
      assert.deepEqual(expression.getDependency(), ["field"]);
      assert.deepEqual(
        expression.getAssignmentDependency(),
        expression.getDependency()
      );
    });

    mocha.it("PropertyAccess compileStateSetting", function () {
      const expression = generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("field")
      );
      const property = generator.createProperty(
        [],
        undefined,
        generator.createIdentifier("field"),
        undefined,
        undefined,
        undefined
      );

      assert.equal(
        expression.compileStateSetting("value", property, { members: [] }),
        "this.field=value"
      );
    });

    mocha.it("ElementAccess", function () {
      const expression = generator.createElementAccess(
        generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("field")
        ),
        generator.createNumericLiteral("10")
      );
      assert.equal(expression.toString(), "this.field[10]");

      assert.deepEqual(expression.getDependency(), ["field"]);
    });

    mocha.it("createSpread", function () {
      const expression = generator.createSpread(
        generator.createIdentifier("v")
      );
      assert.equal(expression.toString(), "...v");
    });

    mocha.it("createPropertyAccessChain", function () {
      const expression = generator.createPropertyAccessChain(
        generator.createIdentifier("a"),
        generator.createToken(generator.SyntaxKind.QuestionDotToken),
        generator.createIdentifier("b")
      );

      assert.equal(expression.toString(), "a?.b");
    });

    mocha.it("createPropertyAccessChain without QuestionDotToken", function () {
      const expression = generator.createPropertyAccessChain(
        generator.createThis(),
        undefined,
        generator.createIdentifier("click")
      );

      assert.strictEqual(expression.toString(), "this.click");
    });

    mocha.it("createElementAccessChain", function () {
      assert.equal(
        generator
          .createElementAccessChain(
            generator.createIdentifier("a"),
            generator.createToken(generator.SyntaxKind.QuestionDotToken),
            generator.createIdentifier("b")
          )
          .toString(),
        "a?.[b]"
      );

      assert.equal(
        generator
          .createElementAccessChain(
            generator.createIdentifier("a"),
            undefined,
            generator.createIdentifier("b")
          )
          .toString(),
        "a[b]"
      );
    });

    mocha.it("createComputedPropertyName", function () {
      assert.equal(
        generator
          .createComputedPropertyName(generator.createIdentifier("name"))
          .toString(),
        "[name]"
      );
    });

    mocha.it(
      "ElementAccess: getDependency should take into account index expression",
      function () {
        const expression = generator.createElementAccess(
          generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field")
          ),
          generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field1")
          )
        );
        assert.equal(expression.toString(), "this.field[this.field1]");

        assert.deepEqual(expression.getDependency(), ["field", "field1"]);
      }
    );

    mocha.it("Rename property in binding element", function () {
      const expression = generator.createObjectBindingPattern([
        generator.createBindingElement(
          undefined,
          generator.createIdentifier("props"),
          generator.createIdentifier("myProps"),
          undefined
        ),
      ]);

      const variables = expression.getVariableExpressions(
        new SimpleExpression("this")
      );
      assert.strictEqual(variables["myProps"].toString(), "this.props");
    });
  });

  mocha.describe("Function", function () {
    mocha.describe("Parameter", function () {
      mocha.it("Parameter w type and initializer", function () {
        const parameter = generator.createParameter(
          [],
          [generator.SyntaxKind.ExportKeyword],
          undefined,
          generator.createIdentifier("a"),
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string"),
          undefined
        );

        assert.equal(parameter.toString(), "a?:string");
        assert.equal(parameter.typeDeclaration(), "a?:string");
      });

      mocha.it("Simple Parameter", function () {
        const parameter = generator.createParameter(
          [],
          [],
          undefined,
          generator.createIdentifier("a"),
          undefined,
          undefined,
          undefined
        );

        assert.equal(parameter.toString(), "a", "declaration");
        assert.equal(parameter.typeDeclaration(), "a:any", "typeDeclaration");
      });

      mocha.it("Parameter w type", function () {
        const parameter = generator.createParameter(
          [],
          [generator.SyntaxKind.ExportKeyword],
          undefined,
          generator.createIdentifier("a"),
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string"),
          undefined
        );

        assert.equal(parameter.toString(), "a?:string");
        assert.equal(parameter.typeDeclaration(), "a?:string");
      });

      mocha.it("Parameter w initializer", function () {
        const parameter = generator.createParameter(
          [],
          [generator.SyntaxKind.ExportKeyword],
          undefined,
          generator.createIdentifier("a"),
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("string"),
          generator.createStringLiteral("str")
        );

        assert.equal(parameter.toString(), 'a?:string="str"');
        assert.equal(parameter.typeDeclaration(), "a?:string");
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

        assert.equal(parameter.toString(), "...a:object[]");
        assert.equal(parameter.typeDeclaration(), "a:object[]");
      });
    });

    mocha.describe("JSX functions", function () {
      mocha.it("return undefined if function is not JSX", function () {
        const fn = generator.createFunctionDeclaration(
          undefined,
          undefined,
          "",
          generator.createIdentifier("myFunc"),
          undefined,
          [],
          undefined,
          generator.createBlock([], true)
        );
        assert.equal(fn.getRootElement(), undefined);
      });
      mocha.it("return element if function is JSX", function () {
        const SVGSelfClosing = generator.createJsxSelfClosingElement(
          generator.createIdentifier("svg"),
          [],
          undefined
        );
        const fn = generator.createFunctionDeclaration(
          undefined,
          undefined,
          "",
          generator.createIdentifier("myFunc"),
          undefined,
          [],
          undefined,
          generator.createBlock([generator.createReturn(SVGSelfClosing)], false)
        );

        assert.equal(fn.getRootElement(), SVGSelfClosing);
      });
    });
  });

  mocha.describe("Template string", function () {
    mocha.it("createTemplateExpression", function () {
      const expression = generator.createTemplateExpression(
        generator.createTemplateHead("a", "a"),
        [
          generator.createTemplateSpan(
            generator.createNumericLiteral("1"),
            generator.createTemplateMiddle("b", "b")
          ),
          generator.createTemplateSpan(
            generator.createNumericLiteral("2"),
            generator.createTemplateTail("c", "c")
          ),
        ]
      );

      assert.equal(expression.toString(), "`a${1}b${2}c`");
    });

    mocha.it(
      "createTemplateExpression - convert to string concatenation",
      function () {
        const expression = generator.createTemplateExpression(
          generator.createTemplateHead("a", "a"),
          [
            generator.createTemplateSpan(
              generator.createNumericLiteral("1"),
              generator.createTemplateMiddle("b", "b")
            ),
            generator.createTemplateSpan(
              generator.createNumericLiteral("2"),
              generator.createTemplateTail("c", "c")
            ),
          ]
        );

        assert.equal(
          expression.toString({
            disableTemplates: true,
            members: [],
          }),
          `"a"+1+"b"+2+"c"`
        );
      }
    );

    mocha.it("createNoSubstitutionTemplateLiteral", function () {
      const expression = generator.createNoSubstitutionTemplateLiteral(
        "10",
        "10"
      );

      assert.equal(expression.toString(), "`10`");
    });
  });

  mocha.describe("Cycle Expressions", function () {
    mocha.describe("For", function () {
      mocha.it("createFor", function () {
        const expression = generator.createFor(
          generator.createIdentifier("i"),
          generator.createTrue(),
          generator.createPostfix(
            generator.createIdentifier("i"),
            generator.SyntaxKind.PlusPlusToken
          ),
          generator.createBlock([generator.createContinue()], true)
        );

        assert.equal(
          getAst(expression.toString()),
          getAst("for(i;true;i++){continue}")
        );
        assert.deepEqual(expression.getDependency(), []);
      });

      mocha.it("For without initializer, condition, incrementor", function () {
        const expression = generator.createFor(
          undefined,
          undefined,
          undefined,
          generator.createBlock(
            [
              generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("name")
              ),
            ],
            true
          )
        );

        assert.equal(
          getAst(expression.toString()),
          getAst("for(;;){this.name}")
        );
        assert.deepEqual(expression.getDependency(), ["name"]);
      });

      mocha.it(
        "For: get dependency from initializer, condition, incrementor",
        function () {
          const expression = generator.createFor(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("i")
            ),
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("c")
            ),
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("ii")
            ),
            generator.createBlock([generator.createContinue()], true)
          );

          assert.deepEqual(expression.getDependency(), ["i", "c", "ii"]);
        }
      );
    });
    mocha.it("While", function () {
      const expression = generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("field")
      );
      const condition = generator.createTrue();

      assert.equal(
        getAst(generator.createWhile(condition, expression).toString()),
        getAst("while(true)this.field")
      );
    });

    mocha.it("DoWhile", function () {
      const expression = generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("field")
      );
      const condition = generator.createTrue();

      assert.equal(
        getAst(generator.createDo(expression, condition).toString()),
        getAst("do this.field while(true)")
      );
    });

    mocha.it("ForIn", function () {
      const expression = generator.createForIn(
        generator.createVariableDeclarationList(
          [
            generator.createVariableDeclaration(
              generator.createIdentifier("i"),
              undefined,
              undefined
            ),
          ],
          generator.NodeFlags.Let
        ),
        generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("i")
        ),
        generator.createBlock(
          [
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("ii")
            ),
          ],
          true
        )
      );

      const actualString = expression.toString();

      assert.equal(
        getAst(actualString),
        getAst("for(let i in this.i){this.ii}")
      );
      assert.deepEqual(expression.getDependency(), ["i", "ii"]);
    });
  });

  mocha.describe("Variables", function () {
    mocha.it("VariableDeclaration", function () {
      const identifier = generator.createIdentifier("a");
      assert.equal(
        generator
          .createVariableDeclaration(identifier, undefined, undefined)
          .toString(),
        "a",
        "w/o initializer"
      );
      assert.equal(
        generator
          .createVariableDeclaration(
            identifier,
            undefined,
            generator.createStringLiteral("str")
          )
          .toString(),
        'a="str"',
        "w initializer"
      );
      assert.equal(
        generator
          .createVariableDeclaration(
            identifier,
            generator.createKeywordTypeNode("string")
          )
          .toString(),
        "a:string",
        "w type"
      );
      assert.equal(
        generator
          .createVariableDeclaration(
            identifier,
            generator.createKeywordTypeNode("string"),
            generator.createStringLiteral("str")
          )
          .toString(),
        'a:string="str"',
        "w type and initializer"
      );
    });

    mocha.it("VariableStatement", function () {
      const identifier = generator.createIdentifier("a");
      const declarationList = generator.createVariableDeclarationList(
        [
          generator.createVariableDeclaration(
            identifier,
            undefined,
            generator.createStringLiteral("str")
          ),
        ],
        generator.NodeFlags.Const
      );
      assert.equal(
        generator
          .createVariableStatement(
            [
              generator.SyntaxKind.DefaultKeyword,
              generator.SyntaxKind.ExportKeyword,
            ],
            declarationList
          )
          .toString(),
        'default export const a="str"'
      );
    });

    mocha.describe("VariableDeclarationList", function () {
      mocha.it("toString", function () {
        const expression = generator.createVariableDeclarationList(
          [
            generator.createVariableDeclaration(
              generator.createIdentifier("a"),
              undefined,
              generator.createStringLiteral("str")
            ),
            generator.createVariableDeclaration(
              generator.createIdentifier("b"),
              undefined,
              generator.createNumericLiteral("10")
            ),
          ],
          generator.NodeFlags.Const
        );

        assert.equal(expression.toString(), 'const a="str",b=10');
      });

      mocha.it(
        "createVariableDeclaration - getVariableExpression",
        function () {
          const expression = generator.createVariableDeclaration(
            generator.createIdentifier("a"),
            undefined,
            generator.createStringLiteral("str")
          );

          const list = expression.getVariableExpressions();
          assert.strictEqual(Object.keys(list).length, 1);
          assert.strictEqual(list["a"].toString(), `"str"`);
        }
      );

      mocha.it(
        "createVariableDeclaration without initializer - getVariableExpression should return empty object",
        function () {
          const expression = generator.createVariableDeclaration(
            generator.createIdentifier("a")
          );

          assert.deepEqual(expression.getVariableExpressions(), {});
        }
      );

      mocha.it(
        "createVariableDeclaration - wrap expression in paren complex",
        function () {
          const expression = generator.createVariableDeclaration(
            generator.createIdentifier("a"),
            undefined,
            generator.createBinary(
              generator.createIdentifier("i"),
              generator.SyntaxKind.MinusToken,
              generator.createIdentifier("j")
            )
          );

          const list = expression.getVariableExpressions();
          assert.strictEqual(Object.keys(list).length, 1);
          assert.strictEqual(list["a"].toString(), `(i - j)`);
        }
      );

      mocha.it("getVariableExpression from VariableDeclaration", function () {
        const expression = generator.createVariableDeclarationList(
          [
            generator.createVariableDeclaration(
              generator.createIdentifier("a"),
              undefined,
              generator.createStringLiteral("str")
            ),
            generator.createVariableDeclaration(
              generator.createIdentifier("b"),
              undefined,
              generator.createNumericLiteral("10")
            ),
          ],
          generator.NodeFlags.Const
        );

        const variableList = expression.getVariableExpressions();

        assert.strictEqual(Object.keys(variableList).length, 2);

        assert.equal(variableList["a"].toString(), '"str"');
        assert.equal(variableList["b"].toString(), "10");
      });

      mocha.it(
        "VariableDeclaration with object binding pattern - getVariableDeclaration",
        function () {
          const expression = generator.createVariableDeclaration(
            generator.createObjectBindingPattern([
              generator.createBindingElement(
                undefined,
                undefined,
                generator.createIdentifier("height"),
                undefined
              ),
              generator.createBindingElement(
                undefined,
                generator.createIdentifier("props"),
                generator.createObjectBindingPattern([
                  generator.createBindingElement(
                    undefined,
                    undefined,
                    generator.createIdentifier("source"),
                    undefined
                  ),
                ]),
                undefined
              ),
            ]),
            undefined,
            generator.createIdentifier("this")
          );

          const list = expression.getVariableExpressions();

          assert.strictEqual(Object.keys(list).length, 2);
          assert.strictEqual(list["height"].toString(), "this.height");
          assert.strictEqual(list["source"].toString(), "this.props.source");
          assert.ok(list["height"] instanceof PropertyAccess);
        }
      );

      mocha.it(
        "VariableDeclaration with object binding pattern with string name - getVariableDeclaration",
        function () {
          const expression = generator.createVariableDeclaration(
            generator.createObjectBindingPattern([
              generator.createBindingElement(
                undefined,
                undefined,
                "height",
                undefined
              ),
            ]),
            undefined,
            generator.createIdentifier("this")
          );

          const list = expression.getVariableExpressions();

          assert.strictEqual(Object.keys(list).length, 1);
          assert.strictEqual(list["height"].toString(), "this.height");
          assert.ok(list["height"] instanceof PropertyAccess);
        }
      );

      mocha.it(
        "VariableDeclaration with array binding pattern - getVariableDeclaration",
        function () {
          const expression = generator.createVariableDeclaration(
            generator.createArrayBindingPattern([
              generator.createBindingElement(
                undefined,
                undefined,
                generator.createIdentifier("height"),
                undefined
              ),
            ]),
            undefined,
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("props")
            )
          );

          const list = expression.getVariableExpressions();

          assert.strictEqual(Object.keys(list).length, 1);
          assert.strictEqual(list["height"].toString(), "this.props[0]");
          assert.ok(list["height"] instanceof ElementAccess);
        }
      );

      mocha.it("can replace Identifer with expression", function () {
        const identifer = generator.createIdentifier("name");
        const expression = generator.createNumericLiteral("10");

        assert.strictEqual(
          identifer.toString({
            members: [],
            variables: {
              name: expression,
            },
          }),
          "10"
        );
      });

      mocha.it("variable has value the same as name", function () {
        const identifer = generator.createIdentifier("name");
        const expression = generator.createIdentifier("name");

        assert.strictEqual(
          identifer.toString({
            members: [],
            variables: {
              name: expression,
            },
          }),
          "name"
        );
      });

      mocha.it(
        "can replace Identifer with expression in JSX self-closing element",
        function () {
          const identifer = generator.createIdentifier("render");
          const element = generator.createJsxSelfClosingElement(
            identifer,
            [],
            []
          );

          const expression = new SimpleExpression("viewModel.props.template");

          assert.strictEqual(
            element.toString({
              members: [],
              variables: {
                render: expression,
              },
            }),
            "<viewModel.props.template />"
          );
        }
      );

      mocha.it(
        "can replace Identifer with expression in JSX element",
        function () {
          const identifer = generator.createIdentifier("render");
          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(identifer, [], []),
            [],
            generator.createJsxClosingElement(identifer)
          );

          const expression = new SimpleExpression("viewModel.props.template");

          assert.strictEqual(
            element.toString({
              members: [],
              variables: {
                render: expression,
              },
            }),
            "<viewModel.props.template ></viewModel.props.template>"
          );
        }
      );

      mocha.it("PropertyAccess", function () {
        const propertyAccess = generator.createPropertyAccess(
          generator.createIdentifier("name"),
          generator.createIdentifier("name")
        );

        assert.strictEqual(
          propertyAccess.toString({
            members: [],
            variables: {
              name: generator.createIdentifier("v"),
            },
          }),
          "v.name"
        );
      });

      mocha.it(
        "Can replace identifer in shorthand property assignment",
        function () {
          const expression = generator.createObjectLiteral(
            [
              generator.createShorthandPropertyAssignment(
                generator.createIdentifier("v")
              ),
            ],
            false
          );

          assert.strictEqual(
            expression.toString({
              members: [],
              variables: {
                v: generator.createIdentifier("value"),
              },
            }),
            "{v:value}"
          );
        }
      );
    });
  });

  mocha.describe("JSX", function () {
    mocha.it("createJsxText", function () {
      assert.strictEqual(
        generator.createJsxText("test string", "false"),
        "test string"
      );
      assert.strictEqual(generator.createJsxText("test string", "true"), "");
      assert.strictEqual(generator.createJsxText("   \n", "true"), "");
    });

    mocha.it("createJsxSpreadAttribute", function () {
      const expression = generator.createJsxSpreadAttribute(
        generator.createIdentifier("field")
      );

      assert.equal(expression.toString(), "{...field}");
      assert.strictEqual(expression.isJsx(), true);
    });

    mocha.it("createJsxExpression", function () {
      const expression = generator.createJsxExpression(
        undefined,
        generator.createIdentifier("field")
      );

      assert.equal(expression.toString(), "{field}");
      assert.strictEqual(expression.isJsx(), true);
    });

    mocha.it("JsxElement", function () {
      const expression = generator.createJsxElement(
        generator.createJsxOpeningElement(
          generator.createIdentifier("div"),
          [],
          [
            generator.createJsxAttribute(
              generator.createIdentifier("name"),
              generator.createJsxExpression(
                undefined,
                generator.createIdentifier("value")
              )
            ),
          ]
        ),
        [],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(expression.toString(), "<div name={value}></div>");
    });

    mocha.it("booleanAttribute", function () {
      const expression = generator.createJsxAttribute(
        generator.createIdentifier("selected")
      );

      assert.strictEqual(expression.toString(), "selected={true}");
    });

    mocha.it("JsxAttribute.getTemplateContext()", function () {
      const expression = generator.createJsxAttribute(
        generator.createIdentifier("selected")
      );

      assert.deepEqual(expression.getTemplateContext(), []);
    });
  });

  mocha.describe("BindingElement", function () {
    mocha.it("only name is set (decomposite object)", function () {
      const expression = generator.createBindingElement(
        undefined,
        undefined,
        generator.createIdentifier("v")
      );

      assert.strictEqual(expression.toString(), "v");
      assert.deepEqual(expression.getDependency(), ["v"]);
    });

    mocha.it(
      "property name and name are set (decomposite object and rename)",
      function () {
        const expression = generator.createBindingElement(
          undefined,
          generator.createIdentifier("a"),
          generator.createIdentifier("v")
        );
        assert.strictEqual(expression.toString(), "a:v");
        assert.deepEqual(expression.getDependency(), ["a"]);
      }
    );

    mocha.it("rest properties", function () {
      assert.strictEqual(
        generator
          .createBindingElement(
            generator.SyntaxKind.DotDotDotToken,
            undefined,
            generator.createIdentifier("v")
          )
          .toString(),
        "...v"
      );
    });

    mocha.it("decomposite object with BindingPattern", function () {
      assert.strictEqual(
        generator
          .createBindingElement(
            undefined,
            generator.createIdentifier("v"),
            generator.createObjectBindingPattern([
              generator.createBindingElement(
                undefined,
                undefined,
                generator.createIdentifier("a")
              ),
            ])
          )
          .toString(),
        "v:{a}"
      );
    });

    mocha.it("can remove all elements in binding pattern", function () {
      const expression = generator.createBindingElement(
        undefined,
        generator.createIdentifier("v"),
        generator.createObjectBindingPattern([
          generator.createBindingElement(
            undefined,
            undefined,
            generator.createIdentifier("a")
          ),
        ])
      );
      (expression.name as BindingPattern).remove("a");
      assert.strictEqual(expression.toString(), "v");
    });

    mocha.it("Object Binding pattern should sort items", function () {
      const expression = generator.createObjectBindingPattern([
        generator.createBindingElement(
          undefined,
          undefined,
          generator.createIdentifier("d"),
          undefined
        ),
        generator.createBindingElement(
          undefined,
          generator.createIdentifier("b"),
          generator.createObjectBindingPattern([
            generator.createBindingElement(
              undefined,
              undefined,
              generator.createIdentifier("c"),
              undefined
            ),
          ]),
          undefined
        ),
        generator.createBindingElement(
          undefined,
          undefined,
          generator.createIdentifier("c"),
          undefined
        ),
        generator.createBindingElement(
          undefined,
          undefined,
          generator.createIdentifier("z"),
          undefined
        ),
        generator.createBindingElement(
          generator.SyntaxKind.DotDotDotToken,
          undefined,
          generator.createIdentifier("e"),
          undefined
        ),
      ]);

      assert.strictEqual(expression.toString(), "{b:{c},c,d,z,...e}");
    });

    mocha.it("Do not sort array Binding Pattern", function () {
      const expression = generator.createArrayBindingPattern([
        generator.createBindingElement(
          undefined,
          undefined,
          generator.createIdentifier("d"),
          undefined
        ),
        generator.createBindingElement(
          undefined,
          undefined,
          generator.createIdentifier("c"),
          undefined
        ),
      ]);

      assert.strictEqual(expression.toString(), "[d,c]");
    });
  });

  mocha.describe("Class members", function () {
    mocha.it("Property", function () {
      const expression = generator.createProperty(
        [],
        [],
        generator.createIdentifier("p"),
        generator.SyntaxKind.QuestionToken,
        generator.createKeywordTypeNode("number"),
        generator.createNumericLiteral("10")
      );

      assert.strictEqual(expression.isReadOnly(), false);
      assert.strictEqual(
        getAst(expression.toString()),
        getAst("p?:number = 10")
      );
      assert.strictEqual(expression.getter(), "p");
    });

    mocha.it("Method", function () {
      const expression = generator.createMethod(
        undefined,
        undefined,
        "",
        generator.createIdentifier("name"),
        generator.SyntaxKind.QuestionToken,
        undefined,
        [],
        undefined,
        generator.createBlock([], false)
      );

      assert.strictEqual(expression.isReadOnly(), true);
      assert.strictEqual(getAst(expression.toString()), getAst("name():any{}"));
      assert.strictEqual(expression.isInternalState, false);
    });

    mocha.it("Method with decorators, modifiers, type", function () {
      const expression = generator.createMethod(
        [createDecorator("d1"), createDecorator("d2")],
        ["public"],
        "",
        generator.createIdentifier("name"),
        generator.SyntaxKind.QuestionToken,
        undefined,
        [],
        generator.createKeywordTypeNode("string"),
        generator.createBlock([], false)
      );

      assert.strictEqual(expression.isReadOnly(), true);
      assert.strictEqual(
        getAst(expression.toString()),
        getAst("@d1() @d2() public name():string{}")
      );
    });

    mocha.it("Method with TypeParameters", function () {
      const method = generator.createMethod(
        [],
        [],
        undefined,
        generator.createIdentifier("m"),
        undefined,
        [
          generator.createTypeParameterDeclaration(
            generator.createIdentifier("T1")
          ),
          generator.createTypeParameterDeclaration(
            generator.createIdentifier("T2")
          ),
        ],
        [],
        generator.createUnionTypeNode([
          generator.createTypeReferenceNode(generator.createIdentifier("T1")),
          generator.createTypeReferenceNode(generator.createIdentifier("T2")),
        ]),
        generator.createBlock([], false)
      );

      assert.strictEqual(method.typeDeclaration(), "m:<T1,T2>()=>T1|T2");
      assert.strictEqual(
        getAst(method.declaration()),
        getAst("function m<T1,T2>():T1|T2{}")
      );
      assert.strictEqual(
        getAst(method.toString()),
        getAst("m<T1,T2>():T1|T2{}")
      );
    });

    mocha.it("GetAccessor", function () {
      const expression = generator.createGetAccessor(
        undefined,
        undefined,
        generator.createIdentifier("name"),
        []
      );

      assert.strictEqual(expression.isReadOnly(), true);
      assert.strictEqual(
        getAst(expression.toString()),
        getAst("get name():any{}")
      );
      assert.strictEqual(expression.isInternalState, false);
    });

    mocha.it("GetAccessor with decorators and modifiers", function () {
      const expression = generator.createGetAccessor(
        [],
        ["public"],
        generator.createIdentifier("name"),
        [],
        undefined,
        generator.createBlock([], false)
      );

      assert.strictEqual(expression.isReadOnly(), true);
      assert.strictEqual(
        getAst(expression.toString()),
        getAst("get name():any{}")
      );
      assert.strictEqual(expression.isInternalState, false);
    });

    mocha.describe("Method.getDependency()", function () {
      mocha.it(
        "should return dependency from other method if it used",
        function () {
          const p1 = generator.createProperty(
            [createDecorator("OneWay")],
            undefined,
            generator.createIdentifier("p1")
          );
          const p2 = generator.createProperty(
            [createDecorator("OneWay")],
            undefined,
            generator.createIdentifier("p1")
          );

          const method1 = generator.createMethod(
            undefined,
            undefined,
            "",
            generator.createIdentifier("m1"),
            generator.SyntaxKind.QuestionToken,
            undefined,
            [],
            undefined,
            generator.createBlock(
              [
                generator.createPropertyAccess(
                  generator.createThis(),
                  generator.createIdentifier("m2")
                ),
              ],
              false
            )
          );

          const method2 = generator.createMethod(
            undefined,
            undefined,
            "",
            generator.createIdentifier("m2"),
            generator.SyntaxKind.QuestionToken,
            undefined,
            [],
            undefined,
            generator.createBlock(
              [
                generator.createReturn(
                  generator.createPropertyAccess(
                    generator.createPropertyAccess(
                      generator.createThis(),
                      generator.createIdentifier("props")
                    ),
                    generator.createIdentifier("p1")
                  )
                ),
              ],
              false
            )
          );

          const members = [p1, p2, method1, method2];

          assert.deepEqual(method1.getDependency(members), ["p1"]);
        }
      );

      mocha.it("should correctly resolve recursive dependency", function () {
        const p1 = generator.createProperty(
          [createDecorator("OneWay")],
          undefined,
          generator.createIdentifier("p1")
        );

        const method = generator.createMethod(
          undefined,
          undefined,
          "",
          generator.createIdentifier("m"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          [],
          undefined,
          generator.createBlock(
            [
              generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("m")
              ),
              generator.createPropertyAccess(
                generator.createPropertyAccess(
                  generator.createThis(),
                  generator.createIdentifier("props")
                ),
                generator.createIdentifier("p1")
              ),
            ],
            false
          )
        );

        const members = [p1, method];

        assert.deepEqual(method.getDependency(members), ["p1"]);
      });
    });
  });

  mocha.describe("class expressions", function () {
    mocha.it("createHeritageClause", function () {
      const expression = generator.createHeritageClause(
        generator.SyntaxKind.ExtendsKeyword,
        [
          generator.createExpressionWithTypeArguments(
            undefined,
            generator.createIdentifier("Base")
          ),
        ]
      );
      assert.strictEqual(expression.toString(), "extends Base");
      assert.strictEqual(expression.propsType.toString(), "Base");
    });

    mocha.it(
      "createClassDeclaration without decorators and modifiers",
      function () {
        const expression = generator.createClassDeclaration(
          undefined,
          undefined,
          generator.createIdentifier("class1"),
          [],
          [],
          []
        );

        assert.ok(expression instanceof Class);
        assert.ok(!(expression instanceof ComponentInput));
        assert.ok(!(expression instanceof Component));

        assert.strictEqual(
          getAst(expression.toString()),
          getAst(`class class1 {}`)
        );
      }
    );

    mocha.it(
      "createClassDeclaration with modifiers and decorators",
      function () {
        const expression = generator.createClassDeclaration(
          [createDecorator("d1"), createDecorator("d2")],
          ["export", "default"],
          generator.createIdentifier("class1"),
          [],
          [],
          []
        );

        assert.ok(expression instanceof Class);
        assert.ok(!(expression instanceof ComponentInput));
        assert.ok(!(expression instanceof Component));

        assert.strictEqual(
          getAst(expression.toString()),
          getAst(`
            @d1()
            @d2()
            export default class class1 {}`)
        );
      }
    );

    mocha.it("createClassDeclaration with heritage clause", function () {
      const heritageClause = generator.createHeritageClause(
        generator.SyntaxKind.ExtendsKeyword,
        [
          generator.createExpressionWithTypeArguments(
            undefined,
            generator.createIdentifier("Base")
          ),
        ]
      );
      const expression = generator.createClassDeclaration(
        undefined,
        undefined,
        generator.createIdentifier("class1"),
        [],
        [heritageClause],
        []
      );

      assert.ok(expression instanceof Class);
      assert.ok(!(expression instanceof ComponentInput));
      assert.ok(!(expression instanceof Component));

      assert.strictEqual(
        getAst(expression.toString()),
        getAst(`class class1 extends Base {}`)
      );
    });

    mocha.it("createClassDeclaration with members", function () {
      const expression = generator.createClassDeclaration(
        undefined,
        undefined,
        generator.createIdentifier("class1"),
        [],
        [],
        [
          generator.createProperty(
            [],
            undefined,
            generator.createIdentifier("p1")
          ),
          generator.createProperty(
            [],
            undefined,
            generator.createIdentifier("p2")
          ),
        ]
      );

      assert.ok(expression instanceof Class);
      assert.ok(!(expression instanceof ComponentInput));
      assert.ok(!(expression instanceof Component));

      assert.strictEqual(
        getAst(expression.toString()),
        getAst(`class class1 {
                p1: any;
                p2: any;
            }`)
      );
    });
  });

  mocha.describe("import", function () {
    this.beforeEach(function () {
      generator.setContext({
        path: __filename,
        dirname: __dirname,
      });
    });

    this.afterEach(function () {
      generator.setContext(null);
    });

    mocha.it("createImportDeclaration", function () {
      assert.equal(
        generator.createImportDeclaration(
          undefined,
          undefined,
          undefined,
          generator.createStringLiteral("typescript")
        ),
        'import "typescript"'
      );

      assert.equal(
        generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            undefined,
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("SyntaxKind")
              ),
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("AffectedFileResult")
              ),
            ])
          ),
          generator.createStringLiteral("typescript")
        ),
        'import {SyntaxKind,AffectedFileResult} from "typescript"'
      );

      assert.equal(
        generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            generator.createIdentifier("ts"),
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("Node")
              ),
            ])
          ),
          generator.createStringLiteral("typescript")
        ),
        'import ts,{Node} from "typescript"'
      );

      assert.equal(
        generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            generator.createIdentifier("Button"),
            undefined
          ),
          generator.createStringLiteral("./button")
        ),
        'import Button from "./button"'
      );

      assert.equal(
        generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            undefined,
            generator.createNamespaceImport(
              generator.createIdentifier("utilsModule")
            )
          ),
          generator.createStringLiteral("./utils-module")
        ),
        'import * as utilsModule from "./utils-module"'
      );
    });

    mocha.it("ImportDeclaration: can remove named import", function () {
      const expression = generator.createImportDeclaration(
        undefined,
        undefined,
        generator.createImportClause(
          generator.createIdentifier("ts"),
          generator.createNamedImports([
            generator.createImportSpecifier(
              undefined,
              generator.createIdentifier("Node")
            ),
          ])
        ),
        generator.createStringLiteral("typescript")
      ) as ImportDeclaration;

      expression.importClause.remove("Node");

      assert.equal(expression.toString(), 'import ts from "typescript"');
    });

    mocha.it(
      "ImportDeclaration: remove named import if no named bindings",
      function () {
        const expression = generator.createImportDeclaration(
          undefined,
          undefined,
          undefined,
          generator.createStringLiteral("typescript")
        ) as ImportDeclaration;

        expression.importClause.remove("Node");

        assert.equal(expression.toString(), 'import "typescript"');
      }
    );

    mocha.it("createImportDeclaration change import ", function () {
      assert.equal(
        generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            generator.createIdentifier("Button"),
            undefined
          ),
          generator.createStringLiteral("../../component_declaration/common")
        ),
        ""
      );
    });

    mocha.it("createNamespaceImport", function () {
      const expression = generator.createNamespaceImport(
        generator.createIdentifier("module")
      );

      assert.equal(expression.toString(), "* as module");
    });

    mocha.it("import global variable should fill context global", function () {
      generator.createImportDeclaration(
        undefined,
        undefined,
        generator.createImportClause(
          undefined,
          generator.createNamedImports([
            generator.createImportSpecifier(
              undefined,
              generator.createIdentifier("PREFIX")
            ),
          ])
        ),
        generator.createStringLiteral(
          "./test-cases/declarations/src/globals-in-template"
        )
      );

      assert.strictEqual(
        generator.getContext().globals?.["PREFIX"].toString(),
        '"dx"'
      );
      assert.strictEqual(
        generator.getContext().globals?.["CLASS_NAME"],
        undefined
      );
    });

    mocha.it(
      "import module declaration with component shouldn't fill component if it is not imported",
      function () {
        generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            undefined,
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("PREFIX")
              ),
            ])
          ),
          generator.createStringLiteral(
            "./test-cases/declarations/src/globals-in-template"
          )
        );

        assert.strictEqual(generator.getContext().components, undefined);
      }
    );

    mocha.it("Add named imported component in context", function () {
      generator.createImportDeclaration(
        undefined,
        undefined,
        generator.createImportClause(
          undefined,
          generator.createNamedImports([
            generator.createImportSpecifier(
              undefined,
              generator.createIdentifier("Widget")
            ),
          ])
        ),
        generator.createStringLiteral(
          "./test-cases/declarations/src/export-named-api-ref"
        )
      );

      assert.strictEqual(
        generator.getContext().components?.["Widget"].name,
        "Widget"
      );
    });

    mocha.it(
      "Import component in different folder with current module",
      function () {
        generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(generator.createIdentifier("Widget")),
          generator.createStringLiteral(
            "./test-cases/declarations/src/use-external-component-bindings"
          )
        );

        const widget = generator.getContext().components?.[
          "Widget"
        ] as Component;

        assert.deepEqual(
          widget.members.map((m) => m.name),
          ["height", "data", "info", "__restAttributes"]
        );
      }
    );

    mocha.it(
      "import module declaration with component should fill component if it is imported",
      function () {
        generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            generator.createIdentifier("Base"),
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("PREFIX")
              ),
            ])
          ),
          generator.createStringLiteral(
            "./test-cases/declarations/src/globals-in-template"
          )
        );

        assert.strictEqual(
          generator.getContext().components?.["Base"].name,
          "WidgetWithGlobals"
        );
        assert.strictEqual(
          generator.getContext().components?.["Base"].compileDefaultProps(),
          ""
        );
      }
    );

    mocha.describe("has", function () {
      mocha.it("without default and named imports", function () {
        const expression = generator.createImportDeclaration(
          undefined,
          undefined,
          undefined,
          generator.createStringLiteral("typescript")
        ) as ImportDeclaration;

        assert.strictEqual(expression.has("typescript"), false);
      });

      mocha.it("with default import and named imports", function () {
        const expression = generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            generator.createIdentifier("ts"),
            generator.createNamedImports([
              generator.createImportSpecifier(
                undefined,
                generator.createIdentifier("Node")
              ),
              generator.createImportSpecifier(
                generator.createIdentifier("isNode"),
                generator.createIdentifier("_isNode")
              ),
            ])
          ),
          generator.createStringLiteral("typescript")
        ) as ImportDeclaration;

        assert.strictEqual(expression.has("ts"), true);
        assert.strictEqual(expression.has("Node"), true);
        assert.strictEqual(expression.has("_isNode"), true);
        assert.strictEqual(expression.has("isNode"), false);
        assert.strictEqual(expression.has("any"), false);
      });

      mocha.it("with namespace import", function () {
        const expression = generator.createImportDeclaration(
          undefined,
          undefined,
          generator.createImportClause(
            undefined,
            generator.createNamespaceImport(
              generator.createIdentifier("utilsModule")
            )
          ),
          generator.createStringLiteral("./utils-module")
        ) as ImportDeclaration;

        assert.strictEqual(expression.has("utilsModule"), true);
        assert.strictEqual(expression.has("any"), false);
      });
    });
  });

  mocha.describe("export", function () {
    mocha.it("named exports", function () {
      const expression = generator.createExportDeclaration(
        undefined,
        undefined,
        generator.createNamedExports([
          generator.createExportSpecifier(
            undefined,
            generator.createIdentifier("named1")
          ),
          generator.createExportSpecifier(
            generator.createIdentifier("named2"),
            generator.createIdentifier("_named2")
          ),
        ]),
        undefined
      );

      assertCode(expression.toString(), "export {named1, named2 as _named2}");
    });

    mocha.it("named exports with module specifier", function () {
      const expression = generator.createExportDeclaration(
        [],
        [],
        generator.createNamedExports([
          generator.createExportSpecifier(
            undefined,
            generator.createIdentifier("named")
          ),
        ]),
        generator.createStringLiteral("./module")
      );

      assertCode(expression.toString(), `export {named} from "./module`);
    });

    mocha.it("export all from module", function () {
      const expression = generator.createExportDeclaration(
        undefined,
        undefined,
        undefined,
        generator.createStringLiteral("./module")
      );

      assert.strictEqual(expression.toString(), `export * from "./module"`);
    });
  });

  mocha.describe("Interface", function () {
    mocha.it("empty interface", function () {
      const expression = generator.createInterfaceDeclaration(
        undefined,
        undefined,
        generator.createIdentifier("name"),
        undefined,
        undefined,
        []
      );

      assert.strictEqual(
        getAst(expression.toString()),
        getAst(`
                interface name {}
            `)
      );
    });

    mocha.it(
      "interface with decorators, modifiers, and heritage clauses",
      function () {
        const expression = generator.createInterfaceDeclaration(
          [createDecorator("d1"), createDecorator("d2")],
          ["export", "default"],
          generator.createIdentifier("name"),
          undefined,
          [
            generator.createHeritageClause("extends", [
              generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base1")
              ),
            ]),
            generator.createHeritageClause("implements", [
              generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base2")
              ),
            ]),
          ],
          []
        );

        assert.strictEqual(
          getAst(expression.toString()),
          getAst(`
                @d1() @d2()
                export default interface name extends Base1 implements Base2 {}
            `)
        );
      }
    );

    mocha.it("with members", function () {
      const expression = generator.createInterfaceDeclaration(
        undefined,
        undefined,
        generator.createIdentifier("name"),
        undefined,
        undefined,
        [
          generator.createPropertySignature(
            [],
            generator.createIdentifier("p1"),
            undefined,
            generator.createKeywordTypeNode("string"),
            undefined
          ),
          generator.createMethodSignature(
            undefined,
            [],
            generator.createKeywordTypeNode("string"),
            generator.createIdentifier("m1")
          ),
        ]
      );

      assert.strictEqual(
        getAst(expression.toString()),
        getAst(`
                interface name {
                    p1: string;
                    m1():string;
                }
            `)
      );
    });
  });

  mocha.describe("Enum", function () {
    mocha.it("member", function () {
      const result = generator.createEnumMember(
        generator.createIdentifier("E1"),
        generator.createStringLiteral("test")
      );

      assert.equal(result.toString(), 'E1="test"');
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
          export default enum MyEnum {
            E1,
            E2="test1",
            E3="test2",
            E4=10,
            E5,
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

      assert.strictEqual(getAst(result.toString()), getAst("enum MyEnum {}"));
    });
  });
});

mocha.describe("common", function () {
  mocha.it.skip("SyntaxKind", function () {
    const expected = Object.keys(ts.SyntaxKind)
      .map((key) => ts.SyntaxKind[Number(key)])
      .filter((value) => typeof value === "string") as string[];

    const actual = Object.keys(generator.SyntaxKind);

    assert.equal(actual.length, expected.length);
    assert.deepEqual(actual, expected);
  });

  mocha.it("SyntaxKind Keywords", function () {
    const expected = Object.keys(ts.SyntaxKind)
      .map((key) => ts.SyntaxKind[Number(key)])
      .filter(
        (value) => typeof value === "string" && value.endsWith("Keyword")
      ) as string[];

    expected.forEach((k) => {
      assert.equal(
        (generator.SyntaxKind as any)[k],
        k.replace(/Keyword$/, "").toLowerCase(),
        `${k} is missed`
      );
    });
  });

  mocha.it("SyntaxKind Tokens", function () {
    const expected = Object.keys(ts.SyntaxKind)
      .map((key) => ts.SyntaxKind[Number(key)])
      .filter(
        (value) => typeof value === "string" && value.endsWith("Token")
      ) as string[];

    expected.forEach((k) => {
      const token = (generator.SyntaxKind as any)[k];
      assert.ok(token !== undefined, `${k} is missed`);
    });
  });

  mocha.it.skip("NodeFlags", function () {
    const expected = Object.keys(ts.NodeFlags)
      .map((key) => ts.SyntaxKind[Number(key)])
      .filter((value) => typeof value === "string") as string[];

    const actual = Object.keys(generator.NodeFlags);
    assert.equal(actual.length, expected.length);
    assert.deepEqual(Object.keys(generator.NodeFlags), expected);
  });

  mocha.it("processSourceFileName", function () {
    assert.strictEqual(generator.processSourceFileName("someName"), "someName");
  });
});

mocha.describe("Component", function () {
  this.beforeEach(() => {
    generator.setContext({});
  });
  this.afterEach(() => {
    generator.setContext(null);
  });

  mocha.it("class with Component decorator is Component instance", function () {
    const expression = generator.createClassDeclaration(
      [createComponentDecorator({})],
      [],
      generator.createIdentifier("Widget"),
      [],
      [],
      []
    );

    assert.ok(expression instanceof Component);
    assert.strictEqual((expression as Component).defaultPropsDest(), "");
    const componentFromContext = generator.getContext().components?.["Widget"];
    assert.strictEqual(componentFromContext, expression);
  });

  mocha.it(
    "should throw an error if more than one prop marked as isModel",
    function () {
      let error;
      try {
        generator.createClassDeclaration(
          [createComponentDecorator({})],
          [],
          generator.createIdentifier("Widget"),
          [],
          [],
          [
            generator.createProperty(
              [createDecorator("TwoWay", { isModel: true })],
              [],
              generator.createIdentifier("stateProp1"),
              undefined,
              undefined,
              undefined
            ),
            generator.createProperty(
              [createDecorator("TwoWay", { isModel: true })],
              [],
              generator.createIdentifier("stateProp2"),
              undefined,
              undefined,
              undefined
            ),
            generator.createProperty(
              [createDecorator("TwoWay")],
              [],
              generator.createIdentifier("stateProp3"),
              undefined,
              undefined,
              undefined
            ),
          ]
        );
      } catch (e) {
        error = e;
      }

      assert.strictEqual(
        error,
        "There should be only one model prop. Props marked as isModel: stateProp1, stateProp2"
      );
    }
  );
});

mocha.describe("ComponentInput", function () {
  this.beforeEach(function () {
    generator.setContext({});
    this.decorators = [
      generator.createDecorator(
        generator.createCall(
          generator.createIdentifier("ComponentBindings"),
          [],
          []
        )
      ),
    ];
  });

  this.afterEach(function () {
    generator.setContext(null);
  });

  mocha.it("Add Component input to cache", function () {
    const expression = generator.createClassDeclaration(
      this.decorators,
      ["export"],
      generator.createIdentifier("BaseModel"),
      [],
      [],
      []
    );

    const cachedComponent = generator.getContext().components!["BaseModel"];
    assert.equal(cachedComponent, expression);
    assert.deepEqual(
      cachedComponent.heritageProperties.map((p) => p.toString),
      []
    );
  });

  mocha.it("Component input has heritage properties", function () {
    generator.createClassDeclaration(
      this.decorators,
      ["export"],
      generator.createIdentifier("BaseModel"),
      [],
      [],
      [
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("p"),
          undefined,
          generator.createKeywordTypeNode("number"),
          generator.createNumericLiteral("10")
        ),
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("p1"),
          undefined,
          generator.createKeywordTypeNode("number"),
          generator.createNumericLiteral("15")
        ),
      ]
    );

    const cachedComponent = generator.getContext().components!["BaseModel"];
    assert.deepEqual(
      cachedComponent.heritageProperties.map((p) => p.name.toString()),
      ["p", "p1"]
    );
  });

  mocha.describe("Warnings", function () {
    this.beforeEach(function () {
      const warn = sinon.stub(console, "warn");
      this.warn = warn;
      this.getWarnings = () => warn.getCalls().map((c) => c.args[2]);
    });

    this.afterEach(function () {
      this.warn.restore();
    });

    function createComponentInput(properties: Array<Property | Method>) {
      generator.createClassDeclaration(
        [
          generator.createDecorator(
            generator.createCall(
              generator.createIdentifier("ComponentBindings"),
              [],
              []
            )
          ),
        ],
        ["export"],
        generator.createIdentifier("BaseModel"),
        [],
        [],
        properties
      );
    }

    mocha.it("method", function () {
      createComponentInput([
        generator.createMethod(
          [],
          [],
          "",
          generator.createIdentifier("methodName"),
          undefined,
          undefined,
          [],
          undefined,
          generator.createBlock([], false)
        ),
      ]);

      assert.deepEqual(this.getWarnings(), [
        "BaseModel ComponentBindings has non-property member: methodName",
      ]);
    });

    mocha.it("property without decorator", function () {
      createComponentInput([
        generator.createProperty([], [], generator.createIdentifier("prop")),
      ]);

      assert.deepEqual(this.getWarnings(), [
        "BaseModel ComponentBindings has property without decorator: prop",
      ]);
    });

    mocha.it("property with two decorators", function () {
      createComponentInput([
        generator.createProperty(
          [createDecorator("OneWay"), createDecorator("TwoWay")],
          [],
          generator.createIdentifier("prop")
        ),
      ]);

      assert.deepEqual(this.getWarnings(), [
        "BaseModel ComponentBindings has property with multiple decorators: prop",
      ]);
    });

    mocha.it("Ref and ForwardRef props should not throw warnings", function () {
      createComponentInput([
        generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("refProp")
        ),
        generator.createProperty(
          [createDecorator(Decorators.ForwardRef)],
          [],
          generator.createIdentifier("forwardRef")
        ),
      ]);

      assert.deepEqual(this.getWarnings(), []);
    });

    mocha.it("internal state", function () {
      createComponentInput([
        generator.createProperty(
          [createDecorator("InternalState")],
          [],
          generator.createIdentifier("prop")
        ),
      ]);

      assert.deepEqual(this.getWarnings(), [
        'BaseModel ComponentBindings has property "prop" with incorrect decorator: InternalState',
      ]);
    });

    mocha.it("reserved names", function () {
      createComponentInput([
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("key")
        ),
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("ref")
        ),
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("style")
        ),
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("class")
        ),
      ]);

      assert.deepEqual(this.getWarnings(), [
        "BaseModel ComponentBindings has property with reserved name: key",
        "BaseModel ComponentBindings has property with reserved name: ref",
        "BaseModel ComponentBindings has property with reserved name: style",
        "BaseModel ComponentBindings has property with reserved name: class",
      ]);
    });

    mocha.it("Prop and Api Method has same names - warning", function () {
      createComponentInput([
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("p1")
        ),
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("p2")
        ),
      ]);

      generator.createClassDeclaration(
        [createDecorator("Component", {})],
        [],
        generator.createIdentifier("ComponentName"),
        [],
        [
          generator.createHeritageClause(generator.SyntaxKind.ExtendsKeyword, [
            generator.createExpressionWithTypeArguments(
              undefined,
              generator.createCall(
                generator.createIdentifier("JSXComponent"),
                undefined,
                [generator.createIdentifier("BaseModel")]
              )
            ),
          ]),
        ],
        ["p1", "p2", "p3"].map((name) =>
          generator.createMethod(
            [createDecorator("Method")],
            [],
            undefined,
            generator.createIdentifier(name),
            undefined,
            undefined,
            [],
            undefined,
            generator.createBlock([], false)
          )
        )
      );

      assert.deepEqual(this.getWarnings(), [
        "Component ComponentName has Prop and Api method with same name: p1",
        "Component ComponentName has Prop and Api method with same name: p2",
      ]);
    });

    mocha.it("Prop and Method has same names - no warning", function () {
      createComponentInput([
        generator.createProperty(
          [createDecorator("OneWay")],
          [],
          generator.createIdentifier("p1")
        ),
      ]);

      const component = generator.createClassDeclaration(
        [createDecorator("Component", {})],
        [],
        generator.createIdentifier("ComponentName"),
        [],
        [
          generator.createHeritageClause(generator.SyntaxKind.ExtendsKeyword, [
            generator.createExpressionWithTypeArguments(
              undefined,
              generator.createCall(
                generator.createIdentifier("JSXComponent"),
                undefined,
                [generator.createIdentifier("BaseModel")]
              )
            ),
          ]),
        ],
        [
          generator.createMethod(
            [],
            [],
            undefined,
            generator.createIdentifier("p1"),
            undefined,
            undefined,
            [],
            undefined,
            generator.createBlock([], false)
          ),
        ]
      );

      assert.strictEqual(
        component.members.filter((m) => m._name.toString() === "p1").length,
        2
      );
      assert.deepEqual(this.getWarnings(), []);
    });

    mocha.it(
      "Nested component should not throw warn if one of types is TypeReferenceNode",
      function () {
        createComponentInput([
          generator.createProperty(
            [createDecorator("Nested")],
            undefined,
            generator.createIdentifier("component"),
            undefined,
            generator.createTypeReferenceNode(
              generator.createIdentifier("Custom1")
            )
          ),
          generator.createProperty(
            [createDecorator("Nested")],
            undefined,
            generator.createIdentifier("component"),
            undefined,
            generator.createArrayTypeNode(
              generator.createTypeReferenceNode(
                generator.createIdentifier("Custom2")
              )
            )
          ),
          generator.createProperty(
            [createDecorator("Nested")],
            undefined,
            generator.createIdentifier("component"),
            undefined,
            generator.createUnionTypeNode([
              generator.createTypeReferenceNode(
                generator.createIdentifier("Custom3")
              ),
              generator.createIdentifier("string"),
            ])
          ),
          generator.createProperty(
            [createDecorator("Nested")],
            undefined,
            generator.createIdentifier("component"),
            undefined,
            generator.createParenthesizedType(
              generator.createTypeReferenceNode(
                generator.createIdentifier("Custom4")
              )
            )
          ),
        ]);

        assert.deepEqual(this.getWarnings(), []);
      }
    );

    mocha.it(
      "Nested component should throw warn with not TypeReferenceNode",
      function () {
        createComponentInput([
          generator.createProperty(
            [createDecorator("Nested")],
            undefined,
            generator.createIdentifier("Custom1")
          ),
          generator.createProperty(
            [createDecorator("Nested")],
            undefined,
            generator.createIdentifier("Custom2"),
            undefined,
            generator.createIdentifier("string")
          ),
        ]);

        assert.deepEqual(this.getWarnings(), [
          'One of "Custom1" Nested property\'s types should be complex type',
          'One of "Custom2" Nested property\'s types should be complex type',
        ]);
      }
    );

    mocha.describe("Required props", function () {
      this.beforeEach(function () {
        generator.setContext({
          path: "component.tsx",
        });
      });

      this.afterEach(function () {
        generator.setContext(null);
      });

      function createComponent(
        props: Property[],
        requiredPropsList?: TypeExpression
      ) {
        generator.createClassDeclaration(
          [createDecorator(Decorators.ComponentBindings)],
          [],
          generator.createIdentifier("Props"),
          [],
          [],
          props
        );

        const typeParameters: TypeExpression[] = [
          generator.createTypeReferenceNode(
            generator.createIdentifier("Props"),
            undefined
          ),
        ];

        if (requiredPropsList) {
          typeParameters.push(requiredPropsList);
        }

        return generator.createClassDeclaration(
          [createDecorator(Decorators.Component)],
          [],
          generator.createIdentifier("Widget"),
          [],
          [
            generator.createHeritageClause(
              generator.SyntaxKind.ExtendsKeyword,
              [
                generator.createExpressionWithTypeArguments(
                  undefined,
                  generator.createCall(
                    generator.createIdentifier("JSXComponent"),
                    typeParameters,
                    []
                  )
                ),
              ]
            ),
          ],
          []
        );
      }

      mocha.it(
        "Component has one Required props - throw exception if they not included to component declaration",
        function () {
          createComponent([
            generator.createProperty(
              [createDecorator(Decorators.OneWay)],
              [],
              generator.createIdentifier("p1"),
              generator.SyntaxKind.ExclamationToken
            ),
            generator.createProperty(
              [createDecorator(Decorators.OneWay)],
              [],
              generator.createIdentifier("p2")
            ),

            generator.createProperty(
              [createDecorator(Decorators.OneWay)],
              [],
              generator.createIdentifier("p3"),
              generator.SyntaxKind.ExclamationToken
            ),
          ]);

          assert.strictEqual(
            removeSpaces(this.getWarnings()[0]),
            removeSpaces(
              `Widget component declaration is not correct. Props have required properties. Include their keys to declaration
             Widget extends JSXComponent<Props, "p1"|"p3">`
            )
          );
        }
      );

      mocha.it("Component has one Required props", function () {
        const component = createComponent(
          [
            generator.createProperty(
              [createDecorator(Decorators.OneWay)],
              [],
              generator.createIdentifier("p1"),
              generator.SyntaxKind.ExclamationToken
            ),
            generator.createProperty(
              [createDecorator(Decorators.OneWay)],
              [],
              generator.createIdentifier("p2")
            ),

            generator.createProperty(
              [createDecorator(Decorators.OneWay)],
              [],
              generator.createIdentifier("p3"),
              generator.SyntaxKind.ExclamationToken
            ),
          ],
          generator.createUnionTypeNode([
            generator.createLiteralTypeNode(
              generator.createStringLiteral("p1")
            ),
            generator.createLiteralTypeNode(
              generator.createStringLiteral("p3")
            ),
          ])
        );

        assert.strictEqual(getProps(component.members).length, 3);
      });
    });
  });
});

mocha.describe("ComponentInput from type", function () {
  this.beforeEach(function () {
    generator.setContext({});

    generator.createClassDeclaration(
      [createDecorator(Decorators.ComponentBindings)],
      [],
      generator.createIdentifier("BaseProps"),
      [],
      [],
      [
        generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p1")
        ),
        generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p2")
        ),
        generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p3")
        ),
      ]
    );
  });

  this.afterEach(function () {
    generator.setContext(null);
  });

  mocha.it("Omit<BaseProps, 'p1'>", function () {
    const expression = generator.createTypeAliasDeclaration(
      [],
      ["export"],
      generator.createIdentifier("Props"),
      undefined,
      generator.createTypeReferenceNode(generator.createIdentifier("Omit"), [
        generator.createTypeReferenceNode(
          generator.createIdentifier("BaseProps"),
          undefined
        ),
        generator.createLiteralTypeNode(generator.createStringLiteral("p1")),
      ])
    );

    assert.ok(expression instanceof ComponentInput);
    const members = (expression as ComponentInput).members as Property[];
    assert.deepEqual(
      members.map((m) => m.name),
      ["p2", "p3"]
    );
    assert.strictEqual(
      members[0].initializer?.toString(),
      "new BaseProps().p2"
    );
    assert.equal(generator.getContext().components?.["Props"], expression);
    assert.deepEqual(expression.modifiers, ["export"]);
  });

  mocha.it("Omit<BaseProps, 'p1' | 'p3'>", function () {
    const expression = generator.createTypeAliasDeclaration(
      [],
      [],
      generator.createIdentifier("Props"),
      undefined,
      generator.createTypeReferenceNode(generator.createIdentifier("Omit"), [
        generator.createTypeReferenceNode(
          generator.createIdentifier("BaseProps"),
          undefined
        ),
        generator.createUnionTypeNode([
          generator.createLiteralTypeNode(generator.createStringLiteral("p1")),
          generator.createLiteralTypeNode(generator.createStringLiteral("p3")),
        ]),
      ])
    );

    assert.ok(expression instanceof ComponentInput);
    assert.deepEqual(
      (expression as ComponentInput).members.map((m) => m.name),
      ["p2"]
    );
  });

  mocha.it("Pick<BaseProps, 'p1'>", function () {
    const expression = generator.createTypeAliasDeclaration(
      [],
      [],
      generator.createIdentifier("Props"),
      undefined,
      generator.createTypeReferenceNode(generator.createIdentifier("Pick"), [
        generator.createTypeReferenceNode(
          generator.createIdentifier("BaseProps"),
          undefined
        ),
        generator.createLiteralTypeNode(generator.createStringLiteral("p1")),
      ])
    );

    assert.ok(expression instanceof ComponentInput);
    assert.deepEqual(
      (expression as ComponentInput).members.map((m) => m.name),
      ["p1"]
    );
  });

  mocha.it(
    "Pick<BaseProps, 10> - do not convert to component input",
    function () {
      const expression = generator.createTypeAliasDeclaration(
        [],
        [],
        generator.createIdentifier("Props"),
        undefined,
        generator.createTypeReferenceNode(generator.createIdentifier("Pick"), [
          generator.createTypeReferenceNode(
            generator.createIdentifier("BaseProps"),
            undefined
          ),
          generator.createLiteralTypeNode(generator.createNumericLiteral("10")),
        ])
      );

      assert.ok(!(expression instanceof ComponentInput));
    }
  );

  mocha.it("Pick<BaseProps, keyof BaseProps>", function () {
    const expression = generator.createTypeAliasDeclaration(
      [],
      [],
      generator.createIdentifier("Props"),
      undefined,
      generator.createTypeReferenceNode(generator.createIdentifier("Pick"), [
        generator.createTypeReferenceNode(
          generator.createIdentifier("BaseProps"),
          undefined
        ),
        generator.createTypeOperatorNode(
          generator.createTypeReferenceNode(
            generator.createIdentifier("BaseProps")
          )
        ),
      ])
    );

    assert.ok(expression instanceof ComponentInput);
    assert.deepEqual(
      (expression as ComponentInput).members.map((m) => m.name),
      ["p1", "p2", "p3"]
    );
  });

  mocha.it("Pick & Omit", function () {
    const expression = generator.createTypeAliasDeclaration(
      [],
      [],
      generator.createIdentifier("Props"),
      undefined,
      generator.createIntersectionTypeNode([
        generator.createTypeReferenceNode(generator.createIdentifier("Pick"), [
          generator.createTypeReferenceNode(
            generator.createIdentifier("BaseProps"),
            undefined
          ),
          generator.createLiteralTypeNode(generator.createStringLiteral("p1")),
        ]),
        generator.createTypeReferenceNode(generator.createIdentifier("Omit"), [
          generator.createTypeReferenceNode(
            generator.createIdentifier("BaseProps"),
            undefined
          ),
          generator.createUnionTypeNode([
            generator.createLiteralTypeNode(
              generator.createStringLiteral("p1")
            ),
            generator.createLiteralTypeNode(
              generator.createStringLiteral("p3")
            ),
          ]),
        ]),
      ])
    );

    assert.ok(expression instanceof ComponentInput);
    assert.deepEqual(
      (expression as ComponentInput).members.map((m) => m.name),
      ["p1", "p2"]
    );
  });

  mocha.it("Props1 & Props2", function () {
    generator.createClassDeclaration(
      [createDecorator(Decorators.ComponentBindings)],
      [],
      generator.createIdentifier("Props2"),
      [],
      [],
      [
        generator.createProperty(
          [createDecorator(Decorators.TwoWay)],
          [],
          generator.createIdentifier("p3")
        ),
        generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p4")
        ),
      ]
    );
    const expression = generator.createTypeAliasDeclaration(
      [],
      [],
      generator.createIdentifier("Props"),
      undefined,
      generator.createIntersectionTypeNode([
        generator.createTypeReferenceNode(
          generator.createIdentifier("BaseProps"),
          undefined
        ),
        generator.createTypeReferenceNode(
          generator.createIdentifier("Props2"),
          undefined
        ),
      ])
    );

    assert.ok(expression instanceof ComponentInput);
    const members = (expression as ComponentInput).members as Property[];
    assert.deepEqual(
      members.map((m) => m.name),
      ["p1", "p2", "p3", "p4", "defaultP3", "p3Change"]
    );

    assert.strictEqual(
      members[0].initializer?.toString(),
      "new BaseProps().p1"
    );
    assert.strictEqual(members[3].initializer?.toString(), "new Props2().p4");
    assert.strictEqual(
      members[4].initializer?.toString(),
      "new Props2().defaultP3"
    );
  });

  mocha.describe("collectMissedImports", function () {
    this.beforeEach(function () {
      generator.setContext({
        dirname: __dirname,
        path: __filename,
      });
    });

    this.afterEach(function () {
      generator.setContext(null);
    });
    mocha.it("Without import in context", function () {
      generator.createTypeAliasDeclaration(
        [],
        [generator.SyntaxKind.ExportKeyword],
        generator.createIdentifier("MyType"),
        undefined,
        generator.createKeywordTypeNode("number")
      );

      const TypeReferenceNode = generator.createTypeReferenceNode(
        generator.createIdentifier("MyType")
      );

      generator.setContext({
        dirname: __dirname,
        path: path.resolve("./test-cases/src/props.tsx"),
      });

      const expression = generator.createClassDeclaration(
        [createDecorator(Decorators.ComponentBindings)],
        [],
        generator.createIdentifier("Props"),
        [],
        [],
        [
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            undefined,
            generator.createIdentifier("p"),
            undefined,
            TypeReferenceNode
          ),
        ]
      );

      generator.setContext(null);

      assert.deepEqual(expression.collectMissedImports(), {
        "./base-generator.test": ["MyType"],
      });
    });

    mocha.it("Do not import if module has such type", function () {
      generator.createTypeAliasDeclaration(
        [],
        [generator.SyntaxKind.ExportKeyword],
        generator.createIdentifier("MyType"),
        undefined,
        generator.createKeywordTypeNode("number")
      );

      const TypeReferenceNode = generator.createTypeReferenceNode(
        generator.createIdentifier("MyType")
      );

      generator.setContext({
        dirname: __dirname,
        path: path.resolve("./test-cases/src/props.tsx"),
      });

      generator.createTypeAliasDeclaration(
        [],
        [generator.SyntaxKind.ExportKeyword],
        generator.createIdentifier("MyType"),
        undefined,
        generator.createKeywordTypeNode("number")
      );

      const expression = generator.createClassDeclaration(
        [createDecorator(Decorators.ComponentBindings)],
        [],
        generator.createIdentifier("Props"),
        [],
        [],
        [
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            undefined,
            generator.createIdentifier("p"),
            undefined,
            TypeReferenceNode
          ),
        ]
      );

      generator.setContext(null);

      assert.deepEqual(expression.collectMissedImports(), {});
    });

    mocha.it("Do not import if module has such interface", function () {
      generator.createTypeAliasDeclaration(
        [],
        [generator.SyntaxKind.ExportKeyword],
        generator.createIdentifier("MyType"),
        undefined,
        generator.createKeywordTypeNode("number")
      );

      const TypeReferenceNode = generator.createTypeReferenceNode(
        generator.createIdentifier("MyType")
      );

      generator.setContext({
        dirname: __dirname,
        path: path.resolve("./test-cases/src/props.tsx"),
      });

      generator.createInterfaceDeclaration(
        [],
        [],
        generator.createIdentifier("MyType"),
        [],
        [],
        []
      );

      const expression = generator.createClassDeclaration(
        [createDecorator(Decorators.ComponentBindings)],
        [],
        generator.createIdentifier("Props"),
        [],
        [],
        [
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            undefined,
            generator.createIdentifier("p"),
            undefined,
            TypeReferenceNode
          ),
        ]
      );

      generator.setContext(null);

      assert.deepEqual(expression.collectMissedImports(), {});
    });
  });
});

mocha.describe("import Components", function () {
  this.beforeEach(function () {
    generator.setContext({ dirname: path.resolve(__dirname) });
  });

  this.afterEach(function () {
    generator.setContext(null);
  });

  mocha.it("Parse imported component", function () {
    const identifier = generator.createIdentifier("Base");
    generator.createImportDeclaration(
      undefined,
      undefined,
      generator.createImportClause(identifier, undefined),
      generator.createStringLiteral(
        "./test-cases/declarations/src/empty-component"
      )
    );

    const baseModulePath = path.resolve(
      `${__dirname}/test-cases/declarations/src/empty-component.tsx`
    );
    assert.ok(generator.cache[baseModulePath]);
    assert.deepEqual(
      generator
        .getContext()
        .components!["Base"].heritageProperties.map((p) => p.name.toString()),
      ["height", "width"]
    );
  });

  mocha.it(
    "Parse imported component. module specifier has extension",
    function () {
      const identifier = generator.createIdentifier("Base");
      generator.createImportDeclaration(
        undefined,
        undefined,
        generator.createImportClause(identifier, undefined),
        generator.createStringLiteral(
          "./test-cases/declarations/src/empty-component.tsx"
        )
      );

      const baseModulePath = path.resolve(
        `${__dirname}/test-cases/declarations/src/empty-component.tsx`
      );
      assert.ok(generator.cache[baseModulePath]);
      assert.deepEqual(
        generator
          .getContext()
          .components!["Base"].heritageProperties.map((p) => p.name.toString()),
        ["height", "width"]
      );
    }
  );

  mocha.it("Get properties from heritageClause", function () {
    generator.createImportDeclaration(
      undefined,
      undefined,
      generator.createImportClause(
        generator.createIdentifier("Base"),
        undefined
      ),
      generator.createStringLiteral(
        "./test-cases/declarations/src/empty-component"
      )
    );

    const heritageClause = generator.createHeritageClause(
      generator.SyntaxKind.ExtendsKeyword,
      [
        generator.createExpressionWithTypeArguments(
          undefined,
          generator.createIdentifier("Base")
        ),
      ]
    );

    assert.deepEqual(
      heritageClause.members.map((m) => m.name.toString()),
      ["height", "width"]
    );
  });

  mocha.it("Get properties from heritageClause without import", function () {
    const heritageClause = generator.createHeritageClause(
      generator.SyntaxKind.ExtendsKeyword,
      [
        generator.createExpressionWithTypeArguments(
          undefined,
          generator.createIdentifier("Base")
        ),
      ]
    );

    assert.deepEqual(
      heritageClause.members.map((m) => m.toString()),
      []
    );
  });

  mocha.it("Parse imported component input", function () {
    const expression = generator.createImportDeclaration(
      undefined,
      undefined,
      generator.createImportClause(
        generator.createIdentifier("Widget"),
        generator.createNamedImports([
          generator.createImportSpecifier(
            undefined,
            generator.createIdentifier("WidgetProps")
          ),
        ])
      ),
      generator.createStringLiteral(
        "./test-cases/declarations/src/component-input"
      )
    );

    const baseModulePath = path.resolve(
      `${__dirname}/test-cases/declarations/src/component-input.tsx`
    );
    assert.strictEqual(
      expression.toString(),
      `import Widget,{WidgetProps} from "./test-cases/declarations/src/component-input"`
    );
    assert.ok(generator.cache[baseModulePath]);
    assert.ok(
      generator.getContext().components!["Widget"] instanceof Component
    );
    assert.ok(
      generator.getContext().components!["WidgetProps"] instanceof
        ComponentInput
    );
  });

  mocha.it("ComponentInput gets all members from heritage clause", function () {
    generator.createImportDeclaration(
      undefined,
      undefined,
      generator.createImportClause(
        generator.createIdentifier("Widget"),
        generator.createNamedImports([
          generator.createImportSpecifier(
            undefined,
            generator.createIdentifier("WidgetProps")
          ),
        ])
      ),
      generator.createStringLiteral(
        "./test-cases/declarations/src/component-input"
      )
    );

    const heritageClause = generator.createHeritageClause(
      generator.SyntaxKind.ExtendsKeyword,
      [
        generator.createExpressionWithTypeArguments(
          undefined,
          generator.createIdentifier("WidgetProps")
        ),
      ]
    );

    const model = new ComponentInput(
      [],
      [],
      generator.createIdentifier("Model"),
      [],
      [heritageClause],
      [],
      generator.getContext()
    );

    assert.deepEqual(
      model.members.map((m) => m.name.toString()),
      ["height", "width", "children"]
    );
  });
});

mocha.describe(
  "Expressions with toStringOptions should pass it in internal expressions",
  function () {
    const property = generator.createProperty(
      [createDecorator("OneWay")],
      undefined,
      generator.createIdentifier("p")
    );

    const propertyAccess = generator.createPropertyAccess(
      generator.createPropertyAccess(
        generator.createThis(),
        generator.createIdentifier("props")
      ),
      generator.createIdentifier("p")
    );

    const getToStringOptions = (): toStringOptions => ({
      members: [property],
      componentContext: "this",
      newComponentContext: "",
    });

    mocha.it("Array literal", function () {
      const expression = generator.createArrayLiteral([propertyAccess], true);

      assert.strictEqual(expression.toString(getToStringOptions()), "[p]");
    });

    mocha.it("Object literal", function () {
      const expression = generator.createObjectLiteral(
        [
          generator.createPropertyAssignment(
            generator.createIdentifier("p"),
            propertyAccess
          ),
        ],
        true
      );

      assert.strictEqual(expression.toString(getToStringOptions()), "{p:p}");
    });

    mocha.it("Spread Assignment", function () {
      const expression = generator.createSpreadAssignment(propertyAccess);

      assert.strictEqual(expression.toString(getToStringOptions()), "...p");
    });
  }
);
