import mocha from "mocha";
import generator from "../angular-generator";
import assert from "assert";

import { printSourceCodeAst as getResult } from "./helpers/common";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

mocha.describe("Angular generator", function () {
    
    mocha.describe("JSX -> AngularTemplate", function () { 
        
        mocha.it("Empty JsxOpeningElement", function () { 
            assert.strictEqual(
                generator.createJsxOpeningElement(
                    generator.createIdentifier("div"),
                    undefined,
                    undefined
                ).toString(),
                "<div >"
            );
        });

        mocha.it("Empty JsxSelfClosingElement", function () {
            assert.strictEqual(
                generator.createJsxSelfClosingElement(
                    generator.createIdentifier("div"),
                    undefined,
                    undefined
                ).toString(),
                "<div />"
            ); 
        });

        mocha.it(`JsxAttribute with expression - [attr]="value"`, function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("attr"),
                generator.createJsxExpression(
                    undefined,
                    generator.createIdentifier("value")
                )
            );

            assert.strictEqual(expression.toString(), `[attr]="value"`);
        });

        mocha.it(`JsxAttribute with string literal expression - attr="value"`, function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("attr"),
                generator.createStringLiteral("value")
            );

            assert.strictEqual(expression.toString(), `attr="value"`);
        });

        mocha.it("JsxSelfClosingElement with attributes", function () {
            const expression = generator.createJsxSelfClosingElement(
                generator.createIdentifier("div"),
                [],
                generator.createJsxAttributes([
                    generator.createJsxAttribute(generator.createIdentifier("a1"), generator.createNumericLiteral("10")),
                    generator.createJsxAttribute(generator.createIdentifier("a2"), generator.createNumericLiteral("15"))
                ])
            );

            assert.strictEqual(expression.toString(), `<div [a1]="10"\n[a2]="15"/>`);
        });

        mocha.it("JsxElement with SelfClosing element", function () { 
            const expression = generator.createJsxElement(
                generator.createJsxSelfClosingElement(
                    generator.createIdentifier("div")
                ),
                [],
                ""
            );

            assert.strictEqual(expression.toString(), "<div />");
            assert.strictEqual(expression.isJsx(), true);
        });

        mocha.it("JSX element witn Opening and Close Elements", function () { 
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(
                    generator.createIdentifier("div"),
                    undefined,
                    generator.createJsxAttributes([generator.createJsxAttribute(
                        generator.createIdentifier("style"),
                        generator.createJsxExpression(
                            undefined,
                            generator.createObjectLiteral(
                                [generator.createPropertyAssignment(
                                    generator.createIdentifier("height"),
                                    generator.createPropertyAccess(
                                        generator.createIdentifier("viewModel"),
                                        generator.createIdentifier("height")
                                    )
                                )],
                                false
                            )
                        )
                    )])
                ),
                [],
                generator.createJsxClosingElement(generator.createIdentifier("div"))
            );

            assert.strictEqual(expression.toString(), '<div [style]="{height:viewModel.height}"></div>');
        });

        mocha.it("JSX element witn with child element", function () { 
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(
                    generator.createIdentifier("parent"),
                    undefined,
                    []
                ),
                [
                    generator.createJsxSelfClosingElement(generator.createIdentifier("child"))
                ],
                generator.createJsxClosingElement(generator.createIdentifier("parent"))
            );

            assert.strictEqual(expression.toString(), '<parent ><child /></parent>');
        });

        mocha.it("JSX element witn with child element that transformed from expression - no wrap it {{}}", function () {
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(
                    generator.createIdentifier("parent"),
                    undefined,
                    []
                ),
                [
                    generator.createJsxExpression(
                        undefined,
                        generator.createBinary(
                            generator.createTrue(),
                            generator.createToken(generator.SyntaxKind.AmpersandAmpersandToken),
                            generator.createJsxElement(
                                generator.createJsxOpeningElement(
                                    generator.createIdentifier("child"),
                                    undefined,
                                    []
                                ),
                                [],
                                generator.createJsxClosingElement(generator.createIdentifier("child"))
                            )
                        )
                    )
                ],
                generator.createJsxClosingElement(generator.createIdentifier("parent"))
            );
            assert.strictEqual(expression.toString(), `<parent ><child *ngIf="true"></child></parent>`);
        });

        mocha.it(`<element>{"text"}</element> -> <element>text</element>`, function () {
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(
                    generator.createIdentifier("element"),
                    undefined,
                    []
                ),
                [
                    generator.createJsxExpression(
                        undefined,
                        generator.createStringLiteral("text")
                    )
                ],
                generator.createJsxClosingElement(generator.createIdentifier("element"))
            );
            assert.strictEqual(expression.toString(), `<element >text</element>`);
        });

        mocha.it("Rename className attribute to class", function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("className"),
                generator.createJsxExpression(
                    undefined,
                    generator.createIdentifier("value")
                )
            );

            assert.strictEqual(expression.toString(), `[class]="value"`);
        });

        mocha.it("notJsxExpr && <element></element> -> <element *ngIf='notJsxExpr'></element>", function () { 
            const expression = generator.createJsxExpression(
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
                            generator.createJsxAttributes([])
                        ),
                        [],
                        generator.createJsxClosingElement(
                            generator.createIdentifier("input")
                        )
                    )
                )
            );

            assert.strictEqual(expression.toString(), `<input *ngIf="viewModel.input"></input>`);
        });

        mocha.it("notJsxExpr && <element/> -> <element *ngIf='notJsxExpr' />", function () { 
            const expression = generator.createJsxExpression(
                undefined,
                generator.createBinary(
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("input")
                    ),
                    generator.createToken(generator.SyntaxKind.AmpersandAmpersandToken),
                        generator.createJsxSelfClosingElement(
                            generator.createIdentifier("input"),
                            undefined,
                            generator.createJsxAttributes([])
                        )
                )
            );

            assert.strictEqual(expression.toString(), `<input *ngIf="viewModel.input"/>`);
        });

        mocha.it("<element>nonJsxExpr</element> -> <element>{{nonJsxExpr}}</element>", function () { 
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(
                    generator.createIdentifier("span"),
                    undefined,
                    []
                ),
                [generator.createJsxExpression(
                    undefined,
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("text")
                    )
                )],
                generator.createJsxClosingElement(generator.createIdentifier("span"))
            );

            
            assert.strictEqual(expression.toString(), "<span >{{viewModel.text}}</span>");
        });

        mocha.it("ref", function () { 
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("ref"),
                generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("refName")
                )
            );

            assert.strictEqual(expression.toString(), "#viewModel.refName");
        });

        mocha.describe("View Function", function () { 
            this.beforeEach(function () {
                this.block = generator.createBlock([
                    generator.createReturn(
                        generator.createJsxElement(
                            generator.createJsxSelfClosingElement(
                                generator.createIdentifier("div")
                            ),
                            [],
                            ""
                        )
                    )
                ], false);
            });

            mocha.it("Function that returns JSX can be converted to template", function () {
                const expression = generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("View"),
                    [],
                    [],
                    "",
                    this.block
                );

                assert.strictEqual(expression.toString(), "");
                assert.strictEqual(expression.getTemplate(), "<div />");
            });

            mocha.it("Rename viewModel identifier", function () {
                const expression = generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("View"),
                    [],
                    [generator.createParameter(
                        [],
                        [],
                        undefined,
                        generator.createIdentifier("passedViewModel"),
                        undefined,
                        undefined,
                        undefined
                    )],
                    "",
                    generator.createBlock([
                        generator.createReturn(
                            generator.createJsxElement(
                                generator.createJsxOpeningElement(
                                    generator.createIdentifier("span"),
                                    undefined,
                                    generator.createJsxAttributes(
                                        [
                                            generator.createJsxAttribute(
                                                generator.createIdentifier("attr"),
                                                generator.createPropertyAccess(
                                                    generator.createIdentifier("passedViewModel"),
                                                    generator.createIdentifier("value")
                                                )
                                            )
                                        ]
                                    )
                                ),
                                [generator.createJsxExpression(
                                    undefined,
                                    generator.createPropertyAccess(
                                        generator.createIdentifier("passedViewModel"),
                                        generator.createIdentifier("text")
                                    )
                                )],
                                generator.createJsxClosingElement(generator.createIdentifier("span"))
                            )
                        )
                    ], false)
                );

                assert.strictEqual(expression.getTemplate(), `<span [attr]="_viewModel.value">{{_viewModel.text}}</span>`);
            });

            mocha.it("Function without JSX is generated", function () {
                const expression = generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("View"),
                    [],
                    [],
                    "",
                    generator.createBlock([], false)
                );

                assert.strictEqual(getResult(expression.toString()), getResult("function View(){}"));
                assert.strictEqual(expression.getTemplate(), "");
            });
        });

    });
});
