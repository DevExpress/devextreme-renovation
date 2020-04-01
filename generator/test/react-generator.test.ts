import assert from "assert";
import mocha from "mocha";
import ts, { SyntaxKind } from "typescript";
import generator, { ReactComponent, State, InternalState, Prop, ComponentInput, Property, Method, GeneratorContex, toStringOptions, SimpleExpression, PropertyAccess, ElementAccess, Class } from "../react-generator";

import compile from "../component-compiler";
import path from "path";

function createComponentDecorator(paramenters: {[name:string]: any}) { 
    return generator.createDecorator(
        generator.createCall(
            generator.createIdentifier("Component"),
            [],
            [generator.createObjectLiteral(
                Object.keys(paramenters).map(k => 
                    generator.createPropertyAssignment(
                        generator.createIdentifier(k),
                        paramenters[k]
                    )
                ),
                false
            )]
        )
    )
}

import { printSourceCodeAst as getResult, createTestGenerator } from "./helpers/common";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

function createDecorator(name: string) { 
    return generator.createDecorator(
        generator.createCall(generator.createIdentifier(name), [], [])
    );
}

mocha.describe("react-generator", function () {
    this.beforeAll(function () {
        const testGenerator = createTestGenerator("react");
        compile(`${__dirname}/test-cases/declarations`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            testGenerator.call(this, componentName, generator);
        };
    });

    this.beforeEach(function () {
        generator.setContext({ dirname: path.resolve(__dirname, "./test-cases/declarations") });
    });

    this.afterEach(function () {
        if (this.currentTest!.state !== "passed") {
            console.log(this.currentTest?.ctx?.code); // TODO: diff with expected
        }
        generator.setContext(null);
        if (this.currentTest?.ctx) { 
            this.currentTest.ctx.code = null;
            this.currentTest.ctx.expectedCode = null;
        }
    });

    mocha.it("variable-declaration", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("functions", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("objects", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("conditions", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("expressions", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("empty-component", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("internal-state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("listen", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("listen-with-target", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("props-in-listener", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jsx-events", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("template", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("refs", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("effect", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("slots", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("extend-props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("method", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("method-use-apiref", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("component-input", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.describe("Default option rules", function () {
        this.beforeEach(function () {
            generator.defaultOptionsModule = "../component_declaration/default_options";
            generator.setContext({
                dirname: path.resolve(__dirname, "./test-cases/expected/react"),
                defaultOptionsModule: path.resolve(generator.defaultOptionsModule)
            });
        });

        this.afterEach(function () { 
            generator.setContext(null);
            generator.defaultOptionsModule = "";
        });

        mocha.it("default-options-empty", function () { 
            this.testGenerator(this.test!.title);
        })
    });
});

mocha.describe("react-generator: expressions", function () {
    mocha.it("Indentifier", function () {
        const identifier = generator.createIdentifier("a");
        assert.equal(identifier, 'a');
        assert.deepEqual(identifier.getDependency(), []);
    });
    mocha.it("createStringLiteral", function () {
        assert.strictEqual(generator.createStringLiteral("a").toString(), '"a"');
    });
    mocha.it("createNumericLiteral", function () {
        assert.strictEqual(generator.createNumericLiteral("10").toString(), "10");
    });
    mocha.it("createArrayTypeNode", function () {
        assert.strictEqual(generator.createArrayTypeNode(generator.SyntaxKind.NumberKeyword), "number[]");
    });
    mocha.it("createLiteralTypeNode", function () { 
        assert.strictEqual(generator.createLiteralTypeNode(generator.createStringLiteral("2")).toString(), '"2"'); ;
    });
    mocha.it("VaraibleDeclaration", function () {
        const identifier = generator.createIdentifier("a");
        assert.equal(generator.createVariableDeclaration(identifier, undefined, undefined).toString(), 'a', "w/o initializer");
        assert.equal(generator.createVariableDeclaration(identifier, undefined, generator.createStringLiteral("str")).toString(), 'a="str"', "w initializer");
        assert.equal(generator.createVariableDeclaration(identifier, "string", undefined).toString(), 'a:string', "w type");
        assert.equal(generator.createVariableDeclaration(identifier, "string", generator.createStringLiteral("str")).toString(), 'a:string="str"', "w type and initializer");
    });

    mocha.it("createJsxText", function () {
        assert.strictEqual(generator.createJsxText("test string", "false"), "test string");
        assert.strictEqual(generator.createJsxText("test string", "true"), "");
    });

    mocha.describe("VaraibleDeclarationList", function () {
        mocha.it("toString", function () {
            const expresion = generator.createVariableDeclarationList(
                [
                    generator.createVariableDeclaration(generator.createIdentifier("a"), undefined, generator.createStringLiteral("str")),
                    generator.createVariableDeclaration(generator.createIdentifier("b"), undefined, generator.createNumericLiteral("10"))
                ],
                generator.NodeFlags.Const
            );
    
            assert.equal(expresion.toString(), 'const a="str",b=10');
        });

        mocha.it("createVariableDeclaration - getVariableExpression", function () { 
            const expresion = generator.createVariableDeclaration(
                generator.createIdentifier("a"),
                undefined,
                generator.createStringLiteral("str")
            );

            const list = expresion.getVariableExpressions();
            assert.strictEqual(Object.keys(list).length, 1);
            assert.strictEqual(list["a"].toString(), `"str"`);    
        });

        mocha.it("createVariableDeclaration without initializer - getVariableExpression should return empty object", function () { 
            const expresion = generator.createVariableDeclaration(
                generator.createIdentifier("a")
            );

            assert.deepEqual(expresion.getVariableExpressions(), {});  
        });

        mocha.it("createVariableDeclaration - wrap expression in paren complex", function () { 
            const expresion = generator.createVariableDeclaration(
                generator.createIdentifier("a"),
                undefined,
                generator.createBinary(
                    generator.createIdentifier("i"),
                    generator.SyntaxKind.MinusToken,
                    generator.createIdentifier("j")
                )
            );

            const list = expresion.getVariableExpressions();
            assert.strictEqual(Object.keys(list).length, 1);
            assert.strictEqual(list["a"].toString(), `(i-j)`);    
        });

        mocha.it("getVariableExpression from VariableDeclaration", function () {
            const expresion = generator.createVariableDeclarationList(
                [
                    generator.createVariableDeclaration(generator.createIdentifier("a"), undefined, generator.createStringLiteral("str")),
                    generator.createVariableDeclaration(generator.createIdentifier("b"), undefined, generator.createNumericLiteral("10"))
                ],
                generator.NodeFlags.Const
            );

            const variableList = expresion.getVariableExpressions();

            assert.strictEqual(Object.keys(variableList).length, 2);
    
            assert.equal(variableList["a"].toString(), '"str"');
            assert.equal(variableList["b"].toString(), '10');
        });

        mocha.it("VariableDeclaration with object binding pattern - getVariableDeclaration", function () {
            const expresion = generator.createVariableDeclaration(
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
                        generator.createObjectBindingPattern([generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("source"),
                            undefined
                        )]),
                        undefined
                    )
                ]),
                undefined,
                generator.createIdentifier("this")
            );

            const list = expresion.getVariableExpressions();
            
            assert.strictEqual(Object.keys(list).length, 2);
            assert.strictEqual(list["height"].toString(), "this.height");
            assert.strictEqual(list["source"].toString(), "this.props.source");
            assert.ok(list["height"] instanceof PropertyAccess);
        });

        mocha.it("VariableDeclaration with object binding pattern with string name - getVariableDeclaration", function () {
            const expresion = generator.createVariableDeclaration(
                generator.createObjectBindingPattern([
                    generator.createBindingElement(
                        undefined,
                        undefined,
                        "height",
                        undefined
                    )
                ]),
                undefined,
                generator.createIdentifier("this")
            );

            const list = expresion.getVariableExpressions();
            
            assert.strictEqual(Object.keys(list).length, 1);
            assert.strictEqual(list["height"].toString(), "this.height");
            assert.ok(list["height"] instanceof PropertyAccess);
        });

        mocha.it("VariableDeclaration with array binding pattern - getVariableDeclaration", function () {
            const expresion = generator.createVariableDeclaration(
                generator.createArrayBindingPattern([generator.createBindingElement(
                    undefined,
                    undefined,
                    generator.createIdentifier("height"),
                    undefined
                )]),
                undefined,
                generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("props")
                )
            );

            const list = expresion.getVariableExpressions();
            
            assert.strictEqual(Object.keys(list).length, 1);
            assert.strictEqual(list["height"].toString(), "this.props[0]");
            assert.ok(list["height"] instanceof ElementAccess);
        });

        mocha.it("can replace Identifer with expression", function () { 
            const identifer = generator.createIdentifier("name");
            const expression = generator.createNumericLiteral("10");

            assert.strictEqual(identifer.toString({
                props: [],
                state: [],
                internalState: [],
                members: [],
                variables: {
                    name: expression
                }
            }), "10");
        });

        mocha.it("can replace Identifer with expression in JSX self-closing element", function () { 
            const identifer = generator.createIdentifier("render");
            const element = generator.createJsxSelfClosingElement(
                identifer,
                [],
                []
            );
            
            const expression = new SimpleExpression("viewModel.props.template");

            assert.strictEqual(element.toString({
                props: [],
                state: [],
                internalState: [],
                members: [],
                variables: {
                    render: expression
                }
            }), "<viewModel.props.template />");
        });

        mocha.it("can replace Identifer with expression in JSX element", function () { 
            const identifer = generator.createIdentifier("render");
            const element = generator.createJsxElement(
                generator.createJsxOpeningElement(
                    identifer,
                    [],
                    []
                ),
                [],
                generator.createJsxClosingElement(
                    identifer
                )
            );
            
            const expression = new SimpleExpression("viewModel.props.template");

            assert.strictEqual(element.toString({
                props: [],
                state: [],
                internalState: [],
                members: [],
                variables: {
                    render: expression
                }
            }), "<viewModel.props.template ></viewModel.props.template>");
        });

        mocha.it("PropertyAccess", function () { 
            const propertyAccess = generator.createPropertyAccess(
                generator.createIdentifier("name"),
                generator.createIdentifier("name")
            );

            assert.strictEqual(propertyAccess.toString({
                props: [],
                state: [],
                internalState: [],
                members: [],
                variables: {
                    name: generator.createIdentifier("v")
                }
            }), "v.name");
        });

        mocha.it("Can replace identifer in shortland property assignment", function () { 
            const expresstion = generator.createObjectLiteral(
                [
                    generator.createShorthandPropertyAssignment(
                        generator.createIdentifier("v")
                    )
                ],
                false
            );

            assert.strictEqual(expresstion.toString({
                props: [],
                state: [],
                internalState: [],
                members: [],
                variables: {
                    v: generator.createIdentifier("value")
                }
            }), "{v:value}");
        });
    });

    mocha.it("createIndexSignature", function () { 
        const expression = generator.createIndexSignature(
            undefined,
            undefined,
            [generator.createParameter(
                undefined,
                undefined,
                undefined,
                generator.createIdentifier("name"),
                undefined,
                generator.createKeywordTypeNode(generator.SyntaxKind.StringKeyword),
                undefined
            )],
            generator.createKeywordTypeNode(generator.SyntaxKind.NumberKeyword)
        );

        assert.equal(expression.toString(), "[name:string]:number");
    });

    mocha.it("createImportDeclaration", function () { 
        assert.equal(generator.createImportDeclaration(
            undefined,
            undefined,
            undefined,
            generator.createStringLiteral("typescript")
        ), 'import "typescript"');

        assert.equal(generator.createImportDeclaration(
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
                    )
                ])
            ),
            generator.createStringLiteral("typescript")
        ), 'import {SyntaxKind,AffectedFileResult} from "typescript"');

        assert.equal(generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("ts"),
                generator.createNamedImports([generator.createImportSpecifier(
                    undefined,
                    generator.createIdentifier("Node")
                )])
            ),
            generator.createStringLiteral("typescript")
        ), 'import ts,{Node} from "typescript"');

        assert.equal(generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Button"),
              undefined
            ),
            generator.createStringLiteral("./button")
          ), 'import Button from "./button"')
    });

    mocha.it("createImportDeclaration exclude imports from component_declaration/jsx to component_declaration/jsx-g", function () { 
        assert.equal(generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("JSXConstructor"),
              undefined
            ),
            generator.createStringLiteral("../../component_declaration/jsx")
          ), 'import JSXConstructor from "../../component_declaration/jsx-g"')
    });

    mocha.it("createImportDeclaration change import ", function () { 
        assert.equal(generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Button"),
              undefined
            ),
            generator.createStringLiteral("../../component_declaration/common")
          ), '')
    });

    mocha.it("VariableStatement", function () {
        const identifier = generator.createIdentifier("a");
        const declarationList = generator.createVariableDeclarationList(
            [generator.createVariableDeclaration(identifier, undefined, generator.createStringLiteral("str"))],
            generator.NodeFlags.Const
        );
        assert.equal(
            generator.createVariableStatement([
                generator.SyntaxKind.DefaultKeyword,
                generator.SyntaxKind.ExportKeyword
            ], declarationList).toString(), 'default export const a="str"');
    });

    mocha.it("ArrayLiteral", function () {
        assert.equal(
            generator.createArrayLiteral([
                generator.createNumericLiteral("1"),
                generator.createIdentifier("a")
            ], true).toString(), '[1,a]');
    });

    mocha.it("PropertyAssignment", function () {
        assert.equal(generator.createPropertyAssignment(
            generator.createIdentifier("k"),
            generator.createIdentifier("a")
        ).toString(), 'k:a');
    });

    mocha.it("ShorthandPropertyAssignment", function () {
        const propertyAssignment = generator.createShorthandPropertyAssignment(generator.createIdentifier("k"), undefined);
        assert.equal(propertyAssignment.toString(), 'k');
        assert.equal(propertyAssignment.key, "k");
        assert.equal(propertyAssignment.value, "k");
    });

    mocha.it("SpreadAssignement", function () {
        const propertyAssignment = generator.createSpreadAssignment(generator.createIdentifier("obj"));
        assert.equal(propertyAssignment.toString(), '...obj');
    });

    mocha.it("ObjectLiteral", function () {
        const objectLiteral = generator.createObjectLiteral([
            generator.createShorthandPropertyAssignment(generator.createIdentifier("a"), undefined),
            generator.createPropertyAssignment(generator.createIdentifier("k"), generator.createIdentifier("a")),
            generator.createSpreadAssignment(generator.createIdentifier("obj"))
        ], true);
        assert.equal(objectLiteral.toString(), '{a,\nk:a,\n...obj}');
    });

    mocha.it("Paren", function () {
        assert.equal(generator.createParen(generator.createIdentifier("a")).toString(), "(a)");
    });

    mocha.it("Block", function () {
        assert.equal(generator.createBlock([], true).toString().replace(/\s+/g, ""), "{}");
        const expression = generator.createBlock([
            generator.createVariableDeclarationList(
                [
                    generator.createVariableDeclaration(generator.createIdentifier("a"), undefined, generator.createStringLiteral("str")),
                    generator.createVariableDeclaration(generator.createIdentifier("b"), undefined, generator.createNumericLiteral("10"))
                ],
                generator.NodeFlags.Const
            )
        ], true);

        const actualString = expression.toString();
        assert.equal(getResult(actualString), getResult('{const a="str", b=10}'));
    });

    mocha.it("Call", function () {
        assert.equal(generator.createCall(
            generator.createIdentifier("a"),
            undefined,
            [generator.createStringLiteral("a"), generator.createNumericLiteral("10")]
        ).toString(), 'a("a",10)');
    });

    mocha.it("createNew", function () {
        assert.equal(generator.createNew(
            generator.createIdentifier("a"),
            undefined,
            [generator.createStringLiteral("a"), generator.createNumericLiteral("10")]
        ).toString(), 'new a("a",10)');
    });

    mocha.it("PropertyAccess", function () {
        assert.equal(generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field")
        ).toString(), "this.field");
    });

    mocha.it("Binary", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));

        assert.equal(generator.createBinary(
            expression,
            generator.SyntaxKind.EqualsToken,
            expression
        ).toString(), "this.field=this.field");
    });

    mocha.it("ReturnStatement", function () {
        assert.equal(generator.createReturn(generator.createNumericLiteral("10")).toString(), "return 10;")
    });

    mocha.it("ElementAccess", function () {
        const expression = generator.createElementAccess(
            generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field")),
            generator.createNumericLiteral("10")
        );
        assert.equal(expression.toString(), "this.field[10]");
            
        assert.deepEqual(expression.getDependency(), ["field"]);
    });

    mocha.it("ElementAccess: getDependency shoud take into account index expression", function () {
        const expression = generator.createElementAccess(
            generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field")),
            generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field1"))
        );
        assert.equal(expression.toString(), "this.field[this.field1]");
            
        assert.deepEqual(expression.getDependency(), ["field", "field1"]);
    });

    mocha.it("NonNullExpression", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));
        assert.equal(generator.createNonNullExpression(expression).toString(), "this.field!")
    });

    mocha.it("Prefix", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));
        assert.equal(generator.createPrefix(generator.SyntaxKind.ExclamationToken, expression).toString(), "!this.field")
    });

    mocha.it("Postfix", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));
        assert.equal(generator.createPostfix(expression, generator.SyntaxKind.PlusPlusToken).toString(), "this.field++");
    });

    mocha.it("If w/o else statement", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));
        const condition = generator.createTrue();

        assert.equal(getResult(generator.createIf(condition, expression).toString()), getResult("if(true)this.field"));
    });

    mocha.it("If w else statement", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));
        const condition = generator.createTrue();

        assert.equal(getResult(generator.createIf(condition, expression, expression).toString()), getResult("if(true) this.field else this.field"));
    });

    mocha.it("Parameter w type and initializer", function () {
        const parameter = generator.createParameter(
            [],
            [generator.SyntaxKind.ExportKeyword],
            undefined,
            generator.createIdentifier("a"),
            generator.SyntaxKind.QuestionToken,
            "string",
            undefined
        );

        assert.equal(parameter.toString(), "a");
        assert.equal(parameter.declaration(), "a?:string");
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

        assert.equal(parameter.toString(), "a");
        assert.equal(parameter.declaration(), "a", "declaration");
        assert.equal(parameter.typeDeclaration(), "a:any", "typeDeclaration");
    });

    mocha.it("Parameter w type", function () {
        const parameter = generator.createParameter(
            [],
            [generator.SyntaxKind.ExportKeyword],
            undefined,
            generator.createIdentifier("a"),
            generator.SyntaxKind.QuestionToken,
            "string",
            undefined
        );

        assert.equal(parameter.toString(), "a");
        assert.equal(parameter.declaration(), "a?:string");
        assert.equal(parameter.typeDeclaration(), "a?:string");
    });

    mocha.it("Parameter w initializer", function () {
        const parameter = generator.createParameter(
            [],
            [generator.SyntaxKind.ExportKeyword],
            undefined,
            generator.createIdentifier("a"),
            generator.SyntaxKind.QuestionToken,
            "string",
            generator.createStringLiteral("str")
        );

        assert.equal(parameter.toString(), "a");
        assert.equal(parameter.declaration(), 'a?:string="str"');
        assert.equal(parameter.typeDeclaration(), "a?:string");
    });

    mocha.it("createPropertySignature", function () {
        const propertySignatureWithQuestionToken = generator.createPropertySignature(
            [],
            generator.createIdentifier("a"),
            generator.SyntaxKind.QuestionToken,
            "string"
        );

        const propertySignatureWithoutQuestionToken = generator.createPropertySignature(
            [],
            generator.createIdentifier("a"),
            undefined,
            "string"
        );

        assert.equal(propertySignatureWithQuestionToken.toString(), "a?:string");
        assert.equal(propertySignatureWithoutQuestionToken.toString(), "a:string");
    });

    mocha.it("createTypeLiteralNode", function () {
        const propertySignatureWithQuestionToken = generator.createPropertySignature(
            [],
            generator.createIdentifier("a"),
            generator.SyntaxKind.QuestionToken,
            "string"
        );

        const propertySignatureWithoutQuestionToken = generator.createPropertySignature(
            [],
            generator.createIdentifier("b"),
            undefined,
            "string"
        );

        assert.equal(generator.createTypeLiteralNode(
            [propertySignatureWithQuestionToken,
            propertySignatureWithoutQuestionToken
            ]
        ), "{a?:string,b:string}");
    });

    mocha.it("createTypeAliasDeclaration", function () { 
        const literalNode = generator.createTypeLiteralNode(
            [generator.createPropertySignature(
                [],
                generator.createIdentifier("b"),
                undefined,
                "string"
            )]
        );
        const expression = generator.createTypeAliasDeclaration(
            undefined,
            ["export", "declare"],
            generator.createIdentifier("Name"),
            [],
            literalNode);

        assert.strictEqual(expression.toString(), "export declare type Name = {b:string}");
    });

    mocha.it("TypeQueryNode", function () { 
        const expression = generator.createTypeQueryNode(generator.createIdentifier("Component"));

        assert.strictEqual(expression.toString(), "typeof Component");
    });
    
    mocha.it("createIntersectionTypeNode", function () {
        assert.equal(generator.createIntersectionTypeNode(
            ["string", "number"]
        ), "string&number");
    });

    mocha.it("createUnionTypeNode", function () {
        assert.equal(generator.createUnionTypeNode(
            ["string", "number"]
        ), "string|number");
    });

    mocha.it("CreateBreak", function () { 
        assert.equal(generator.createBreak().toString(), "break");
    });

    mocha.it("createConditional", function () { 
        const expression = generator.createConditional(
            generator.createIdentifier("a"),
            generator.createFalse(),
            generator.createTrue());
        
        assert.equal(expression.toString(), "a?false:true");
    });

    mocha.it("createTemplateExpression", function () {
        const expression = generator.createTemplateExpression(
            generator.createTemplateHead(
                "a",
                "a"
            ),
            [
                generator.createTemplateSpan(
                    generator.createNumericLiteral("1"),
                    generator.createTemplateMiddle(
                        "b",
                        "b"
                    )
                ),
                generator.createTemplateSpan(
                    generator.createNumericLiteral("2"),
                    generator.createTemplateTail(
                        "c",
                        "c"
                    )
                )
            ]
        );

        assert.equal(expression.toString(), "`a${1}b${2}c`");
    });

    mocha.it("createTemplateExpression - convert to string concatination", function () {
        const expression = generator.createTemplateExpression(
            generator.createTemplateHead(
                "a",
                "a"
            ),
            [
                generator.createTemplateSpan(
                    generator.createNumericLiteral("1"),
                    generator.createTemplateMiddle(
                        "b",
                        "b"
                    )
                ),
                generator.createTemplateSpan(
                    generator.createNumericLiteral("2"),
                    generator.createTemplateTail(
                        "c",
                        "c"
                    )
                )
            ]
        );

        assert.equal(expression.toString({
            disableTemplates: true,
            members: [],
            props: [],
            internalState: [],
            state: []
        }), `"a"+1+"b"+2+"c"`);
    });

    mocha.it("createNoSubstitutionTemplateLiteral", function () {
        const expression = generator.createNoSubstitutionTemplateLiteral("10", "10");

        assert.equal(expression.toString(), "`10`");
    });
    
    mocha.it("While", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));
        const condition = generator.createTrue();

        assert.equal(getResult(generator.createWhile(condition, expression).toString()), getResult("while(true)this.field"));
    });

    mocha.it("DoWhile", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));
        const condition = generator.createTrue();

        assert.equal(getResult(generator.createDo(expression, condition).toString()), getResult("do this.field while(true)"));
    });

    mocha.it("For", function () {
        const expression = generator.createFor(
            generator.createIdentifier("i"),
            generator.createTrue(),
            generator.createPostfix(
                generator.createIdentifier("i"),
                generator.SyntaxKind.PlusPlusToken
            ),
            generator.createBlock(
                [generator.createContinue()],
                true
            )
        );

        assert.equal(getResult(expression.toString()), getResult("for(i;true;i++){continue}"));
    });

    mocha.it("ForIn", function () { 
        const expression = generator.createForIn(
            generator.createVariableDeclarationList(
                [generator.createVariableDeclaration(
                    generator.createIdentifier("i"),
                    undefined,
                    undefined
                )],
                generator.NodeFlags.Let
            ),
            generator.createIdentifier("obj"),
            generator.createBlock(
                [],
                true
            )
        );

        const actualString = expression.toString();

        assert.equal(getResult(actualString), getResult("for(let i in obj){}"));
    });

    mocha.it("createJsxSpreadAttribute", function () { 
        const expression = generator.createJsxSpreadAttribute(
            generator.createIdentifier("field"));
        
        assert.equal(expression.toString(), "{...field}");
    });

    mocha.it("createSwitch", function () {
        const clause1 = generator.createCaseClause(generator.createNumericLiteral("1"), [
            generator.createVariableDeclarationList(
                [
                    generator.createVariableDeclaration(generator.createIdentifier("a"), undefined, generator.createStringLiteral("str"))
                ],
                generator.NodeFlags.Const
            ),
            generator.createBreak()
        ]);
        const clause2 = generator.createDefaultClause([
            generator.createVariableDeclarationList(
                [
                    generator.createVariableDeclaration(generator.createIdentifier("a"), undefined, generator.createStringLiteral("str"))
                ],
                generator.NodeFlags.Const
            ),
            generator.createBreak()
        ]);

        const block = generator.createCaseBlock([clause1, clause2]);

        const expression = generator.createSwitch(generator.createIdentifier("expr"), block);
        const actualString = expression.toString();
        assert.equal(getResult(actualString), getResult(`
        switch(expr){
            case 1:
                const a = "str";
                break;
            default:
                const a = "str";
                break;
        }
        `));
    });

    mocha.it("createDebuggerStatement", function () { 
        assert.equal(generator.createDebuggerStatement().toString(), "debugger");
    });

    mocha.it("createComputedPropertyName", function () { 
        assert.equal(generator.createComputedPropertyName(
            generator.createIdentifier("name")
        ).toString(), "[name]");
    });

    mocha.it("createDelete", function () { 
        assert.equal(generator.createDelete(
                generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("field"))).toString(), "delete this.field");
    });

    mocha.it("createHeritageClause", function () {
        assert.equal(generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base")
            )]
        ).toString(), "extends Base");
    });

    mocha.it("createPropertyAccessChain", function () { 
        const expression = generator.createPropertyAccessChain(
            generator.createIdentifier("a"),
            generator.createToken(generator.SyntaxKind.QuestionDotToken),
            generator.createIdentifier("b")
        );

        assert.equal(expression.toString(), "a?.b");
    });

    mocha.it("createPropertyAccessChain without QuestionDotToken should use DotToken", function () { 
        const expression = generator.createPropertyAccessChain(
            generator.createThis(),
            undefined,
            generator.createIdentifier("click")
        );

        assert.strictEqual(expression.toString(), "this.click");
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
          )

        assert.deepEqual(expression.toString(), "model?.onClick(e)");
        assert.deepEqual(expression.getDependency(), []);
    });

    mocha.it("createTypeOf", function () { 
        const expression = generator.createTypeOf(generator.createIdentifier("b"));

        assert.strictEqual(expression.toString(), "typeof b");
    });

    mocha.it("createVoid", function () { 
        const expression = generator.createVoid(generator.createNumericLiteral("0"));

        assert.strictEqual(expression.toString(), "void 0");
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
                generator.createArrayTypeNode("string"),
                generator.createArrayTypeNode("number")
            ]
        );

        assert.equal(expression.toString(), "Node<string[],number[]>");
    });

    mocha.it("ExpressionWithTypeArguments", function () {
        const expresion = generator.createExpressionWithTypeArguments(
            [generator.createTypeReferenceNode(
                generator.createIdentifier("WidgetProps"),
                undefined
            )],
            generator.createIdentifier("JSXComponent")
        );

        assert.strictEqual(expresion.toString(), "JSXComponent<WidgetProps>");
        assert.strictEqual(expresion.type, "WidgetProps");
    });

    mocha.it("ExpressionWithTypeArguments", function () {
        const expresion = generator.createExpressionWithTypeArguments(
            [],
            generator.createIdentifier("Component")
        );

        assert.strictEqual(expresion.toString(), "Component");
        assert.strictEqual(expresion.type, "Component");
    });

    mocha.it("createAsExpression", function () {
        const expression = generator.createAsExpression(
            generator.createThis(),
            generator.createKeywordTypeNode(generator.SyntaxKind.AnyKeyword)
        );

        assert.strictEqual(expression.toString(), "this as any");
    });

    mocha.it("createRegularExpressionLiteral", function () {
        const expression = generator.createRegularExpressionLiteral('/d+/');

        assert.strictEqual(expression.toString(), '/d+/');
    });

    mocha.describe("Methods", function () {
        mocha.describe("GetAccessor", function () {
            mocha.it("type declaration with defined type", function () {
                const expression = generator.createGetAccessor([], [], generator.createIdentifier("name"), [], "string", undefined);
        
                assert.strictEqual(expression.typeDeclaration(), "name:string");
            });
    
            mocha.it("type declaration with undefined type", function () {
                const expression = generator.createGetAccessor(
                    [],
                    [],
                    generator.createIdentifier("name"),
                    [],
                    undefined,
                    undefined
                );
        
                assert.strictEqual(expression.typeDeclaration(), "name:any");
            });

            mocha.it("getter is call", function () {
                const expression = generator.createGetAccessor([], [], generator.createIdentifier("name"), [], "string", undefined);
        
                assert.strictEqual(expression.getter(), "name()");
            });
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

        mocha.it("property name and name are set (decomposite object and rename)", function () {
            const expression = generator.createBindingElement(
                undefined,
                generator.createIdentifier("a"),
                generator.createIdentifier("v")
            );
            assert.strictEqual(expression.toString(), "a:v");
            assert.deepEqual(expression.getDependency(), ["a"]);
        });

        mocha.it("rest properties", function () {
            assert.strictEqual(generator.createBindingElement(
                generator.SyntaxKind.DotDotDotToken,
                undefined,
                generator.createIdentifier("v")
            ).toString(), "...v");
        });

        mocha.it("decomposite object with BindingPattern", function () {
            assert.strictEqual(generator.createBindingElement(
                undefined,
                generator.createIdentifier("v"),
                generator.createObjectBindingPattern(
                    [generator.createBindingElement(
                        undefined,
                        undefined,
                        generator.createIdentifier("a")
                    )]
                )
            ).toString(), "v:{a}");
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
                    generator.createObjectBindingPattern([generator.createBindingElement(
                        undefined,
                        undefined,
                        generator.createIdentifier("c"),
                        undefined
                    )]),
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
                )
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
                )
            ]);

            assert.strictEqual(expression.toString(), "[d,c]");
        });

        mocha.it("createClassDeclaration", function () {
            const expression = generator.createClassDeclaration(
                [],
                [],
                generator.createIdentifier("name"),
                [],
                [],
                []
            );

            assert.ok(expression instanceof Class);
            assert.ok(!(expression instanceof ComponentInput));
            assert.ok(!(expression instanceof ReactComponent));

            // TODO implement class generation
            assert.strictEqual(expression.toString(), "");
        });
    });
    
    mocha.it("JsxElement. Fragment -> React.Fragment", function () {
        const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(generator.createIdentifier("Fragment"), [], []),
            [],
            generator.createJsxClosingElement(generator.createIdentifier("Fragment"))
        );

        assert.strictEqual(expression.toString(), "<React.Fragment ></React.Fragment>");
    });
});

