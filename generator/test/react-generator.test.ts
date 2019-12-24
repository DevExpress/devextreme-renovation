import assert from "assert";
import mocha from "mocha";
import ts from "typescript";
import generator from "../react-generator";

import compile from "../component-compiler";

import { printSourceCodeAst as getResult, createTestGenerator } from "./helpers/common";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}


mocha.describe("react-generator", function () {
    this.beforeAll(function () {
        const testGenerator = createTestGenerator("react");
        compile(`${__dirname}/test-cases/declarations`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            testGenerator.call(this, componentName, generator);
        };
    });

    this.afterEach(function () {
        if (this.currentTest!.state !== "passed") {
            console.log(this.code); // TODO: diff with expected
        }
        this.code = null;
        this.expectedCode = null;
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

    mocha.it("simple-block", function () {
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
});

mocha.describe("react-generator: expressions", function () {
    mocha.it("Indentifier", function () {
        const identifier = generator.createIdentifier("a");
        assert.equal(identifier, 'a');
        assert.deepEqual(identifier.getDependency(), []);
    });
    mocha.it("StringLiteral", function () {
        assert.equal(generator.createStringLiteral("a"), '"a"');
    });
    mocha.it("NumericLiteral", function () {
        assert.equal(generator.createNumericLiteral("10"), 10);
    });
    mocha.it("ArrayTypeNode", function () {
        assert.equal(generator.createArrayTypeNode(generator.SyntaxKind.NumberKeyword), "number[]");
    });
    mocha.it("VaraibleDeclaration", function () {
        const identifier = generator.createIdentifier("a");
        assert.equal(generator.createVariableDeclaration(identifier, undefined, undefined).toString(), 'a', "w/o initializer");
        assert.equal(generator.createVariableDeclaration(identifier, undefined, generator.createStringLiteral("str")).toString(), 'a="str"', "w initializer");
        assert.equal(generator.createVariableDeclaration(identifier, "string", undefined).toString(), 'a:string', "w type");
        assert.equal(generator.createVariableDeclaration(identifier, "string", generator.createStringLiteral("str")).toString(), 'a:string="str"', "w type and initializer");
    });

    mocha.it("VaraibleDeclarationList", function () {
        assert.equal(generator.createVariableDeclarationList(
            [
                generator.createVariableDeclaration(generator.createIdentifier("a"), undefined, generator.createStringLiteral("str")),
                generator.createVariableDeclaration(generator.createIdentifier("b"), undefined, generator.createNumericLiteral("10"))
            ],
            generator.NodeFlags.Const
        ).toString(), 'const a="str",\nb=10');
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

    mocha.it("createImportDeclaration exclude imports from component_declaration/common", function () { 
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
        assert.equal(generator.createPropertyAssignment("k", generator.createIdentifier("a")).toString(), 'k:a');
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
            generator.createPropertyAssignment("k", generator.createIdentifier("a")),
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
        assert.equal(generator.createElementAccess(
            generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("field")),
            generator.createNumericLiteral("10")
        ).toString(), "this.field[10]")
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
    
    mocha.it("While", function () {
        const expression = generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("field"));
        const condition = generator.createTrue();

        assert.equal(getResult(generator.createWhile(condition, expression).toString()), getResult("while(true)this.field"));
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
});