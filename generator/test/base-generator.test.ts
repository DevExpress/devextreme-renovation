import assert from "assert";
import mocha from "./helpers/mocha";
import Generator from "../base-generator";
import { printSourceCodeAst as getAst } from "./helpers/common";
import { Expression, SimpleExpression } from "../base-generator/expressions/base";
import ts from "typescript";
import { ElementAccess, PropertyAccess } from "../base-generator/expressions/property-access";
import { Class } from "../base-generator/expressions/class";
import { ComponentInput } from "../base-generator/expressions/component-input";
import { Component } from "../base-generator/expressions/component";
import { ImportDeclaration } from "../base-generator/expressions/import";

import path from "path";

const generator = new Generator();

import componentCreator from "./helpers/create-component";

const { createComponentDecorator, createDecorator} = componentCreator(generator);

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
        mocha.it("Indentifier", function () {
            const identifier = generator.createIdentifier("a");
            assert.equal(identifier, 'a');
            assert.deepEqual(identifier.getDependency(), []);
        });

        mocha.it("createVoid", function () { 
            const expression = generator.createVoid(generator.createNumericLiteral("0"));
    
            assert.strictEqual(expression.toString(), "void 0");
        });

        mocha.it("createTypeOf", function () { 
            const expression = generator.createTypeOf(generator.createIdentifier("b"));
    
            assert.strictEqual(expression.toString(), "typeof b");
        });

        mocha.it("NonNullExpression", function () {
            const expression = generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field"));
            assert.equal(generator.createNonNullExpression(expression).toString(), "this.field!")
        });

        mocha.it("createNew", function () {
            assert.equal(generator.createNew(
                generator.createIdentifier("a"),
                undefined,
                [generator.createStringLiteral("a"), generator.createNumericLiteral("10")]
            ).toString(), 'new a("a",10)');
        });

        mocha.it("Call", function () {
            assert.equal(generator.createCall(
                generator.createIdentifier("a"),
                undefined,
                [generator.createStringLiteral("a"), generator.createNumericLiteral("10")]
            ).toString(), 'a("a",10)');
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

        mocha.it("createCallChain without question mark and parameters", function () { 
            const expression = generator.createCallChain(
                generator.createPropertyAccessChain(
                    generator.createIdentifier("model"),
                    undefined,
                    generator.createIdentifier("onClick")
                ),
                undefined,
                undefined,
                undefined
              )
    
            assert.deepEqual(expression.toString(), "model.onClick()");
            assert.deepEqual(expression.getDependency(), []);
        });    
        
        mocha.it("Paren", function () {
            assert.equal(generator.createParen(generator.createIdentifier("a")).toString(), "(a)");
        });   
        
        mocha.it("createDelete", function () { 
            assert.equal(generator.createDelete(
                    generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("field"))).toString(), "delete this.field");
        });

        mocha.it("createAsExpression", function () {
            const expression = generator.createAsExpression(
                generator.createThis(),
                generator.createKeywordTypeNode(generator.SyntaxKind.AnyKeyword)
            );
    
            assert.strictEqual(expression.toString(), "this as any");
        });
    });

    mocha.describe("literal expressions", function () { 
        mocha.it("createStringLiteral", function () {
            assert.strictEqual(generator.createStringLiteral("a").toString(), '"a"');
        });

        mocha.it("createNumericLiteral", function () {
            assert.strictEqual(generator.createNumericLiteral("10").toString(), "10");
        });

        mocha.it("ArrayLiteral", function () {
            assert.equal(
                generator.createArrayLiteral([
                    generator.createNumericLiteral("1"),
                    generator.createIdentifier("a")
                ], true).toString(), '[1,a]');
        });

        mocha.it("createArrayTypeNode", function () {
            assert.strictEqual(generator.createArrayTypeNode(
                generator.createKeywordTypeNode(generator.SyntaxKind.NumberKeyword)
            ).toString(), "number[]");
        });

        mocha.it("createLiteralTypeNode", function () { 
            assert.strictEqual(generator.createLiteralTypeNode(generator.createStringLiteral("2")).toString(), '"2"'); ;
        });

        mocha.describe("ObjectLiteral", function () { 
            mocha.it("createObjectLiteral", function () {
                const objectLiteral = generator.createObjectLiteral([
                    generator.createShorthandPropertyAssignment(generator.createIdentifier("a"), undefined),
                    generator.createPropertyAssignment(generator.createIdentifier("k"), generator.createIdentifier("a")),
                    generator.createSpreadAssignment(generator.createIdentifier("obj"))
                ], true);
                assert.equal(objectLiteral.toString(), '{a,\nk:a,\n...obj}');
            });

            mocha.it("ObjectLiteral: Can remove property", function () {
                const objectLiteral = generator.createObjectLiteral([
                    generator.createShorthandPropertyAssignment(generator.createIdentifier("a"), undefined),
                    generator.createPropertyAssignment(generator.createIdentifier("k"), generator.createIdentifier("a")),
                    generator.createSpreadAssignment(generator.createIdentifier("obj"))
                ], true);
                
                objectLiteral.removeProperty("k");
                    
                assert.equal(objectLiteral.toString(), '{a,\n...obj}');
            });
        });

        mocha.it("createRegularExpressionLiteral", function () {
            const expression = generator.createRegularExpressionLiteral('/d+/');
    
            assert.strictEqual(expression.toString(), '/d+/');
        });
    });

    mocha.describe("Operators", function () { 
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
    });

    mocha.describe("Type expressions", function () { 
        mocha.it("TypeQueryNode", function () { 
            const expression = generator.createTypeQueryNode(generator.createIdentifier("Component"));
    
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
                    generator.createArrayTypeNode(generator.createKeywordTypeNode("string")),
                    generator.createArrayTypeNode(generator.createKeywordTypeNode("number"))
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
                    generator.createKeywordTypeNode("string")
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
    
        mocha.it("createTypeAliasDeclaration without modifiers", function () { 
            const literalNode = generator.createTypeLiteralNode(
                [generator.createPropertySignature(
                    [],
                    generator.createIdentifier("b"),
                    undefined,
                    generator.createKeywordTypeNode("string")
                )]
            );
            const expression = generator.createTypeAliasDeclaration(
                undefined,
                undefined,
                generator.createIdentifier("Name"),
                [],
                literalNode);
    
            assert.strictEqual(expression.toString(), " type Name = {b:string}");
        });
    
        
        mocha.it("createIntersectionTypeNode", function () {
            assert.equal(generator.createIntersectionTypeNode(
                [
                    generator.createKeywordTypeNode("string"),
                    generator.createKeywordTypeNode("number")
                ]
            ), "string&number");
        });
    
        mocha.it("createUnionTypeNode", function () {
            assert.equal(generator.createUnionTypeNode(
                [
                    generator.createKeywordTypeNode("string"),
                    generator.createKeywordTypeNode("number")
                ]
            ), "string|number");
        });

        mocha.describe("createPropertySignature", function () { 

            mocha.it("Only name is defined", function () {
                assert.strictEqual(generator.createPropertySignature(
                    undefined,
                    generator.createIdentifier("a"),
                    undefined
                ).toString(), "a");
            });
    
            mocha.it("with type", function () {
                assert.strictEqual(generator.createPropertySignature(
                    undefined,
                    generator.createIdentifier("a"),
                    undefined,
                    generator.createKeywordTypeNode("string")
                ).toString(), "a:string");
            });
    
            mocha.it("with question token token", function () {
                assert.strictEqual(generator.createPropertySignature(
                    undefined,
                    generator.createIdentifier("a"),
                    generator.SyntaxKind.QuestionToken,
                    generator.createKeywordTypeNode("string")
                ).toString(), "a?:string");
            });
    
            mocha.it("with initializer", function () {
                assert.strictEqual(generator.createPropertySignature(
                    undefined,
                    generator.createIdentifier("a"),
                    generator.SyntaxKind.QuestionToken,
                    generator.createKeywordTypeNode("number"),
                    generator.createNumericLiteral("10")
                ).toString(), "a?:number=10");
            });

            mocha.it("ExpressionWithTypeArguments with type arguments", function () {
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
        
            mocha.it("ExpressionWithTypeArguments without type arguments", function () {
                const expresion = generator.createExpressionWithTypeArguments(
                    [],
                    generator.createIdentifier("Component")
                );
        
                assert.strictEqual(expresion.toString(), "Component");
                assert.strictEqual(expresion.type, "Component");
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
    });

    mocha.describe("Statements", function () { 
        mocha.it("ReturnStatement", function () {
            assert.equal(generator.createReturn(generator.createNumericLiteral("10")).toString(), "return 10;")
        });

        mocha.it("createDebuggerStatement", function () { 
            assert.equal(generator.createDebuggerStatement().toString(), "debugger");
        });    

        mocha.it("Block", function () {
            assert.equal(generator.createBlock([], true).toString().replace(/\s+/g, ""), "{}");
            const expression = generator.createBlock([
                generator.createCall(
                    generator.createIdentifier("i"),
                    undefined,
                    []
                ),
                generator.createReturn(
                    generator.createIdentifier("i")
                )
            ], true);
    
            const actualString = expression.toString();
            assert.equal(getAst(actualString), getAst('{i(); return i;}'));
        });

        mocha.it("CreateBreak", function () { 
            assert.equal(generator.createBreak().toString(), "break");
        });
        
    });

    mocha.describe("Conditions", function () {
        mocha.describe("If", function () { 
            mocha.it("w/o else statement", function () {
                const expression = generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("field"));
                const condition = generator.createTrue();
        
                assert.equal(getAst(generator.createIf(condition, expression).toString()), getAst("if(true)this.field"));
            });
        
            mocha.it("with else statement", function () {
                const expression = generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("field"));
                const condition = generator.createTrue();
        
                assert.equal(getAst(generator.createIf(condition, expression, expression).toString()), getAst("if(true) this.field else this.field"));
            });
        });

        mocha.it("createConditional", function () { 
            const expression = generator.createConditional(
                generator.createIdentifier("a"),
                generator.createFalse(),
                generator.createTrue());
            
            assert.equal(expression.toString(), "a?false:true");
        });

        mocha.it("createSwitch", function () {
            const clause1 = generator.createCaseClause(generator.createNumericLiteral("1"), [
                generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("name")
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
    
            const expression = generator.createSwitch(generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("expr")
            ), block);
            const actualString = expression.toString();
            assert.equal(getAst(actualString), getAst(`
            switch(this.expr){
                case 1:
                    this.name;
                    break;
                default:
                    const a = "str";
                    break;
            }
            `));
    
            assert.deepEqual(expression.getDependency(), ["expr", "name"]);
        });    

    });

    mocha.describe("Property Assignment", function () { 
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
    
        mocha.it("ShorthandPropertyAssignment with expression", function () {
            const propertyAssignment = generator.createShorthandPropertyAssignment(
                generator.createIdentifier("k"),
                generator.createIdentifier("v")
            );
            assert.equal(propertyAssignment.toString(), 'k:v');
            assert.equal(propertyAssignment.key, "k");
            assert.equal(propertyAssignment.value, "v");
        });
    
        mocha.it("SpreadAssignement", function () {
            const propertyAssignment = generator.createSpreadAssignment(generator.createIdentifier("obj"));
            assert.equal(propertyAssignment.toString(), '...obj');
        });    
    });

    mocha.describe("Property Access", function () {
        mocha.it("PropertyAccess", function () {
            assert.equal(generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field")
            ).toString(), "this.field");
        });

        mocha.it("PropertyAccess compileStateSetting", function () {
            assert.equal(generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field")
            ).compileStateSetting("value", generator.createProperty(
                [],
                undefined,
                generator.createIdentifier("field"),
                undefined,
                undefined,
                undefined
            )), "this.field=value");
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

        mocha.it("createPropertyAccessChain", function () { 
            const expression = generator.createPropertyAccessChain(
                generator.createIdentifier("a"),
                generator.createToken(generator.SyntaxKind.QuestionDotToken),
                generator.createIdentifier("b")
            );
    
            assert.equal(expression.toString(), "a?.b");
        });
    
        mocha.it("createPropertyAccessChain without QuestionDotToken should add DotToken", function () { 
            const expression = generator.createPropertyAccessChain(
                generator.createThis(),
                undefined,
                generator.createIdentifier("click")
            );
    
            assert.strictEqual(expression.toString(), "this.click");
        });

        mocha.it("createComputedPropertyName", function () { 
            assert.equal(generator.createComputedPropertyName(
                generator.createIdentifier("name")
            ).toString(), "[name]");
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
                    generator.createKeywordTypeNode("string"),
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
                    generator.createKeywordTypeNode("string"),
                    generator.createStringLiteral("str")
                );
        
                assert.equal(parameter.toString(), "a");
                assert.equal(parameter.declaration(), 'a?:string="str"');
                assert.equal(parameter.typeDeclaration(), "a?:string");
            });
        });
    });

    mocha.describe("Template string", function () {
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
                members: []
            }), `"a"+1+"b"+2+"c"`);
        });
    
        mocha.it("createNoSubstitutionTemplateLiteral", function () {
            const expression = generator.createNoSubstitutionTemplateLiteral("10", "10");
    
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
                    generator.createBlock(
                        [generator.createContinue()],
                        true
                    )
                );
        
                assert.equal(getAst(expression.toString()), getAst("for(i;true;i++){continue}"));
                assert.deepEqual(expression.getDependency(), []);
            });
        
            mocha.it("For without initializer, condition, incrementor", function () {
                const expression = generator.createFor(
                    undefined,
                    undefined,
                    undefined,
                    generator.createBlock(
                        [generator.createPropertyAccess(
                            generator.createThis(),
                            generator.createIdentifier("name")
                        )],
                        true
                    )
                );
        
                assert.equal(getAst(expression.toString()), getAst("for(;;){this.name}"));
                assert.deepEqual(expression.getDependency(), ["name"]);
            });
        
            mocha.it("For: get dependency from initializer, condition, incrementor", function () {
                const expression = generator.createFor(
                    generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("i")
                    ),
                    generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("c")
                    ),
                    generator.createPostfix(
                        generator.createPropertyAccess(
                            generator.createThis(),
                            generator.createIdentifier("ii")
                        ),
                        generator.SyntaxKind.PlusPlusToken
                    ),
                    generator.createBlock(
                        [generator.createContinue()],
                        true
                    )
                );
        
                assert.deepEqual(expression.getDependency(), ["i", "c", "ii"])
            });
        });
        mocha.it("While", function () {
            const expression = generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field"));
            const condition = generator.createTrue();
    
            assert.equal(getAst(generator.createWhile(condition, expression).toString()), getAst("while(true)this.field"));
        });
    
        mocha.it("DoWhile", function () {
            const expression = generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field"));
            const condition = generator.createTrue();
    
            assert.equal(getAst(generator.createDo(expression, condition).toString()), getAst("do this.field while(true)"));
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
                generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("i")
                ),
                generator.createBlock(
                    [generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("ii")
                    )],
                    true
                )
            );
    
            const actualString = expression.toString();
    
            assert.equal(getAst(actualString), getAst("for(let i in this.i){this.ii}"));
            assert.deepEqual(expression.getDependency(), ["i", "ii"]);
        });
    });

    mocha.describe("Variables", function () { 
        mocha.it("VaraibleDeclaration", function () {
            const identifier = generator.createIdentifier("a");
            assert.equal(generator.createVariableDeclaration(identifier, undefined, undefined).toString(), 'a', "w/o initializer");
            assert.equal(generator.createVariableDeclaration(identifier, undefined, generator.createStringLiteral("str")).toString(), 'a="str"', "w initializer");
            assert.equal(generator.createVariableDeclaration(identifier, generator.createKeywordTypeNode("string")).toString(), 'a:string', "w type");
            assert.equal(generator.createVariableDeclaration(identifier, generator.createKeywordTypeNode("string"), generator.createStringLiteral("str")).toString(), 'a:string="str"', "w type and initializer");
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
    });

    mocha.describe("JSX", function () { 
        mocha.it("createJsxText", function () {
            assert.strictEqual(generator.createJsxText("test string", "false"), "test string");
            assert.strictEqual(generator.createJsxText("test string", "true"), "");
            assert.strictEqual(generator.createJsxText("   \n", "true"), "");
        });

        mocha.it("createJsxSpreadAttribute", function () { 
            const expression = generator.createJsxSpreadAttribute(
                generator.createIdentifier("field"));
            
            assert.equal(expression.toString(), "{...field}");
            assert.strictEqual(expression.isJsx(), true);
        });
    
        mocha.it("createJsxExpression", function () { 
            const expression = generator.createJsxExpression(
                undefined,
                generator.createIdentifier("field"));
            
            assert.equal(expression.toString(), "{field}");
            assert.strictEqual(expression.isJsx(), true);
        });

        mocha.it("JsxElement", function () {
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(generator.createIdentifier("div"), [], [
                    generator.createJsxAttribute(
                        generator.createIdentifier("name"),
                        generator.createJsxExpression(
                            undefined,
                            generator.createIdentifier("value")
                        )
                    )
                ]),
                [],
                generator.createJsxClosingElement(generator.createIdentifier("div"))
            );
    
            assert.strictEqual(expression.toString(), "<div name={value}></div>");
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
            )

            assert.strictEqual(expression.isReadOnly(), false);
            assert.strictEqual(getAst(expression.toString()), getAst("p?:number = 10"));
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
        });

        mocha.it("Method with decorators, modifiers, type", function () { 
            const expression = generator.createMethod(
                [
                    createDecorator("d1"),
                    createDecorator("d2")
                ],
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
            assert.strictEqual(getAst(expression.toString()), getAst("@d1() @d2() public name():string{}"));
        });
    });

    mocha.describe("class expressions", function () { 

        mocha.it("createHeritageClause", function () {
            assert.equal(generator.createHeritageClause(
                generator.SyntaxKind.ExtendsKeyword,
                [generator.createExpressionWithTypeArguments(
                    undefined,
                    generator.createIdentifier("Base")
                )]
            ).toString(), "extends Base");
        });

        mocha.it("createClassDeclaration without decorators and modifiers", function () {
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

            
            assert.strictEqual(getAst(expression.toString()), getAst(`class class1 {}`));
        });

        mocha.it("createClassDeclaration with modifiers and decorators", function () {
            const expression = generator.createClassDeclaration(
                [
                    createDecorator("d1"),
                    createDecorator("d2")
                ],
                [
                    "export",
                    "default"
                ],
                generator.createIdentifier("class1"),
                [],
                [],
                []
            );

            assert.ok(expression instanceof Class);
            assert.ok(!(expression instanceof ComponentInput));
            assert.ok(!(expression instanceof Component));

            assert.strictEqual(getAst(expression.toString()), getAst(`
            @d1()
            @d2()
            export default class class1 {}`));
        });

        mocha.it("createClassDeclaration with heritage clause", function () {
            const heritageClause = generator.createHeritageClause(
                generator.SyntaxKind.ExtendsKeyword,
                [generator.createExpressionWithTypeArguments(
                    undefined,
                    generator.createIdentifier("Base")
                )]);
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

            assert.strictEqual(getAst(expression.toString()), getAst(`class class1 extends Base {}`));
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
                    )
                ]
            );

            assert.ok(expression instanceof Class);
            assert.ok(!(expression instanceof ComponentInput));
            assert.ok(!(expression instanceof Component));

            assert.strictEqual(getAst(expression.toString()), getAst(`class class1 {
                p1: any;
                p2: any;
            }`));
        });
    });

    mocha.describe("import", function () { 
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
            ), 'import Button from "./button"');
        });
    
        mocha.it("ImportDeclaration: can remove named import", function () { 
            const expression = generator.createImportDeclaration(
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
            ) as ImportDeclaration;
    
            expression.importClause.remove("Node");
    
            assert.equal(expression.toString(), 'import ts from "typescript"');
        });
    
        mocha.it("ImportDeclaration: remove named import if no named bindings", function () { 
            const expression = generator.createImportDeclaration(
                undefined,
                undefined,
                undefined,
                generator.createStringLiteral("typescript")
            ) as ImportDeclaration;
    
            expression.importClause.remove("Node");
    
            assert.equal(expression.toString(), 'import "typescript"');
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


mocha.describe("Component", function () { 
    this.beforeEach(() => {
        generator.setContext({});
    });
    this.afterEach(() => {
        generator.setContext(null);
    });

    mocha.it("class with Component decorator is Component istance", function () {
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

    mocha.it("Add Component input to cahce", function () { 
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
                generator.createProperty([], [], generator.createIdentifier("p"), undefined, generator.createKeywordTypeNode("number"), generator.createNumericLiteral("10")),
                generator.createProperty([], [], generator.createIdentifier("p1"), undefined, generator.createKeywordTypeNode("number"), generator.createNumericLiteral("15"))
            ]
        );

        const cachedComponent = generator.getContext().components!["BaseModel"];
        assert.deepEqual(cachedComponent.heritageProperies.map(p => p.name.toString()), ["p", "p1"]);
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

    mocha.it("Parse imported component. module specifier has extension", function () {
        const identifier = generator.createIdentifier("Base");
        generator.createImportDeclaration(
            undefined,
            undefined,
            generator.createImportClause(
                identifier,
                undefined
            ),
            generator.createStringLiteral("./test-cases/declarations/empty-component.tsx")
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
        
        assert.deepEqual(heritageClause.members.map(m => m.name.toString()), ["height", "width"]);
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
        assert.ok(generator.getContext().components!["Widget"] instanceof Component);
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
    });
});