mocha.describe("common", function () {
    mocha.it.skip("SyntaxKind", function () {
        const expected = Object.keys(ts.SyntaxKind)
            .map((key) => ts.SyntaxKind[Number(key)])
            .filter(value => typeof value === 'string') as string[]

        const actual = Object.keys(generator.SyntaxKind);
        
        assert.equal(actual.length, expected.length);
        assert.deepEqual(actual, expected);
    });

    mocha.it("SyntaxKind Keywords", function () {
        const expected = Object.keys(ts.SyntaxKind)
            .map((key) => ts.SyntaxKind[Number(key)])
            .filter(value => typeof value === 'string' && value.endsWith("Keyword")) as string[];

        expected.forEach(k => { 
            assert.equal((generator.SyntaxKind as any)[k], k.replace(/Keyword$/, "").toLowerCase(), `${k} is missed`);
        });
    });

    mocha.it("SyntaxKind Tokens", function () {
        const expected = Object.keys(ts.SyntaxKind)
            .map((key) => ts.SyntaxKind[Number(key)])
            .filter(value => typeof value === 'string' && value.endsWith("Token")) as string[];

        expected.forEach(k => { 
            const token = (generator.SyntaxKind as any)[k];
            assert.ok(token!==undefined, `${k} is missed`);
        });
    });

    mocha.it.skip("NodeFlags", function () {
        const expected = Object.keys(ts.NodeFlags)
            .map((key) => ts.SyntaxKind[Number(key)])
            .filter(value => typeof value === 'string') as string[];
        
        const actual = Object.keys(generator.NodeFlags);
        assert.equal(actual.length, expected.length);
        assert.deepEqual(Object.keys(generator.NodeFlags), expected);
    });

    mocha.it("processSourceFileName", function () {
        assert.strictEqual(generator.processSourceFileName("someName"), "someName");
    })
});

