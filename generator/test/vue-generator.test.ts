import mocha from "./helpers/mocha";
import assert from "assert";
import generator from "../vue-generator";

import { printSourceCodeAst as getAst, removeSpaces } from "./helpers/common";
import componentCreator from "./helpers/create-component";
const { createDecorator } = componentCreator(generator);


mocha.describe("Vue-generator", function () { 
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
        
                    assert.strictEqual(getAst(expression.toString()), getAst("p: {type: String}"));
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
        
                    assert.strictEqual(getAst(expression.toString()), getAst("p: {type: Array}"));
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
        
                    assert.strictEqual(getAst(expression.toString()), getAst("p: {type: Function"));
                });

                mocha.it("Property with TypeReferenceNode", function () {
                    const expression = generator.createProperty(
                        decorators,
                        undefined,
                        name,
                        undefined,
                        generator.createTypeReferenceNode(
                            generator.createIdentifier("Array"),
                            [
                                generator.createKeywordTypeNode("Number")
                            ]
                        ),
                        undefined
                    );
            
                    assert.strictEqual(getAst(expression.toString()), getAst("p: {type: Array"));
                });
    
                mocha.describe("Property with LiteralTypeNode", function () { 
                    mocha.it("Object", function () { 
                        const expression = generator.createProperty(
                            decorators,
                            undefined,
                            name,
                            undefined,
                            generator.createLiteralTypeNode(
                                generator.createObjectLiteral(
                                    [],
                                    false
                                )
                            ),
                            undefined
                        );
            
                        assert.strictEqual(getAst(expression.toString()), getAst("p: {type: Object}"));
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
            
                        assert.strictEqual(getAst(expression.toString()), getAst("p: {type: String}"));
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
            
                        assert.strictEqual(getAst(expression.toString()), getAst("p: {type: Number}"));
                    });
                });

                mocha.describe("Union", function () { 
                    mocha.it("Property with Union type", function () { 
                        const expression = generator.createProperty(
                            decorators,
                            undefined,
                            name,
                            undefined,
                            generator.createUnionTypeNode(
                                [
                                    generator.createKeywordTypeNode("string"),
                                    generator.createKeywordTypeNode("number")
                                ],
                            ),
                            undefined
                        );
            
                        assert.strictEqual(getAst(expression.toString()), getAst("p: {type: [String,Number]}"));
                    });
    
                    mocha.it("type should not have duplicates", function () { 
                        const expression = generator.createProperty(
                            decorators,
                            undefined,
                            name,
                            undefined,
                            generator.createUnionTypeNode(
                                [
                                    generator.createLiteralTypeNode(
                                        generator.createStringLiteral("10")
                                    ),
                                    generator.createLiteralTypeNode(
                                        generator.createStringLiteral("11")
                                    ),
                                    generator.createLiteralTypeNode(
                                        generator.createNumericLiteral("12")
                                    )
                                ]
                            ),
                            undefined
                        );
            
                        assert.strictEqual(getAst(expression.toString()), getAst("p: {type: [String, Number]}"));
                    });

                    mocha.it("type should be an array if only one type in the union", function () { 
                        const expression = generator.createProperty(
                            decorators,
                            undefined,
                            name,
                            undefined,
                            generator.createUnionTypeNode(
                                [
                                    generator.createLiteralTypeNode(
                                        generator.createStringLiteral("10")
                                    ),
                                    generator.createLiteralTypeNode(
                                        generator.createStringLiteral("11")
                                    ),
                                    generator.createLiteralTypeNode(
                                        generator.createStringLiteral("12")
                                    )
                                ]
                            ),
                            undefined
                        );
            
                        assert.strictEqual(getAst(expression.toString()), getAst("p: {type: String}"));
                    });
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
        
                    assert.strictEqual(getAst(expression.toString()), getAst("p: {}"));
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
    
                assert.strictEqual(getAst(expression.toString()), getAst(`p: {
                    type: String,
                    required: true
                }`));
            });
    
            mocha.it("Property with initializer", function () { 
                const expression = generator.createProperty(
                    decorators,
                    undefined,
                    name,
                    undefined,
                    undefined,
                    generator.createNumericLiteral("10")
                );
    
                assert.strictEqual(getAst(expression.toString()), getAst(`p: { default(){
                    return 10;
                }}`));
            });

            mocha.describe("TwoWay", function () { 
                mocha.it("shouldn't have initializer", function () {
                    const expression = generator.createProperty(
                        [createDecorator("TwoWay")],
                        undefined,
                        name,
                        generator.SyntaxKind.QuestionToken,
                        generator.createKeywordTypeNode("boolean"),
                        generator.createTrue()
                    );
            
                    assert.strictEqual(getAst(expression.toString()), getAst("p: {type: Boolean}"));
                });
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
            
                    assert.strictEqual(expression.toString(), "");
                });
            });

            mocha.describe("Template", function () { 
                mocha.it("Template props toString should return empty string", function () {
                    const expression = generator.createProperty(
                        [createDecorator("Template")],
                        undefined,
                        name,
                        generator.SyntaxKind.QuestionToken,
                        generator.createKeywordTypeNode("boolean"),
                        generator.createTrue()
                    );
            
                    assert.strictEqual(expression.toString(), "");
                });
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
        
                assert.strictEqual(getAst(expression.toString()), getAst("p: undefined"));
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
        
                assert.strictEqual(getAst(expression.toString()), getAst("p: 10"));
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
        
                assert.strictEqual(expression.toString(), "");
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
        
                assert.strictEqual(expression.toString(), "");
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
        mocha.it("Call expression generates usual call if not event", function () { 
            assert.equal(generator.createCall(
                generator.createIdentifier("a"),
                undefined,
                [generator.createNumericLiteral("10")]
            ).toString(), 'a(10)');
        });

        mocha.it("Call expression generates emit if call Event", function () { 
            const member = generator.createProperty(
                [createDecorator("Event")],
                undefined,
                generator.createIdentifier("onClick")
            )
            assert.equal(generator.createCall(
                generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("onClick")
                ),
                undefined,
                [generator.createNumericLiteral("10")]
            ).toString({members: [member]}), 'this.$emit("on-click", 10)');
        });

        mocha.it("Call expression generates emit if call Event using variable", function () { 
            const member = generator.createProperty(
                [createDecorator("Event")],
                undefined,
                generator.createIdentifier("onClick")
            );
            const expression = generator.createCall(
                generator.createIdentifier("click"),
                undefined,
                [generator.createNumericLiteral("10")]
            );

            const propertyAccess = generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("onClick")
            );

            assert.equal(expression.toString({
                members: [member],
                variables: {
                    click: propertyAccess
                }
            }), 'this.$emit("on-click", 10)');
        });
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

            assert.strictEqual(getAst(expression.toString({
                members: []
            })), getAst("m(){}"));
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
                    )
                ],
                undefined,
                generator.createBlock([], false)
            );

            assert.strictEqual(getAst(expression.toString({
                members: []
            })), getAst(`m(p1=10, p2){}`));
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
            
            assert.strictEqual(getAst(expression.toString({
                members:[]
            })), getAst("m(){}"));
            assert.strictEqual(expression.getter(), "m()");
            assert.strictEqual(expression.getter("this"), "this.m()");
        });

    });

    mocha.describe("Template", function () { 

        mocha.describe("View Function", function () { 
            const viewFunctionBlock = generator.createBlock([
                generator.createReturn(
                    generator.createJsxSelfClosingElement(
                        generator.createIdentifier("div"),
                        [],
                        []
                    )
                )
            ], false);

            mocha.it("Function that returns jsx converts to empty string", function () { 
                const expression = generator.createFunctionDeclaration(
                    undefined,
                    undefined,
                    "",
                    generator.createIdentifier("view"),
                    undefined,
                    [],
                    undefined,
                    viewFunctionBlock
                )

                assert.strictEqual(expression.toString(), "")
            });

            mocha.it("ArrowFunction that returns jsx converts to empty string", function () { 
                const expression = generator.createArrowFunction(
                    undefined,
                    undefined,
                    [],
                    undefined,
                    generator.SyntaxKind.EqualsGreaterThanToken,
                    viewFunctionBlock
                )

                assert.strictEqual(expression.toString(), "")
            });

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

                const expression = generator.createVariableStatement([generator.SyntaxKind.ExportKeyword],
                    generator.createVariableDeclarationList(
                        [generator.createVariableDeclaration(
                            generator.createIdentifier("viewFunction"),
                            undefined,
                            functionDeclaration
                        )],
                        generator.SyntaxKind.ConstKeyword
                    )
                );

                assert.strictEqual(expression.toString(), "");
            });
        });
    });

    mocha.describe("Component Input", function () { 
        mocha.it("Component Binding should be an object", function () { 
            const expression = generator.createClassDeclaration(
                [createDecorator("ComponentBindings")],
                ["export", "default"],
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
                    )
                ]
            );

            assert.strictEqual(getAst(expression.toString()), getAst(`export default const Props = {
                p: {type: String},
                p1: {type: Number}
            }`));
        });

        mocha.it("Component with heritage clauses", function () { 
            const expression = generator.createClassDeclaration(
                [createDecorator("ComponentBindings")],
                ["export", "default"],
                generator.createIdentifier("Props"),
                [],
                [
                    generator.createHeritageClause(
                        generator.SyntaxKind.ExtendsKeyword,
                        [generator.createExpressionWithTypeArguments(
                            undefined,
                            generator.createIdentifier("Base")
                        )])
                ],
                [
                    generator.createProperty(
                        [createDecorator("OneWay")],
                        [],
                        generator.createIdentifier("p"),
                        undefined,
                        generator.createKeywordTypeNode("string"),
                        undefined
                    )
                ]
            );

            assert.strictEqual(getAst(expression.toString()), getAst(`export default const Props = {
                ...Base,
                p: {type: String}
            }`));
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
                    generator.createJsxOpeningElement(
                        generator.createIdentifier("div")
                    ),
                    [],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                );

                assert.strictEqual(expression.toString(), "<div ></div>");
            });

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
                            )
                        ]
                    ),
                    [],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                );

                assert.strictEqual(removeSpaces(expression.toString()), removeSpaces(`<div :a="10" b="word"></div>`));
            });

            mocha.it("notJsxExpr && <element></element> -> <element v-if='notJsxExpr'></element>", function () {
                const expression = generator.createJsxElement(
                    generator.createJsxOpeningElement(
                        generator.createIdentifier("div"),
                        undefined,
                        []
                    ),
                    [generator.createJsxExpression(
                        undefined,
                        generator.createBinary(
                            generator.createPropertyAccess(
                                generator.createIdentifier("viewModel"),
                                generator.createIdentifier("input")
                            ),
                            generator.createToken(generator.SyntaxKind.AmpersandAmpersandToken),
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
                    )],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                );
    
                assert.strictEqual(expression.children[0].toString(), `<input v-if="viewModel.input"></input>`);
            });

            mocha.it("condition?then:else - <div v-if='condition'> <div v-else>", function () {
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
                    [generator.createJsxExpression(
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
                    )],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                );
    
                assert.strictEqual(removeSpaces(expression.children[0].toString({
                    componentContext: "viewModel",
                    newComponentContext: "",
                    members: [property]
                })), removeSpaces(`<input :a="_value()" v-if="condition"/>\n<input :a="_value()" v-else/>`));
            });

            mocha.it("non jsx conditional - condition?then:else - {{then}} {{else}}'", function () {
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
                    [generator.createJsxExpression(
                        undefined,
                        generator.createConditional(
                            generator.createIdentifier("condition"),
                            thenStatement,
                            elseStatement
                        )
                    )],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                );
    
                assert.strictEqual(removeSpaces(expression.children[0].toString({
                    componentContext: "viewModel",
                    newComponentContext: "",
                    members: [property]
                })), removeSpaces(`<template v-if="condition">{{_value()}}</template><template v-else>{{!_value()}}</template>`));
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
    
                assert.strictEqual(expression.toString({
                    members: [templateProperty],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<slot name="template" ></slot>`);
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
                        )
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
    
                assert.strictEqual(expression.toString({
                    members: [templateProperty],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<slot name="template" :v-bind:p1="10" :v-bind:p2="'11'"></slot>`);
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
    
                assert.strictEqual(expression.toString({
                    members: [templateProperty],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<slot name="template" ></slot>`);
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
                       )
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
    
                assert.strictEqual(expression.toString({
                    members: [templateProperty],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<slot name="template" :v-bind="item"></slot>`);
            });
        });

        mocha.describe("Slot", function () {
            mocha.it("defaultSlot", function () {
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
                                generator.createIdentifier("viewModel"),
                                generator.createIdentifier("default")
                            )
                        )
                    ],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                )
    
                const slotProperty = generator.createProperty(
                    [createDecorator("Slot")],
                    [],
                    generator.createIdentifier("default"),
                    generator.SyntaxKind.QuestionToken,
                    undefined,
                    undefined
                );
    
                assert.strictEqual(expression.toString({
                    members: [slotProperty],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<div ><slot></slot></div>`);
            });

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
                                generator.createIdentifier("viewModel"),
                                generator.createIdentifier("children")
                            )
                        )
                    ],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                )
    
                const slotProperty = generator.createProperty(
                    [createDecorator("Slot")],
                    [],
                    generator.createIdentifier("children"),
                    generator.SyntaxKind.QuestionToken,
                    undefined,
                    undefined
                );
    
                assert.strictEqual(expression.toString({
                    members: [slotProperty],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<div ><slot></slot></div>`);
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
                                generator.createIdentifier("viewModel"),
                                generator.createIdentifier("slotName")
                            )
                        )
                    ],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                )
    
                const slotProperty = generator.createProperty(
                    [createDecorator("Slot")],
                    [],
                    generator.createIdentifier("slotName"),
                    generator.SyntaxKind.QuestionToken,
                    undefined,
                    undefined
                );
    
                assert.strictEqual(expression.toString({
                    members: [slotProperty],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<div ><slot name="slotName"></slot></div>`);
            });
        });

      
    });
    
});