function createComponent(inputMembers: Array<Property | Method>, componentMembers: Array<Property | Method> = [], paramenters: { [name: string]: any } = {}):ReactComponent { 
    generator.createClassDeclaration(
        [generator.createDecorator(
            generator.createCall(generator.createIdentifier("ComponentBindings"), [], [])
        )],
        [],
        generator.createIdentifier("Input"),
        [],
        [],
        inputMembers
    );

    const heritageClause = generator.createHeritageClause(
        generator.SyntaxKind.ExtendsKeyword,
        [generator.createExpressionWithTypeArguments(
            [generator.createTypeReferenceNode(
                generator.createIdentifier("Input"),
                undefined
            )],
            generator.createIdentifier("JSXComponent")
        )]
    );

    const component = generator.createClassDeclaration(
        [createComponentDecorator(paramenters)],
        [],
        generator.createIdentifier("Widget"),
        [],
        [heritageClause],
        componentMembers
    );

    return component as ReactComponent;
}

mocha.describe("React Component", function () {
    this.beforeEach(() => {
        generator.setContext({});
    });
    this.afterEach(() => {
        generator.setContext(null);
    });

    mocha.it("class with Component decorator is ReactComponent", function () {
        const expression = generator.createClassDeclaration(
            [createComponentDecorator({})],
            [],
            generator.createIdentifier("Widget"),
            [],
            [],
            []
        );

        assert.ok(expression instanceof ReactComponent);
        const componentFromContext = generator.getContext().components?.["Widget"];
        assert.strictEqual(componentFromContext, expression);
    });

    mocha.describe("View", function () {
        mocha.it("Rename template to render in view function", function () {
            const component = createComponent(
                [
                    generator.createProperty(
                        [createDecorator("Template")],
                        [],
                        generator.createIdentifier("template")
                    )
                ]
            );

            const view = generator.createFunctionDeclaration(
                [],
                [],
                "",
                generator.createIdentifier("view"),
                [],
                [
                    generator.createParameter(
                        [],
                        [],
                        undefined,
                        generator.createIdentifier("viewModel"),
                        undefined,
                        component.name,
                        undefined
                    )
                ],
                "",
                generator.createBlock([
                    generator.createPropertyAccess(
                        generator.createPropertyAccess(
                            generator.createIdentifier("viewModel"),
                            generator.createIdentifier("props")
                        ),
                        generator.createIdentifier("template")
                    )
                ], false)
            );

            assert.strictEqual(getResult(view.toString()), getResult(`function view(viewModel:Widget){
                viewModel.props.render
            }`));
        });

        mocha.it("Rename template to render in view function when view function is arrow function", function () {
            const component = createComponent(
                [
                    generator.createProperty(
                        [createDecorator("Template")],
                        [],
                        generator.createIdentifier("template")
                    )
                ]
            );

            const view = generator.createArrowFunction(
                [],
                [],
                [
                    generator.createParameter(
                        [],
                        [],
                        undefined,
                        generator.createIdentifier("viewModel"),
                        undefined,
                        component.name,
                        undefined
                    )
                ],
                "",
                generator.SyntaxKind.EqualsGreaterThanToken,
                generator.createBlock([
                    generator.createPropertyAccess(
                        generator.createPropertyAccess(
                            generator.createIdentifier("viewModel"),
                            generator.createIdentifier("props")
                        ),
                        generator.createIdentifier("template")
                    )
                ], false)
            );

            assert.strictEqual(getResult(view.toString()), getResult(`(viewModel:Widget)=>{
                viewModel.props.render
            }`));
        });

        mocha.it("Rename template to render in binding pattern", function () {
            const component = createComponent(
                [
                    generator.createProperty(
                        [createDecorator("Template")],
                        [],
                        generator.createIdentifier("template")
                    )
                ]
            );

            const bindingPattern = generator.createVariableDeclarationList(
                [
                    generator.createVariableDeclaration(
                        generator.createObjectBindingPattern([generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("template"),
                            undefined
                        )]),
                        undefined,
                        generator.createPropertyAccess(
                            generator.createIdentifier("viewModel"),
                            generator.createIdentifier("props")
                        ),
                    )
                ], generator.SyntaxKind.ConstKeyword);

            const view = generator.createArrowFunction(
                [],
                [],
                [
                    generator.createParameter(
                        [],
                        [],
                        undefined,
                        generator.createIdentifier("viewModel"),
                        undefined,
                        component.name,
                        undefined
                    )
                ],
                "",
                generator.SyntaxKind.EqualsGreaterThanToken,
                generator.createBlock([
                    bindingPattern,
                    generator.createIdentifier("template")
                ],
                    false
                ),
            );

            assert.strictEqual(getResult(view.toString()), getResult(`(viewModel:Widget)=>{
                viewModel.props.render
            }`));
        });

        mocha.it("Do not modify state", function () {
            const component = createComponent(
                [
                    generator.createProperty(
                        [createDecorator("TwoWay")],
                        [],
                        generator.createIdentifier("p")
                    )
                ]
            );

            const view = generator.createFunctionDeclaration(
                [],
                [],
                "",
                generator.createIdentifier("view"),
                [],
                [
                    generator.createParameter(
                        [],
                        [],
                        undefined,
                        generator.createIdentifier("viewModel"),
                        undefined,
                        component.name,
                        undefined
                    )
                ],
                "",
                generator.createBlock([
                    generator.createPropertyAccess(
                        generator.createPropertyAccess(
                            generator.createIdentifier("viewModel"),
                            generator.createIdentifier("props")
                        ),
                        generator.createIdentifier("p")
                    )
                ], false)
            );

            assert.strictEqual(getResult(view.toString()), getResult(`function view(viewModel:Widget){
                viewModel.props.p
            }`));
        });

        mocha.it("Do not modify internal state", function () {
            const component = createComponent(
                [],
                [
                    generator.createProperty(
                        [createDecorator("InternalState")],
                        [],
                        generator.createIdentifier("p")
                    )
                ]
            );

            const view = generator.createFunctionDeclaration(
                [],
                [],
                "",
                generator.createIdentifier("view"),
                [],
                [
                    generator.createParameter(
                        [],
                        [],
                        undefined,
                        generator.createIdentifier("viewModel"),
                        undefined,
                        component.name,
                        undefined
                    )
                ],
                "",
                generator.createBlock([
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("p")
                    )
                ], false)
            );

            assert.strictEqual(getResult(view.toString()), getResult(`function view(viewModel:Widget){
                viewModel.p
            }`));
        });

        mocha.it("Rename default slot", function () {
            const component = createComponent(
                [
                    generator.createProperty(
                        [createDecorator("Slot")],
                        [],
                        generator.createIdentifier("default")
                    )
                ]
            );

            const view = generator.createFunctionDeclaration(
                [],
                [],
                "",
                generator.createIdentifier("view"),
                [],
                [
                    generator.createParameter(
                        [],
                        [],
                        undefined,
                        generator.createIdentifier("viewModel"),
                        undefined,
                        component.name,
                        undefined
                    )
                ],
                "",
                generator.createBlock([
                    generator.createPropertyAccess(
                        generator.createPropertyAccess(
                            generator.createIdentifier("viewModel"),
                            generator.createIdentifier("props")
                        ),
                        generator.createIdentifier("default")
                    )
                ], false)
            );

            assert.strictEqual(getResult(view.toString()), getResult(`function view(viewModel:Widget){
                viewModel.props.children
            }`));
        });

        mocha.it("Access to GetAccessor as usual property", function () {
            const component = createComponent(
                [],
                [
                    generator.createGetAccessor(
                        [],
                        [],
                        generator.createIdentifier("p"),
                        [],
                        undefined,
                        undefined
                    )
                ]
            );

            const view = generator.createFunctionDeclaration(
                [],
                [],
                "",
                generator.createIdentifier("view"),
                [],
                [
                    generator.createParameter(
                        [],
                        [],
                        undefined,
                        generator.createIdentifier("viewModel"),
                        undefined,
                        component.name,
                        undefined
                    )
                ],
                "",
                generator.createBlock([
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("p")
                    )
                ], false)
            );

            assert.strictEqual(getResult(view.toString()), getResult(`function view(viewModel:Widget){
                viewModel.p
            }`));

        });

        mocha.describe("Exclude template in binding pattern", function () { 
            const templateProperty = generator.createProperty(
                [createDecorator("Template")],
                [],
                generator.createIdentifier("template")
            );

            mocha.it("variable expression should generate empty string if only template in binding pattern", function () {
                const expression = generator.createVariableDeclaration(
                    generator.createObjectBindingPattern([generator.createBindingElement(
                        undefined,
                        undefined,
                        generator.createIdentifier("template"),
                        undefined
                    )]),
                    undefined,
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("props")
                    ),
                );

                const toStringOptions: toStringOptions = {
                    componentContext: "viewModel",
                    newComponentContext: "viewModel",
                    internalState: [],
                    state: [],
                    props: [],
                    members: [
                        templateProperty
                    ]
                };

                const expressionString = expression.toString(toStringOptions);

                assert.strictEqual(Object.keys(toStringOptions.variables!).length, 1);
                assert.strictEqual(toStringOptions.variables?.["template"].toString(), "viewModel.props.render");
                assert.strictEqual(expressionString, "");
            });

            mocha.it("variable expression should generate variable declaration for other properties", function () {
                const expression = generator.createVariableDeclaration(
                    generator.createObjectBindingPattern([
                        generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("template"),
                            undefined
                        ),
                        generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("p"),
                            undefined
                        )
                    ]),
                    undefined,
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("props")
                    ),
                );

                const toStringOptions: toStringOptions = {
                    componentContext: "viewModel",
                    newComponentContext: "viewModel",
                    internalState: [],
                    state: [],
                    props: [],
                    members: [
                        templateProperty,
                        generator.createProperty(
                            [createDecorator("OneWay")],
                            [],
                            generator.createIdentifier("p"),
                            undefined,
                            "",
                            undefined
                        )
                    ]
                };

                const expressionString = expression.toString(toStringOptions);

                assert.strictEqual(Object.keys(toStringOptions.variables!).length, 1);
                assert.strictEqual(toStringOptions.variables?.["template"].toString(), "viewModel.props.render");
                assert.strictEqual(expressionString, "{p}=viewModel.props");
            });

            mocha.it("template property should be removed from binding pattern if it has rest operator", function () {
                const expression = generator.createVariableDeclaration(
                    generator.createObjectBindingPattern([
                        generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("template"),
                            undefined
                        ),
                        generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("p"),
                            undefined
                        ),
                        generator.createBindingElement(
                            generator.SyntaxKind.DotDotDotToken,
                            undefined,
                            generator.createIdentifier("rest"),
                            undefined
                        )
                    ]),
                    undefined,
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("props")
                    ),
                );

                const toStringOptions: toStringOptions = {
                    componentContext: "viewModel",
                    newComponentContext: "viewModel",
                    internalState: [],
                    state: [],
                    props: [],
                    members: [
                        templateProperty,
                        generator.createProperty(
                            [createDecorator("OneWay")],
                            [],
                            generator.createIdentifier("p"),
                            undefined,
                            "",
                            undefined
                        )
                    ]
                };

                const expressionString = expression.toString(toStringOptions);

                assert.strictEqual(Object.keys(toStringOptions.variables!).length, 1);
                assert.strictEqual(toStringOptions.variables?.["template"].toString(), "viewModel.props.render");
                assert.strictEqual(expressionString, "{p,render,...rest}=viewModel.props");
            });

            mocha.it("non-prop property should not be excluded from binding pattern", function () {
                const property = generator.createGetAccessor(
                    [],
                    [],
                    generator.createIdentifier("p"),
                    [],
                );
                property.prefix = "__";

                const prop = generator.createProperty(
                    [createDecorator("OneWay")],
                    [],
                    generator.createIdentifier("p")
                )

                const expression = generator.createVariableDeclaration(
                    generator.createObjectBindingPattern([
                        generator.createBindingElement(
                            undefined,
                            undefined,
                            generator.createIdentifier("p"),
                            undefined
                        )
                    ]),
                    undefined,
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("props")
                    ),
                );

                const toStringOptions: toStringOptions = {
                    componentContext: "viewModel",
                    newComponentContext: "viewModel",
                    internalState: [],
                    state: [],
                    props: [],
                    members: [
                        property,
                        prop
                    ]
                };

                const expressionString = expression.toString(toStringOptions);

                assert.strictEqual(Object.keys(toStringOptions.variables!).length, 0);
                assert.strictEqual(expressionString, "{p}=viewModel.props");
            });

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
            generator.createImportClause(
                identifier,
                undefined
            ),
            generator.createStringLiteral("./test-cases/declarations/empty-component")
        );   
        
        const baseModulePath = path.resolve(`${__dirname}/test-cases/declarations/empty-component.tsx`);
        assert.ok(generator.cache[baseModulePath]);
        assert.deepEqual(generator.getContext().components!["Base"].heritageProperies.map(p => p.name.toString()), ["height", "width"]);
    });

    mocha.it("Get properties from heritageClause", function () {
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Base"),
                undefined
            ),
            generator.createStringLiteral("./test-cases/declarations/empty-component")
        ); 
        
        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base")
            )]);
        
        assert.deepEqual(heritageClause.members.map(m => m.toString()), ["height", "width"]);
        assert.deepEqual(heritageClause.defaultProps, [], "defualtProps");
    });

    mocha.it("Get properties from heritageClause without import", function () {
        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base")
            )]);
        
        assert.deepEqual(heritageClause.members.map(m => m.toString()), []);
    });

    mocha.it("Get properties from heritageClause", function () {
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Base"),
                undefined
            ),
            generator.createStringLiteral("./test-cases/declarations/props")
        ); 
        
        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base")
            )]);
        
        assert.deepEqual(heritageClause.defaultProps, ["Base.defaultProps"], "defualtProps");
    });

    mocha.it("Heritage defaultProps. Base component has defaultProps, component has not", function () {
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Base"),
                undefined
            ),
            generator.createStringLiteral("./test-cases/declarations/props")
        );
        
        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base")
            )]);
        
        const decorator = generator.createDecorator(generator.createCall(generator.createIdentifier("Component"), [], [generator.createObjectLiteral([], false)]));
        
        const component = new ReactComponent(decorator, [], generator.createIdentifier("Component"), [], [heritageClause], [], {});

        assert.equal(getResult(component.compileDefaultProps()), getResult("Component.defaultProps = {...Base.defaultProps}"));
    });

    mocha.it("Heritage defaultProps. Base component has not defaultProps, component has not", function () {
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Base"),
                undefined
            ),
            generator.createStringLiteral("./test-cases/declarations/empty-component")
        );
        
        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base")
            )]);
        
        const decorator = generator.createDecorator(generator.createCall(generator.createIdentifier("Component"), [], [generator.createObjectLiteral([], false)]));
        
        const component = new ReactComponent(decorator, [], generator.createIdentifier("Component"), [], [heritageClause], [], {});

        assert.equal(component.compileDefaultProps(), "");
    });

    mocha.it("Heritage defaultProps. Base component and child component have defaultProps", function () {
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Base"),
                undefined
            ),
            generator.createStringLiteral("./test-cases/declarations/props")
        );
        
        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base")
            )]);
        
        const decorator = generator.createDecorator(generator.createCall(generator.createIdentifier("Component"), [], [generator.createObjectLiteral([], false)]));
        const childProperty = generator.createProperty(
            [generator.createDecorator(generator.createCall(
                generator.createIdentifier("OneWay"),
                undefined,
                []
            ))],
            undefined,
            generator.createIdentifier("childProp"),
            undefined,
            generator.createKeywordTypeNode(generator.SyntaxKind.NumberKeyword),
            generator.createNumericLiteral("10")
        );
        
        const component = new ReactComponent(decorator, [], generator.createIdentifier("Component"), [], [heritageClause], [childProperty], {});

        assert.equal(getResult(component.compileDefaultProps()), getResult("Component.defaultProps = {...Base.defaultProps, childProp:10}"));
    });

    mocha.it("Heritage defaultProps. Base component has not default props, child component has defaultProps", function () {
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Base"),
                undefined
            ),
            generator.createStringLiteral("./test-cases/declarations/empty-component")
        );
        
        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("Base")
            )]);
        
        const decorator = generator.createDecorator(generator.createCall(generator.createIdentifier("Component"), [], [generator.createObjectLiteral([], false)]));
        const childProperty = generator.createProperty(
            [generator.createDecorator(generator.createCall(
                generator.createIdentifier("OneWay"),
                undefined,
                []
            ))],
            undefined,
            generator.createIdentifier("childProp"),
            undefined,
            generator.createKeywordTypeNode(generator.SyntaxKind.NumberKeyword),
            generator.createNumericLiteral("10")
        );
        
        const component = new ReactComponent(decorator, [], generator.createIdentifier("Component"), [], [heritageClause], [childProperty], {});

        assert.equal(getResult(component.compileDefaultProps()), getResult("Component.defaultProps = {childProp:10}"));
        assert.equal(component.compileDefaultProps().indexOf(","), -1);
    });

    mocha.it("Parse imported component input", function () {
        const expresstion = generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Widget"),
                generator.createNamedImports([generator.createImportSpecifier(
                    undefined,
                    generator.createIdentifier("WidgetProps")
                )])
            ),
            generator.createStringLiteral("./test-cases/declarations/component-input")
        );
        
        const baseModulePath = path.resolve(`${__dirname}/test-cases/declarations/component-input.tsx`);
        assert.strictEqual(expresstion.toString(), `import Widget,{WidgetProps} from "./test-cases/declarations/component-input"`);
        assert.ok(generator.cache[baseModulePath]);
        assert.ok(generator.getContext().components!["Widget"] instanceof ReactComponent);
        assert.ok(generator.getContext().components!["WidgetProps"] instanceof ComponentInput);
    });

    mocha.it("ComponentInput gets all members from heritage clause", function () { 
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Widget"),
                generator.createNamedImports([generator.createImportSpecifier(
                    undefined,
                    generator.createIdentifier("WidgetProps")
                )])
            ),
            generator.createStringLiteral("./test-cases/declarations/component-input")
        );

        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("WidgetProps")
            )]);
        
        const model = new ComponentInput(
            [],
            [],
            generator.createIdentifier("Model"),
            [],
            [heritageClause],
            []
        );

        assert.deepEqual(model.members.map(m => m.name.toString()), ["height", "children"]);
        assert.strictEqual(getResult(model.toString()), getResult("declare type Model= typeof WidgetProps & {} const Model:Model={...WidgetProps}"));
    });

    mocha.it("ComponentInput inherit members - can redefine member", function () { 
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("Widget"),
                generator.createNamedImports([generator.createImportSpecifier(
                    undefined,
                    generator.createIdentifier("WidgetProps")
                )])
            ),
            generator.createStringLiteral("./test-cases/declarations/component-input")
        );

        const heritageClause = generator.createHeritageClause(
            generator.SyntaxKind.ExtendsKeyword,
            [generator.createExpressionWithTypeArguments(
                undefined,
                generator.createIdentifier("WidgetProps")
            )]);
        
        const model = new ComponentInput(
            [],
            [],
            generator.createIdentifier("Model"),
            [],
            [heritageClause],
            [generator.createProperty(
                [],
                [],
                generator.createIdentifier("height"),
                generator.SyntaxKind.ExclamationToken,
                "string",
                generator.createStringLiteral("10px")
            )]
        );

        assert.deepEqual(model.members.map(m => {
            const prop = new Prop(m as Property);
            return prop.typeDeclaration();
        }), ["height!:string", "children?:React.ReactNode"]);

        assert.strictEqual(model.defaultPropsDest(), "Model");
        assert.strictEqual(getResult(model.toString()), getResult("declare type Model=typeof WidgetProps&{height!:string;} const Model:Model={...WidgetProps, height: '10px'}"));
    });

    mocha.it("ComponentInput - doesn't have properties without initializer", function () { 
        const model = new ComponentInput(
            [],
            [],
            generator.createIdentifier("Model"),
            [],
            [],
            [generator.createProperty(
                [],
                [],
                generator.createIdentifier("height"),
                generator.SyntaxKind.ExclamationToken,
                "string",
                undefined
            )]
        );
        assert.strictEqual(getResult(model.toString()), getResult("declare type Model={height!:string} const Model:Model={}"));
    });
});

mocha.describe("Expressions with props/state/internal state", function () { 
    this.beforeEach(function () {
        this.prop = generator.createProperty(
            [createDecorator("OneWay")],
            [],
            generator.createIdentifier("p1"),
            generator.SyntaxKind.QuestionToken,
            "string",
            undefined);
        
        this.state = generator.createProperty(
            [createDecorator("TwoWay")],
            [],
            generator.createIdentifier("s1"),
            generator.SyntaxKind.QuestionToken,
            "string",
            undefined);
        
        this.internalState = generator.createProperty(
            [createDecorator("InternalState")],
            [],
            generator.createIdentifier("i1"),
            generator.SyntaxKind.QuestionToken,
            "string",
            undefined);
        
        this.propAccess = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("p1")
        );

        this.stateAccess = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("s1")
        );

        this.internalStateAccess = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("i1")
        );
    });

    mocha.it("PropertyAccess. Prop", function () {
        assert.equal(this.propAccess.toString({ internalState: [this.state, this.prop, this.internalState], state: [], props: [new Prop(this.prop)] }), "props.p1");
        assert.deepEqual(this.propAccess.getDependency(), ["p1"]);
    });

    mocha.it("Property accees. this.props.p1", function () {
        const expression = generator.createPropertyAccess(
            generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("props")
            ), generator.createIdentifier("p1"));
       
        assert.equal(expression.toString({ members: [this.state, this.prop, this.internalState], internalState: [], state: [], props: [new Prop(this.prop)]}), "props.p1");
        assert.deepEqual(expression.getDependency(), ["p1"]);
    });

    mocha.it("Property accees. this.props", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("props")
        );
       
        assert.equal(expression.toString({ members: [this.state, this.prop, this.internalState], internalState: [], state: [], props: [new Prop(this.prop)]}), "props");
        assert.deepEqual(expression.getDependency(), ["props"]);
    });

    mocha.it("PropertyAccess. State", function () {
        assert.equal(this.stateAccess.toString({members: [this.state, this.prop, this.internalState], internalState: [], state: [new State(this.state)], props: [] }), "(props.s1!==undefined?props.s1:__state_s1)");
        assert.deepEqual(this.stateAccess.getDependency(), ["s1"]);
    });

    mocha.it("PropertyAccess. State in props", function () {
        const expression = generator.createPropertyAccess(
            generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("props")
            ), generator.createIdentifier("s1"));
        
        assert.equal(expression.toString({members: [], internalState: [this.state, this.prop, this.internalState], state: [new State(this.state)], props: [] }), "(props.s1!==undefined?props.s1:__state_s1)");
        assert.deepEqual(expression.getDependency(), ["s1"]);
    });

    mocha.it("PropertyAccess. Internal State", function () {
        assert.equal(this.internalStateAccess.toString({ members: [this.state, this.prop, this.internalState],internalState: [new InternalState(this.internalState)], state: [new State(this.state)] }), ["__state_i1"]);
        assert.deepEqual(this.internalStateAccess.getDependency(), ["i1"]);
    });

    mocha.it("= operator for state - set state and rise change state", function () { 
        const expression = generator.createBinary(
            this.stateAccess,
            generator.SyntaxKind.EqualsToken,
            generator.createIdentifier("a")
        );

        assert.equal(getResult(expression.toString({members: [this.state, this.prop, this.internalState], internalState: [], state: [new State(this.state)], props: [] })), getResult("(__state_setS1(a), props.s1Change!(a))"));
        assert.deepEqual(expression.getDependency(), []);
        assert.deepEqual(expression.getAllDependency(), ["s1"]);
    });

    mocha.it("= operator for internal state - call __state_set...", function () { 
        const expression = generator.createBinary(
            this.internalStateAccess,
            generator.SyntaxKind.EqualsToken,
            generator.createIdentifier("a")
        );

        assert.equal(getResult(expression.toString({members: [this.state, this.prop, this.internalState], internalState: [new InternalState(this.internalState)], state: [new State(this.state)], props: [] })), getResult("__state_setI1(a);"));
    });

    mocha.it("= operator for prop - throw error", function () { 
        const expression = generator.createBinary(
            this.propAccess,
            generator.SyntaxKind.EqualsToken,
            generator.createIdentifier("a")
        );

        let error = null;
        try {
            expression.toString({members: [this.state, this.prop, this.internalState], internalState: [new InternalState(this.internalState)], state: [new State(this.state)], props: [new Prop(this.prop)] });
        } catch (e) {
            error = e;
        }

        assert.strictEqual(error, "Error: Can't assign property use TwoWay() or Internal State - this.p1=a");
    });

    mocha.it("Binary operator returns dependency for both side", function () { 
        const expression = generator.createBinary(
            this.stateAccess,
            generator.SyntaxKind.EqualsEqualsEqualsToken,
            this.propAccess
        );

        assert.equal((expression.toString({ members: [],internalState: [], state: [new State(this.state)], props: [new Prop(this.prop)] })), ("(props.s1!==undefined?props.s1:__state_s1)===props.p1"));
        assert.deepEqual(expression.getDependency(), ["s1", "p1"]);
        assert.deepEqual(expression.getAllDependency(), ["s1", "p1"]);
    });

    mocha.it("VariableDeclarationList return dependecy for initializer", function () {
        const expresion = generator.createVariableStatement(
            undefined,
            generator.createVariableDeclarationList(
                [generator.createVariableDeclaration(
                    generator.createIdentifier("v"),
                    undefined,
                    generator.createBinary(
                        this.propAccess,
                        generator.createToken(generator.SyntaxKind.AmpersandAmpersandToken),
                        this.stateAccess
                    )
                )],
                generator.NodeFlags.Const
            )
        );

        assert.deepEqual(expresion.getDependency(), ["p1", "s1"]);
    });

    mocha.it("VariableDeclarationList return empty dependecy for string initializer", function () {
        const expresion = generator.createVariableStatement(
            undefined,
            generator.createVariableDeclarationList(
                [generator.createVariableDeclaration(
                    generator.createIdentifier("v"),
                    undefined,
                    "stringInitializer"
                )],
                generator.NodeFlags.Const
            )
        );

        assert.deepEqual(expresion.getDependency(), []);
    });

    mocha.it("VariableDeclaration returns dependency for Binding Pattern", function () {
        const expresion = generator.createVariableDeclaration(
            generator.createObjectBindingPattern([generator.createBindingElement(
                undefined,
                undefined,
                generator.createIdentifier("height"),
                undefined
            )]),
            undefined,
            generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("props")
            )
        );

        assert.deepEqual(expresion.getDependency(), ["height"]);
    });

    mocha.it("VariableDeclaration returns all props dependency if binding element have rest operator", function () {
        const expresion = generator.createVariableDeclaration(
            generator.createObjectBindingPattern([generator.createBindingElement(
                generator.SyntaxKind.DotDotDotToken,
                undefined,
                generator.createIdentifier("rest"),
                undefined
            )]),
            undefined,
            generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("props")
            )
        );

        assert.deepEqual(expresion.getDependency(), ["props"]);
    });

    mocha.it("Arrow Function. Can set state", function () {
        const arrowFunction = generator.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
            generator.createBinary(
                this.stateAccess,
                generator.createToken(generator.SyntaxKind.EqualsToken),
                generator.createNumericLiteral("10")
            )
        );
        
        assert.deepEqual(arrowFunction.getDependency(), []);
        assert.equal(getResult(arrowFunction.toString({ members: [this.state, this.prop, this.internalState],internalState: [], state: [new State(this.state)], props: [] })), getResult("()=>(__state_setS1(10), props.s1Change!(10))"));
        assert.equal(getResult(arrowFunction.toString({ members: [this.state, this.prop, this.internalState],internalState: [new InternalState(this.state)], state: [], props: [] })), getResult("()=>__state_setS1(10)"));
    });

    mocha.it("Arrow Function. Can set prop in state", function () {
        const arrowFunction = generator.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
            generator.createBinary(
                this.stateAccess,
                generator.createToken(generator.SyntaxKind.EqualsToken),
                this.propAccess
            )
        );
        
        assert.deepEqual(arrowFunction.getDependency(), ["p1"]);
        assert.equal(getResult(arrowFunction.toString({members: [this.state, this.prop, this.internalState], internalState: [], state: [new State(this.state)], props: [new Prop(this.prop)] })), getResult("()=>(__state_setS1(props.p1), props.s1Change!(props.p1))"));
        assert.equal(getResult(arrowFunction.toString({ members: [this.state, this.prop, this.internalState], internalState: [new InternalState(this.state)], state: [], props: [new Prop(this.prop)] })), getResult("()=>__state_setS1(props.p1)"), "do not change for internal state");
    });

    mocha.it("PropertyAccess should remove this if there is props, state or internal state", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("name")
        );
        
        assert.equal(expression.toString({members: [this.state, this.prop, this.internalState], internalState: [], state: [], props: [new Prop(this.prop)] }), "name");
        assert.equal(expression.toString({members: [this.state, this.prop, this.internalState], internalState: [], state: [new State(this.state)], props: [] }), "name");
        assert.equal(expression.toString({members: [this.state, this.prop, this.internalState], internalState: [new InternalState(this.internalState)], state: [new State(this.state)], props: [] }), "name");
        assert.equal(expression.toString(), "this.name");
    });

    mocha.it("createPropertyAccessChain", function () { 
        const expression = generator.createPropertyAccessChain(
            this.propAccess,
            generator.createToken(generator.SyntaxKind.QuestionDotToken),
            generator.createCall(
                generator.createIdentifier("call"),
                [],
                [this.stateAccess]
            )
        );

        assert.equal(expression.toString({members: [this.state, this.prop, this.internalState], internalState: [new InternalState(this.internalState)], state: [new State(this.state)], props: [new Prop(this.prop)] }), "props.p1?.call((props.s1!==undefined?props.s1:__state_s1))");
        assert.deepEqual(expression.getDependency(), ["p1", "s1"]);
    });

    mocha.it("createCallChain with props, state internal state in args", function () { 
        const expression = generator.createCallChain(
            generator.createPropertyAccessChain(
                generator.createIdentifier("model"),
                generator.createToken(generator.SyntaxKind.QuestionDotToken),
                generator.createIdentifier("onClick")
            ),
            undefined,
            undefined,
            [this.propAccess, this.stateAccess, this.internalStateAccess]
          )

        assert.deepEqual(expression.toString({members: [this.state, this.prop, this.internalState], internalState: [new InternalState(this.internalState)], state: [new State(this.state)], props: [new Prop(this.prop)] }), "model?.onClick(props.p1,(props.s1!==undefined?props.s1:__state_s1),__state_i1)");
        assert.deepEqual(expression.getDependency(), ["p1", "s1", "i1"]);
    });

    mocha.it("createCallChain with props, in expression", function () { 
        const expression = generator.createCallChain(
            generator.createPropertyAccessChain(
                this.propAccess,
                generator.createToken(generator.SyntaxKind.QuestionDotToken),
                generator.createIdentifier("onClick")
            ),
            undefined,
            undefined,
            []
          )

        assert.deepEqual(expression.toString({members: [this.state, this.prop, this.internalState], internalState: [new InternalState(this.internalState)], state: [new State(this.state)], props: [new Prop(this.prop)] }), "props.p1?.onClick()");
        assert.deepEqual(expression.getDependency(), ["p1"]);
    });

    mocha.it("Method should return dependency for all properties", function () {
        const method = generator.createMethod(
            [],
            [],
            "",
            generator.createIdentifier("p"),
            "",
            undefined,
            [],
            undefined,
            generator.createBlock([
                this.propAccess,
                this.internalStateAccess,
                this.stateAccess
            ], false)
        );

        assert.deepEqual(method.getDependency(
            [new InternalState(this.internalState), new State(this.state), new Prop(this.prop)]
        ), ["props.p1", "__state_i1", "props.s1", "__state_s1", "props.s1Change"]);
    });

    mocha.it("Method should not return dependency for unknown property", function () {
        const method = generator.createMethod(
            [],
            [],
            "",
            generator.createIdentifier("p"),
            "",
            undefined,
            [],
            undefined,
            generator.createBlock([
                this.propAccess,
                this.internalStateAccess
            ], false)
        );

        assert.deepEqual(method.getDependency(
            [new State(this.state), new Prop(this.prop)]
        ), ["props.p1"]);
    });

    mocha.it("Method should not include single props if there is props in dependency", function () {
        const method = generator.createMethod(
            [],
            [],
            "",
            generator.createIdentifier("p"),
            "",
            undefined,
            [],
            undefined,
            generator.createBlock([
                this.propAccess,
                this.stateAccess,
                generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("props")
                )
            ], false)
        );

        assert.deepEqual(method.getDependency(
            [new InternalState(this.internalState), new State(this.state), new Prop(this.prop)]
        ), ["__state_s1", "props"]);
    });
});

mocha.describe("ComponentInput", function () {
    this.beforeEach(function () { 
        generator.setContext({});
        this.decorators = [generator.createDecorator(generator.createCall(
            generator.createIdentifier("ComponentBindings"),
            [],
            []
        ))];
    });

    this.afterEach(function () { 
        generator.setContext(null);
    })

    mocha.it("Create Component Input", function () { 
        const expression = generator.createClassDeclaration(
            this.decorators,
            ["export"],
            generator.createIdentifier("BaseModel"),
            [],
            [],
            []
        );

        assert.strictEqual(getResult(expression.toString()), getResult("declare type BaseModel={}; export const BaseModel:BaseModel={};"));

        const cachedComponent = generator.getContext().components!["BaseModel"];
        assert.equal(cachedComponent, expression);
        assert.deepEqual(cachedComponent.heritageProperies.map(p => p.toString), []);
    });

    mocha.it("Component input has heritage properties", function () { 
        const expression = generator.createClassDeclaration(
            this.decorators,
            ["export"],
            generator.createIdentifier("BaseModel"),
            [],
            [],
            [
                new Property([], [], generator.createIdentifier("p"), undefined, "number", generator.createNumericLiteral("10")),
                new Property([], [], generator.createIdentifier("p1"), undefined, "number", generator.createNumericLiteral("15"))
            ]
        );

        assert.strictEqual(getResult(expression.toString()), getResult("declare type BaseModel={p:number; p1:number}; export const BaseModel:BaseModel={p:10, p1: 15};"));
        const cachedComponent = generator.getContext().components!["BaseModel"];
        assert.deepEqual(cachedComponent.heritageProperies.map(p => p.toString()), ["p", "p1"]);
    });

    mocha.it("Rename Template property: template->render", function () { 
        const expression = generator.createClassDeclaration(
            this.decorators,
            ["export"],
            generator.createIdentifier("BaseModel"),
            [],
            [],
            [
                generator.createProperty([
                    createDecorator("Template")
                ],
                    [],
                    generator.createIdentifier("template"),
                    undefined,
                    "any",
                    undefined
                ),
            ]
        );

        assert.strictEqual(getResult(expression.toString()), getResult(`declare type BaseModel={render: any}; export const BaseModel:BaseModel={};`));
    });

    mocha.it("Rename Template property: template->render", function () { 
        const expression = generator.createClassDeclaration(
            this.decorators,
            ["export"],
            generator.createIdentifier("BaseModel"),
            [],
            [],
            [
                generator.createProperty([
                    createDecorator("Template")
                ],
                    [],
                    generator.createIdentifier("template"),
                    undefined,
                    "any",
                    undefined
                ),
            ]
        );

        assert.strictEqual(getResult(expression.toString()), getResult(`declare type BaseModel={render: any}; export const BaseModel:BaseModel={};`));
    });

    mocha.it("Rename Template property: contentTemplate->contentRender", function () { 
        const expression = generator.createClassDeclaration(
            this.decorators,
            ["export"],
            generator.createIdentifier("BaseModel"),
            [],
            [],
            [
                generator.createProperty([
                    createDecorator("Template")
                ],
                    [],
                    generator.createIdentifier("contentTemplate"),
                    undefined,
                    "any",
                    undefined
                ),
            ]
        );

        assert.strictEqual(getResult(expression.toString()), getResult(`declare type BaseModel={contentRender: any}; export const BaseModel:BaseModel={};`));
    });

    mocha.describe("CompileViewModelArguments", function () {
        this.beforeEach(function () { 
            
        });

        mocha.it("Empty input with empty component", function () {
            const component = createComponent([]);
            assert.deepEqual(component.compileViewModelArguments(), ["props:{...props}"]);
        });
        
        mocha.it("Prop in input with empty component", function () {
            const component = createComponent([
                generator.createProperty(
                    [generator.createDecorator(generator.createCall(
                        generator.createIdentifier("OneWay"), [], []
                    ))],
                    [],
                    generator.createIdentifier("p"),
                    "",
                    generator.SyntaxKind.BooleanKeyword,
                    undefined
                )
            ]);
            assert.deepEqual(component.compileViewModelArguments(), ["props:{...props}"]);
        });

        mocha.it("State in input - extended props with state getter in viewModes args", function () {
            const component = createComponent([
                generator.createProperty(
                    [generator.createDecorator(generator.createCall(
                        generator.createIdentifier("TwoWay"), [], []
                    ))],
                    [],
                    generator.createIdentifier("p"),
                    "",
                    generator.SyntaxKind.BooleanKeyword,
                    undefined
                )
            ]);
            assert.deepEqual(getResult(
                `{${component.compileViewModelArguments().join(",")}}`
            ), getResult("{props:{...props, p:props.p!==undefined?props.p:__state_p}}"));
        });

        mocha.it("component with internal state - add internal state to viewModel args", function () {
            const component = createComponent([
                generator.createProperty(
                    [generator.createDecorator(generator.createCall(
                        generator.createIdentifier("OneWay"), [], []
                    ))],
                    [],
                    generator.createIdentifier("p"),
                    "",
                    generator.SyntaxKind.BooleanKeyword,
                    undefined
                )
            ], [
                generator.createProperty(
                    [generator.createDecorator(generator.createCall(
                        generator.createIdentifier("InternalState"), [], []
                    ))],
                    [],
                    generator.createIdentifier("s"),
                    "",
                    generator.SyntaxKind.BooleanKeyword,
                    undefined
                )
            ]);
            assert.deepEqual(getResult(
                `{${component.compileViewModelArguments().join(",")}}`
            ), getResult("{props:{...props},s:__state_s}"));
        });

        mocha.it("Pass getter result in viewModel arguments", function () {
            const component = createComponent([], [
                generator.createGetAccessor(
                    [],
                    [],
                    generator.createIdentifier("property"),
                    [],
                    undefined,
                    undefined
                )
            ]);

            assert.strictEqual(getResult(component.compileComponentInterface()), getResult("interface Widget{props: Input; property:any}"));

            assert.strictEqual(getResult(`{${component.compileViewModelArguments().join(",")}}`
            ), getResult("{props:{...props}, property: __property()}"));
        });

    });
});

mocha.describe("Default_options", function () {
    function setupGenerator(context: GeneratorContex) { 
        generator.setContext(context);
    }
    this.beforeEach(function () {
        setupGenerator({
            dirname: path.join(__dirname, "test-cases"),
            defaultOptionsModule: `${__dirname}/default_options`
        });
    });

    this.afterEach(function () {
        generator.defaultOptionsModule = "";
        generator.setContext(null);
    });

    mocha.describe("Store default_options import statement in context", function () {
        mocha.it("default_options in parent folder", function () {
            const expected = 'import defaultOptions from "../default_options"';
            assert.strictEqual(generator.createImportDeclaration(
                undefined,
                undefined,
                generator.createImportClause(
                    generator.createIdentifier("defaultOptions"),
                    undefined
                ),
                generator.createStringLiteral("../default_options")
            ).toString(), expected);
    
            assert.strictEqual(generator.getContext().defaultOptionsImport!.toString(), expected);
        });

        mocha.it("default_options in same folder", function () {
            setupGenerator({
                dirname: __dirname,
                defaultOptionsModule: `${__dirname}/default_options`
            });
    
            generator.createImportDeclaration(
                undefined,
                undefined,
                generator.createImportClause(
                    generator.createIdentifier("defaultOptions"),
                    undefined
                ),
                generator.createStringLiteral("./default_options")
            );

            assert.strictEqual(generator.getContext().defaultOptionsImport!.toString(), 'import defaultOptions from "./default_options"');
        });

        mocha.it("default_options in child folder", function () {
            setupGenerator({
                dirname: __dirname,
                defaultOptionsModule: `${__dirname}/child/default_options`
            })
    
            generator.createImportDeclaration(
                undefined,
                undefined,
                generator.createImportClause(
                    generator.createIdentifier("defaultOptions"),
                    undefined
                ),
                generator.createStringLiteral("./child/default_options")
            );

            assert.strictEqual(generator.getContext().defaultOptionsImport!.toString(), 'import defaultOptions from "./child/default_options"');
        });
    });

    mocha.it("Add import convertRulesToOptions, Rule", function () {
        const importClause = generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("defaultOptions"),
                undefined
            ),
            generator.createStringLiteral("../default_options")
        )
        
        const component = new ReactComponent(
            generator.createDecorator(generator.createCall(generator.createIdentifier("Component"), [], [generator.createObjectLiteral([], false)])),
            [],
            generator.createIdentifier("Component"),
            [],
            [],
            [],
            generator.getContext());

        assert.strictEqual(getResult(importClause.toString()), getResult(`import defaultOptions, {convertRulesToOptions, Rule} from "../default_options"`));
        assert.strictEqual(getResult(component.compileImports()), getResult(`import React from "react";`));
    });

    mocha.it("Adding imports should not leads to duplicates", function () {
        const importClause = generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                generator.createIdentifier("defaultOptions"),
                generator.createNamedImports(
                    [generator.createIdentifier("Rule")]
                )
            ),
            generator.createStringLiteral("../default_options")
        )
        
        new ReactComponent(
            generator.createDecorator(generator.createCall(generator.createIdentifier("Component"), [], [generator.createObjectLiteral([], false)])),
            [],
            generator.createIdentifier("Component"),
            [],
            [],
            [],
            generator.getContext());

        assert.strictEqual(getResult(importClause.toString()), getResult(`import defaultOptions, {convertRulesToOptions, Rule} from "../default_options"`));
    });

    mocha.it("Import default_options if module doesn't import default_options", function () {
        const component = new ReactComponent(
            generator.createDecorator(generator.createCall(generator.createIdentifier("Component"), [], [generator.createObjectLiteral([], false)])),
            [],
            generator.createIdentifier("Component"),
            [],
            [],
            [],
            generator.getContext());
        
        assert.strictEqual(getResult(component.compileImports()), getResult(`import {convertRulesToOptions, Rule} from "../default_options"; import React from "react";`));
    });

    mocha.it("Do not import default_options if defaultOptionRules is set to null", function () {
        const component = new ReactComponent(
            createComponentDecorator({
                defaultOptionRules: generator.createNull()
            }),
            [],
            generator.createIdentifier("Component"),
            [],
            [],
            [],
            generator.getContext());
        
        assert.strictEqual(getResult(component.compileImports()), getResult(`import React from "react";`));
    });

    mocha.it("Do not generate DefaultOptionsMethod if defaultOptionRules parameter is null", function () {
        const component = new ReactComponent(
            createComponentDecorator({
                defaultOptionRules: generator.createNull()
            }),
            [],
            generator.createIdentifier("Component"),
            [],
            [],
            [],
            generator.getContext());
        
        assert.strictEqual(component.compileDefaultOptionsMethod(), "");
    });

    mocha.it("Import default_options if module doesn't import default_options", function () {
        const component = new ReactComponent(
            generator.createDecorator(generator.createCall(generator.createIdentifier("Component"), [], [generator.createObjectLiteral([], false)])),
            [],
            generator.createIdentifier("Component"),
            [],
            [],
            [],
            generator.getContext());
        
        assert.strictEqual(getResult(component.compileImports()), getResult(`import {convertRulesToOptions, Rule} from "../default_options"; import React from "react";`));
    });
});
