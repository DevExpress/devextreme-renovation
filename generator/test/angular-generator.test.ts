import mocha from "mocha";
import generator, { Property, AngularDirective } from "../angular-generator";
import assert from "assert";
import path from "path";

import { printSourceCodeAst as getResult } from "./helpers/common";
import { Identifier, GeneratorContex, Expression } from "../react-generator";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

function createDecorator(name: string) {
    return generator.createDecorator(generator.createCall(
        generator.createIdentifier(name),
        [],
        []
    ));
}

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

function createComponent(properties: Property[] = [], paramenters: { [name: string]: Expression } = {}) {
    return generator.createComponent(
        createComponentDecorator(paramenters),
        [],
        generator.createIdentifier("BaseWidget"),
        [],
        [],
        properties
    );
}

mocha.describe("Angular generator", function () {

    mocha.describe("JSX -> AngularTemplate", function () {
        this.beforeEach(function () {
            generator.setContext({
                dirname: __dirname
            });
        });

        this.afterEach(function () { 
            generator.setContext(null);
        });
        
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

        mocha.it("Empty JsxSelfClosingElement should have opening and closing tags", function () {
            assert.strictEqual(
                generator.createJsxSelfClosingElement(
                    generator.createIdentifier("div"),
                    undefined,
                    undefined
                ).toString(),
                "<div ></div>"
            );
        });

        mocha.it("Void elements should be self-closing", function () {
            assert.strictEqual(
                generator.createJsxSelfClosingElement(
                    generator.createIdentifier("img"),
                    undefined,
                    undefined
                ).toString(),
                "<img />"
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

        mocha.it(`process title attribute - use empty string if value is undefined"`, function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("title"),
                generator.createJsxExpression(
                    undefined,
                    generator.createIdentifier("value")
                )
            );

            assert.strictEqual(expression.toString(), `[title]="value!==undefined?value:''"`);
        });

        mocha.it(`do not process title attribute if it stringLiteral value"`, function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("title"),
                generator.createStringLiteral("value")
            );

            assert.strictEqual(expression.toString(), `title="value"`);
        });

        mocha.it(`JsxAttribute with template expression - [attr]="string concatination"`, function () {
            const templateExpression = generator.createTemplateExpression(
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

            const expression = generator.createJsxAttribute(
                generator.createIdentifier("attr"),
                generator.createJsxExpression(
                    undefined,
                    templateExpression
                )
            );

            assert.strictEqual(expression.toString(), `[attr]="'a'+1+'b'+2+'c'"`);
        });

        mocha.it(`JsxAttribute with string literal expression - attr="value"`, function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("attr"),
                generator.createStringLiteral("value")
            );

            assert.strictEqual(expression.toString(), `attr="value"`);
        });

        mocha.it(`JsxAttribute is JsxExpression with stringLiteral - attr="value"`, function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("attr"),
                generator.createJsxExpression(
                    undefined,
                    generator.createStringLiteral("value")
                )
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

            assert.strictEqual(expression.toString(), `<div [a1]="10"\n[a2]="15"></div>`);
        });

        mocha.it("JSX element witn Opening and Close Elements", function () {
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(
                    generator.createIdentifier("div"),
                    undefined,
                    generator.createJsxAttributes([generator.createJsxAttribute(
                        generator.createIdentifier("a"),
                        generator.createIdentifier("value")
                    )])
                ),
                [],
                generator.createJsxClosingElement(generator.createIdentifier("div"))
            );

            assert.strictEqual(expression.toString(), '<div [a]="value"></div>');
        });

        mocha.it("Fragment should be ignored", function () {
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(
                    generator.createIdentifier("Fragment"),
                    undefined,
                    undefined
                ),
                [
                    generator.createJsxSelfClosingElement(
                        generator.createIdentifier("div")
                    )
                ],
                generator.createJsxClosingElement(generator.createIdentifier("Fragment"))
            );

            assert.strictEqual(expression.toString(), '<div ></div>');
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

            assert.strictEqual(expression.toString(), '<parent ><child ></child></parent>');
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

        mocha.it("Rename style attribute to ngStyle", function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("style"),
                generator.createJsxExpression(
                    undefined,
                    generator.createIdentifier("value")
                )
            );

            assert.strictEqual(expression.toString(), `[ngStyle]="__processNgStyle(value)"`);
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

        mocha.it("ngIf derictive with string - replace quotes with backslach quotes", function () {
            const expression = generator.createJsxExpression(
                undefined,
                generator.createBinary(
                    generator.createBinary(
                        generator.createIdentifier("viewModel"),
                        generator.SyntaxKind.EqualsEqualsEqualsToken,
                        generator.createStringLiteral("input")
                    ),
                    generator.createToken(generator.SyntaxKind.AmpersandAmpersandToken),
                    generator.createJsxSelfClosingElement(
                        generator.createIdentifier("input"),
                        undefined,
                        generator.createJsxAttributes([])
                    )
                )
            );

            assert.strictEqual(expression.toString(), `<input *ngIf="viewModel==='input'"/>`);
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

        mocha.describe("Spread Attributes", function () { 
            this.beforeEach(function () {
                generator.setContext(null);
                generator.setContext({
                    dirname: __dirname
                });
            });

            this.afterEach(function () {
                generator.setContext(null);
            });
            mocha.it("should not be in element", function () { 
                const expression = generator.createJsxSpreadAttribute(
                    generator.createIdentifier("attr")
                );
    
                assert.strictEqual(expression.toString(), "");
            });

            mocha.it("element with spread attribute should not generate ref attribute if it have one", function () { 
                const spread = generator.createJsxSpreadAttribute(
                    generator.createIdentifier("attr")
                );

                const element = generator.createJsxSelfClosingElement(
                    generator.createIdentifier("input"),
                    [],
                    [
                        spread,
                        generator.createJsxAttribute(
                            generator.createIdentifier("ref"),
                            generator.createIdentifier("value")
                        )
                    ]
                );
    
                assert.strictEqual(element.toString(), "<input #value/>");
                const spreadAttributes = element.getSpreadAttributes();
                assert.strictEqual(spreadAttributes.length, 1);
                assert.strictEqual(spreadAttributes[0].expression.toString(), "attr");
                assert.strictEqual(spreadAttributes[0].refExpression.toString(), "value");
            });

            mocha.it("element with spread attribute should generate unique ref attribute if it have no one", function () { 
                const spread = generator.createJsxSpreadAttribute(
                    generator.createIdentifier("attr")
                );

                const element = generator.createJsxSelfClosingElement(
                    generator.createIdentifier("input"),
                    [],
                    [spread]
                );
    
                assert.strictEqual(element.toString(), "<input #_auto_ref_0/>");
                const spreadAttributes = element.getSpreadAttributes();
                assert.strictEqual(spreadAttributes.length, 1);
                assert.strictEqual(spreadAttributes[0].expression.toString(), "attr");
                assert.strictEqual(spreadAttributes[0].refExpression.toString(), "_auto_ref_0");
            });

            mocha.it("getJsxAttributes should collect attributes from all tree", function () { 
                const spread = generator.createJsxSpreadAttribute(
                    generator.createIdentifier("attr")
                );

                const element = generator.createJsxElement(
                    generator.createJsxOpeningElement(
                        generator.createIdentifier("div"),
                        [],
                        [spread]
                    ),
                    [
                        generator.createJsxSelfClosingElement(
                            generator.createIdentifier("input"),
                            [],
                            [spread]
                        )
                    ],
                    generator.createJsxClosingElement(
                        generator.createIdentifier("div")
                    )
                );
    
                assert.strictEqual(element.toString(), "<div #_auto_ref_1><input #_auto_ref_0/></div>");
                const spreadAttributes = element.getSpreadAttributes();
                assert.strictEqual(spreadAttributes.length, 2);
            });
        });

        mocha.describe("element.hasNgStyle()", function () { 
            mocha.it("returns false if there is not any style attribute", function () {
                const expression = generator.createJsxElement(
                    generator.createJsxOpeningElement(
                        generator.createIdentifier("span"),
                        undefined,
                        []
                    ),
                    [],
                    generator.createJsxClosingElement(generator.createIdentifier("span"))
                );
                
                assert.strictEqual(expression.hasNgStyle(), false);
            });

            mocha.it("returns true if there is a style attribute", function () {
                const expression = generator.createJsxElement(
                    generator.createJsxOpeningElement(
                        generator.createIdentifier("span"),
                        undefined,
                        [
                            generator.createJsxAttribute(
                                generator.createIdentifier("style"),
                                generator.createIdentifier("value")
                            )
                        ]
                    ),
                    [],
                    generator.createJsxClosingElement(generator.createIdentifier("span"))
                );
                
                assert.strictEqual(expression.hasNgStyle(), true);
            });

            mocha.it("returns true if there is a style attribute in the child element", function () {
                const expression = generator.createJsxElement(
                    generator.createJsxOpeningElement(
                        generator.createIdentifier("div"),
                        undefined,
                        []
                    ),
                    [
                        generator.createJsxElement(
                            generator.createJsxOpeningElement(
                                generator.createIdentifier("span"),
                                undefined,
                                [
                                    generator.createJsxAttribute(
                                        generator.createIdentifier("style"),
                                        generator.createIdentifier("value")
                                    )
                                ]
                            ),
                            [],
                            generator.createJsxClosingElement(generator.createIdentifier("span"))
                        )
                    ],
                    generator.createJsxClosingElement(generator.createIdentifier("div"))
                );
                
                assert.strictEqual(expression.hasNgStyle(), true);
            });

            mocha.it("returns true if there is a style attribute in the child self-closing element", function () {
                const expression = generator.createJsxElement(
                    generator.createJsxOpeningElement(
                        generator.createIdentifier("div"),
                        undefined,
                        []
                    ),
                    [
                        generator.createJsxSelfClosingElement(
                            generator.createIdentifier("span"),
                            undefined,
                            [
                                generator.createJsxAttribute(
                                    generator.createIdentifier("style"),
                                    generator.createIdentifier("value")
                                )
                            ]
                        )
                    ],
                    generator.createJsxClosingElement(generator.createIdentifier("div"))
                );
                
                assert.strictEqual(expression.hasNgStyle(), true);
            });
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

        mocha.it("ref with component context", function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("ref"),
                generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("refName")
                )
            );

            assert.strictEqual(expression.toString({
                state: [],
                internalState: [],
                props: [],
                members: [
                    generator.createProperty(
                        [createDecorator("Ref")],
                        [],
                        generator.createIdentifier("refName"),
                        undefined,
                        undefined,
                        undefined
                    )
                ],
                componentContext: "viewModel",
                newComponentContext: ""
            }), "#refName");
        });

        mocha.it("ref with component context", function () {
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("ref"),
                generator.createAsExpression(
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("refName")
                    ),
                    "any"
                )
            );

            assert.strictEqual(expression.toString({
                state: [],
                internalState: [],
                props: [],
                members: [
                    generator.createProperty(
                        [createDecorator("Ref")],
                        [],
                        generator.createIdentifier("refName"),
                        undefined,
                        undefined,
                        undefined
                    )
                ],
                componentContext: "viewModel",
                newComponentContext: ""
            }), "#refName");
        });

        mocha.describe("slots", function () {
            mocha.it("named slot", function () {
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
                            generator.createIdentifier("name")
                        )
                    )],
                    generator.createJsxClosingElement(generator.createIdentifier("span"))
                );

                const slotProperty = generator.createProperty(
                    [createDecorator("Slot")],
                    [],
                    generator.createIdentifier("name"),
                    generator.SyntaxKind.QuestionToken,
                    undefined,
                    generator.createFalse()
                );

                assert.strictEqual(expression.toString({
                    members: [slotProperty],
                    internalState: [],
                    state: [],
                    props: [],
                    componentContext: "viewModel"
                }), `<span ><ng-content select="[name]"></ng-content></span>`);
            });

            mocha.it("named slot with empty context", function () {
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
                            generator.createIdentifier("name")
                        )
                    )],
                    generator.createJsxClosingElement(generator.createIdentifier("span"))
                );

                const slotProperty = generator.createProperty(
                    [createDecorator("Slot")],
                    [],
                    generator.createIdentifier("name"),
                    generator.SyntaxKind.QuestionToken,
                    undefined,
                    generator.createFalse()
                );

                assert.strictEqual(expression.toString({
                    members: [slotProperty],
                    internalState: [],
                    state: [],
                    props: [],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<span ><ng-content select="[name]"></ng-content></span>`);
            });

            mocha.it("default slot", function () {
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
                            generator.createIdentifier("default")
                        )
                    )],
                    generator.createJsxClosingElement(generator.createIdentifier("span"))
                );

                const slotProperty = generator.createProperty(
                    [createDecorator("Slot")],
                    [],
                    generator.createIdentifier("default"),
                    generator.SyntaxKind.QuestionToken,
                    undefined,
                    generator.createFalse()
                );

                assert.strictEqual(expression.toString({
                    members: [slotProperty],
                    internalState: [],
                    state: [],
                    props: []
                }), `<span ><ng-content></ng-content></span>`);
            });

            mocha.describe("Import widget.", function () {
                this.beforeEach(function () {
                    generator.setContext({
                        dirname: __dirname
                    });
                    generator.createImportDeclaration(
                        [],
                        [],
                        generator.createImportClause(
                            generator.createIdentifier("Widget"),
                            undefined
                        ),
                        generator.createStringLiteral("./test-cases/declarations/empty-component")
                    );
                });

                this.afterEach(function () {
                    generator.setContext(null);
                });

                mocha.it("<Widget></Widget> -> <dx-widget></dx-widget>", function () {
                    const element = generator.createJsxElement(
                        generator.createJsxOpeningElement(generator.createIdentifier("Widget")),
                        [],
                        generator.createJsxClosingElement(generator.createIdentifier("Widget"))
                    );

                    assert.strictEqual(element.toString(), "<dx-widget ></dx-widget>");
                });

                mocha.it("<Widget/> -> <dx-widget></dx-widget>", function () {
                    const element = generator.createJsxSelfClosingElement(
                        generator.createIdentifier("Widget"),
                        []
                    );

                    assert.strictEqual(element.toString(), "<dx-widget ></dx-widget>");
                });

                mocha.it("import component statement should have import module", function () {
                    const expression = generator.createImportDeclaration(
                        [],
                        [],
                        generator.createImportClause(
                            generator.createIdentifier("Component"),
                            undefined
                        ),
                        generator.createStringLiteral("./test-cases/declarations/empty-component")
                    );
        
                    assert.strictEqual(expression.toString(), `import Component,{DxWidgetModule} from "./test-cases/declarations/empty-component"`);
                });

                mocha.it("Event attribute should be wrapped in paren", function () {
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
                            generator.createIdentifier("event"),
                            undefined,
                            undefined,
                            undefined
                        )]
                    );

                    const element = generator.createJsxSelfClosingElement(
                        generator.createIdentifier("Widget"),
                        [],
                        [
                            generator.createJsxAttribute(
                                generator.createIdentifier("event"),
                                generator.createIdentifier("value")
                            )
                        ]
                    );

                    assert.strictEqual(element.toString({
                        state: [],
                        props: [],
                        members: [],
                        internalState: [],
                    }), `<dx-widget (event)="value($event)"></dx-widget>`);        
                });

                mocha.it("className should not be renamed to class", function () {
                    generator.createClassDeclaration(
                        [createComponentDecorator({})],
                        [],
                        generator.createIdentifier("Widget"),
                        [],
                        [],
                        [
                        generator.createProperty(
                            [createDecorator("OneWay")],
                            [],
                            generator.createIdentifier("className"),
                            undefined,
                            undefined,
                            undefined
                        )]
                    );

                    const element = generator.createJsxSelfClosingElement(
                        generator.createIdentifier("Widget"),
                        [],
                        [
                            generator.createJsxAttribute(
                                generator.createIdentifier("className"),
                                generator.createIdentifier("value")
                            )
                        ]
                    );

                    assert.strictEqual(element.toString({
                        state: [],
                        props: [],
                        members: [],
                        internalState: [],
                    }), `<dx-widget [className]="value"></dx-widget>`);        
                });

                mocha.it("className should be renamed to class in children", function () {
                    generator.createClassDeclaration(
                        [createComponentDecorator({})],
                        [],
                        generator.createIdentifier("Widget"),
                        [],
                        [],
                        [
                        generator.createProperty(
                            [createDecorator("OneWay")],
                            [],
                            generator.createIdentifier("className"),
                            undefined,
                            undefined,
                            undefined
                        )]
                    );

                    const element = generator.createJsxElement(
                        generator.createJsxOpeningElement(
                            generator.createIdentifier("Widget"),
                            [],
                            [
                                generator.createJsxAttribute(
                                    generator.createIdentifier("className"),
                                    generator.createIdentifier("value")
                                )
                            ]
                        ),
                        [generator.createJsxElement(
                            generator.createJsxOpeningElement(
                                generator.createIdentifier("div"),
                                [],
                                [
                                    generator.createJsxAttribute(
                                        generator.createIdentifier("className"),
                                        generator.createStringLiteral("class-name")
                                    )
                                ]
                            ),
                            [],
                            generator.createJsxClosingElement(
                                generator.createIdentifier("div")
                            )
                        )],
                        generator.createJsxClosingElement(
                            generator.createIdentifier("Widget")
                        )
                    );

                    assert.strictEqual(element.toString({
                        state: [],
                        props: [],
                        members: [],
                        internalState: [],
                    }), `<dx-widget [className]="value"><div class="class-name"></div></dx-widget>`);        
                });

            });

        });

        mocha.describe("template", function () {
            mocha.it("<template/> -> <ng-container>", function () {
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
                    internalState: [],
                    state: [],
                    props: [],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<ng-container *ngTemplateOutlet="template"></ng-container>`);
            });

            mocha.it("template attributes -> template context", function () {
                const expression = generator.createJsxSelfClosingElement(
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("template")
                    ),
                    [],
                    [
                        generator.createJsxAttribute(
                            generator.createIdentifier("a1"),
                            generator.createStringLiteral("str")
                        ),
                        generator.createJsxAttribute(
                            generator.createIdentifier("a2"),
                            generator.createNumericLiteral("10")
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
                    internalState: [],
                    state: [],
                    props: [],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), `<ng-container *ngTemplateOutlet="template; context:{a1: \'str\',a2: 10}"></ng-container>`);
            });

            mocha.it("render template with condition *ngIf", function () {
                const expression = generator.createJsxSelfClosingElement(
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("template")
                    ),
                    [],
                    [
                        generator.createJsxAttribute(
                            generator.createIdentifier("a1"),
                            generator.createStringLiteral("str")
                        ),
                        generator.createJsxAttribute(
                            generator.createIdentifier("a2"),
                            generator.createNumericLiteral("10")
                        )
                    ]
                );

                expression.addAttribute(new AngularDirective(new Identifier("*ngIf"), generator.createIdentifier("condition")))

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
                    internalState: [],
                    state: [],
                    props: [],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }).replace(/(\s|\s)/gi, ""), `<ng-container *ngIf="condition">
                        <ng-container *ngTemplateOutlet="template; context:{a1: 'str',a2: 10}"></ng-container>
                    </ng-container>`.replace(/(\s|\s)/gi, ""));
            });
        });

        mocha.it(".map((item)=><div>) -> *ngFor", function () { 
            const expression = generator.createJsxExpression(
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
                    [generator.createArrowFunction(
                        undefined,
                        undefined,
                        [generator.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            generator.createIdentifier("items"),
                            undefined,
                            undefined,
                            undefined
                        )],
                        undefined,
                        generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
                        generator.createJsxElement(
                            generator.createJsxOpeningElement(
                                generator.createIdentifier("div"),
                                undefined,
                                generator.createJsxAttributes([])
                            ),
                            [],
                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                        )
                    )]
                )
            );

            assert.strictEqual(expression.toString(), `<ng-container *ngFor="let items of viewModel.items"><div ></div></ng-container>`);
        });
        
        mocha.it(".map((item, index)=><div>) -> *ngFor", function () { 
            const expression = generator.createJsxExpression(
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
                    [generator.createArrowFunction(
                        undefined,
                        undefined,
                        [generator.createParameter(
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
                        )],
                        undefined,
                        generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
                        generator.createJsxElement(
                            generator.createJsxOpeningElement(
                                generator.createIdentifier("div"),
                                undefined,
                                generator.createJsxAttributes([])
                            ),
                            [],
                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                        )
                    )]
                )
            );

            assert.strictEqual(expression.toString(), `<ng-container *ngFor="let items of viewModel.items;index as i"><div ></div></ng-container>`);
        });

        mocha.it("key attribute should be ignored", function () { 
            const expression = generator.createJsxAttribute(
                generator.createIdentifier("key"),
                generator.createPropertyAccess(
                    generator.createIdentifier("item"),
                    generator.createIdentifier("id")
                )
            );

            assert.strictEqual(expression.toString(), "");
        });

        mocha.it("map with key attribute should generate trackBy function", function () { 
            const expression = generator.createJsxExpression(
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
                    [generator.createArrowFunction(
                        undefined,
                        undefined,
                        [generator.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            generator.createIdentifier("item"),
                            undefined,
                            undefined,
                            undefined
                        )],
                        undefined,
                        generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
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
                                        ))
                                ])
                            ),
                            [],
                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                        )
                    )]
                )
            );

            assert.strictEqual(expression.toString(), `<ng-container *ngFor="let item of viewModel.items;trackBy: trackBy0"><div ></div></ng-container>`);
            const trackByAttrs = expression.trackBy();
            assert.strictEqual(trackByAttrs.length, 1);
            assert.strictEqual(getResult(trackByAttrs[0].getTrackBydeclaration()), getResult(`trackBy0(_index: number, item: any){
                return item.id
            }`));
        });

        mocha.it("map inside an other map", function () { 
            const insideExpression = generator.createCall(
                generator.createPropertyAccess(
                    generator.createIdentifier("item"),
                    generator.createIdentifier("map")
                ),
                undefined,
                [generator.createArrowFunction(
                    undefined,
                    undefined,
                    [generator.createParameter(
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
                    )],
                    undefined,
                    generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
                    generator.createJsxElement(
                        generator.createJsxOpeningElement(
                            generator.createIdentifier("div"),
                            undefined,
                            generator.createJsxAttributes([
                                generator.createJsxAttribute(
                                    generator.createIdentifier("key"),
                                    generator.createIdentifier("i")
                                )
                            ])
                        ),
                        [],
                        generator.createJsxClosingElement(generator.createIdentifier("div"))
                    )
                )]
            );

            const expression = generator.createJsxExpression(
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
                    [generator.createArrowFunction(
                        undefined,
                        undefined,
                        [generator.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            generator.createIdentifier("item"),
                            undefined,
                            undefined,
                            undefined
                        )],
                        undefined,
                        generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
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
                                        ))
                                ])
                            ),
                            [
                                generator.createJsxExpression(
                                    undefined,
                                    insideExpression
                                )
                            ],
                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                        )
                    )]
                )
            );

            assert.strictEqual(expression.toString(), `<ng-container *ngFor="let item of viewModel.items;trackBy: trackBy1"><div ><ng-container *ngFor="let _ of item;index as i;trackBy: trackBy0"><div ></div></ng-container></div></ng-container>`);
            const trackByAttrs = expression.trackBy();
            assert.strictEqual(trackByAttrs.length, 2);
            assert.strictEqual(getResult(trackByAttrs[0].getTrackBydeclaration()), getResult(`trackBy1(_index: number, item: any){
                return item.id;
            }`), "external map trackBy function");

            assert.strictEqual(getResult(trackByAttrs[1].getTrackBydeclaration()), getResult(`trackBy0(i: number, _: any){
                return i;
            }`), "internal map trackBy function");
        });
    
        mocha.describe("View Function", function () {
            this.beforeEach(function () {
                generator.setContext({});

                this.block = generator.createBlock([
                    generator.createReturn(
                        generator.createJsxSelfClosingElement(
                            generator.createIdentifier("div")
                        )
                    )
                ], false);
            });
            this.afterEach(function () {
                generator.setContext(null);
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
                assert.strictEqual(expression.getTemplate(), "<div ></div>");
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

                assert.strictEqual(expression.getTemplate({
                    internalState: [],
                    state: [],
                    props: [],
                    members: [],
                    newComponentContext: "_viewModel"
                }), `<span [attr]="_viewModel.value">{{_viewModel.text}}</span>`);
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

            mocha.it("Arrow function JSX can be converted to template", function () {
                const expression = generator.createArrowFunction(
                    [],
                    [],
                    [],
                    undefined,
                    generator.SyntaxKind.GreaterThanToken,
                    generator.createJsxSelfClosingElement(
                        generator.createIdentifier("div")
                    )
                );

                assert.strictEqual(expression.isJsx(), true);
                assert.strictEqual(expression.getTemplate(), "<div ></div>");
                assert.strictEqual(expression.toString(), "");
            });

            mocha.it("template generation if jsx is wrapped into paren", function () {
                const expression = generator.createArrowFunction(
                    [],
                    [],
                    [],
                    undefined,
                    generator.SyntaxKind.GreaterThanToken,
                    generator.createParen(
                        generator.createJsxSelfClosingElement(
                            generator.createIdentifier("div")
                        )
                    )
                );

                assert.strictEqual(expression.isJsx(), true);
                assert.strictEqual(expression.getTemplate(), "<div ></div>");
                assert.strictEqual(expression.toString(), "");
            });

            mocha.it("Arrow function without JSX behaves as usual function", function () {
                const expression = generator.createArrowFunction(
                    [],
                    [],
                    [],
                    undefined,
                    generator.SyntaxKind.EqualsGreaterThanToken,
                    generator.createTrue()
                );

                assert.strictEqual(expression.isJsx(), false);
                assert.strictEqual(expression.getTemplate(), "");
                assert.strictEqual(getResult(expression.toString()), getResult("()=>true"));
            });

            mocha.it("Add arrow function in context", function () {
                const functionDeclaration = generator.createArrowFunction(
                    [],
                    [],
                    [],
                    undefined,
                    generator.SyntaxKind.EqualsGreaterThanToken,
                    this.block
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

                assert.strictEqual(generator.getContext().viewFunctions!["viewFunction"], functionDeclaration);
                assert.strictEqual(expression.toString(), "");
            });

            mocha.it("Declaration list with jsx and noJsx - skip only jsx variables", function () {
                const functionDeclaration = generator.createArrowFunction(
                    [],
                    [],
                    [],
                    undefined,
                    generator.SyntaxKind.EqualsGreaterThanToken,
                    this.block
                );

                const expression = generator.createVariableDeclarationList(
                    [generator.createVariableDeclaration(
                        generator.createIdentifier("viewFunction"),
                        undefined,
                        functionDeclaration
                    ),
                    generator.createVariableDeclaration(
                        generator.createIdentifier("a"),
                        undefined,
                        generator.createNumericLiteral("10")
                    )],
                    generator.SyntaxKind.ConstKeyword
                );

                assert.strictEqual(expression.toString(), "const a=10");
            });

            mocha.it("Can use variables in view function", function () {
                const block = generator.createBlock([
                    generator.createVariableStatement(
                        [],
                        generator.createVariableDeclarationList(
                            [generator.createVariableDeclaration(
                                generator.createIdentifier("v"),
                                undefined,
                                generator.createNumericLiteral("10")
                            )],
                            generator.SyntaxKind.ConstKeyword
                        )
                    ),
                    generator.createReturn(
                        generator.createJsxSelfClosingElement(
                            generator.createIdentifier("div"),
                            undefined,
                            [
                                generator.createJsxAttribute(
                                    generator.createIdentifier("v"),
                                    generator.createIdentifier("v")
                                )
                            ]
                        )
                    )
                ], false);

                const expression = generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("View"),
                    [],
                    [],
                    "",
                    block
                );

                assert.strictEqual(expression.toString(), "");
                assert.strictEqual(expression.getTemplate({
                    internalState: [],
                    state: [],
                    props: [],
                    members: []
                }), `<div [v]="10"></div>`);
            });

            mocha.it("Can decomposite component", function () {
                const block = generator.createBlock([
                    generator.createReturn(
                        generator.createJsxSelfClosingElement(
                            generator.createIdentifier("div"),
                            undefined,
                            [
                                generator.createJsxAttribute(
                                    generator.createIdentifier("v"),
                                    generator.createIdentifier("height")
                                )
                            ]
                        )
                    )
                ], false);

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
                            generator.createObjectBindingPattern([
                                generator.createBindingElement(
                                    undefined,
                                    undefined,
                                    generator.createIdentifier("height"),
                                    undefined
                                )
                            ]),
                            undefined,
                            undefined,
                            undefined
                       )
                    ],
                    "",
                    block
                );

                const member = generator.createGetAccessor(
                    [],
                    [],
                    generator.createIdentifier("height"),
                    [],
                    undefined,
                    undefined
                );

                member.prefix = "__";

                assert.strictEqual(expression.toString(), "");
                assert.strictEqual(expression.getTemplate({
                    internalState: [],
                    state: [],
                    props: [],
                    members: [member]
                }), `<div [v]="__height"></div>`);
            });

            mocha.it("Can use jsx variables in view function", function () {
                const block = generator.createBlock([
                    generator.createVariableStatement(
                        [],
                        generator.createVariableDeclarationList(
                            [generator.createVariableDeclaration(
                                generator.createIdentifier("v"),
                                undefined,
                                generator.createJsxSelfClosingElement(
                                    generator.createIdentifier("span")
                                )
                            )],
                            generator.SyntaxKind.ConstKeyword
                        )
                    ),
                    generator.createReturn(
                        generator.createJsxElement(
                            generator.createJsxOpeningElement(
                                generator.createIdentifier("div"),
                                [],
                                []),
                            [generator.createJsxExpression(
                                undefined,
                                generator.createIdentifier("v")
                            )],
                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                        )
                    )
                ], false);
    
                const expression = generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("View"),
                    [],
                    [],
                    "",
                    block
                );
    
                assert.strictEqual(expression.toString(), "");
                assert.strictEqual(expression.getTemplate({
                    internalState: [],
                    state: [],
                    props: [],
                    members: []
                }), `<div ><span ></span></div>`);
            });
    
            mocha.it("Can use jsx variable twice", function () {
                const block = generator.createBlock([
                    generator.createVariableStatement(
                        [],
                        generator.createVariableDeclarationList(
                            [generator.createVariableDeclaration(
                                generator.createIdentifier("v"),
                                undefined,
                                generator.createJsxSelfClosingElement(
                                    generator.createIdentifier("span")
                                )
                            )],
                            generator.SyntaxKind.ConstKeyword
                        )
                    ),
                    generator.createReturn(
                        generator.createJsxElement(
                            generator.createJsxOpeningElement(
                                generator.createIdentifier("div"),
                                [],
                                []),
                            [generator.createJsxExpression(
                                undefined,
                                generator.createBinary(
                                    generator.createIdentifier("c1"),
                                    generator.SyntaxKind.AmpersandAmpersandToken,
                                    generator.createIdentifier("v")
                                ),
                            ),
                            generator.createJsxExpression(
                                undefined,
                                generator.createBinary(
                                    generator.createIdentifier("c2"),
                                    generator.SyntaxKind.AmpersandAmpersandToken,
                                    generator.createIdentifier("v")
                                ),
                            )],
                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                        )
                    )
                ], false);
    
                const expression = generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("View"),
                    [],
                    [],
                    "",
                    block
                );
    
                assert.strictEqual(expression.toString(), "");
                assert.strictEqual((expression.getTemplate({
                    internalState: [],
                    state: [],
                    props: [],
                    members: []
                }) as string).replace(/(\s|\s)/gi, ""), (`<div >
                        <span *ngIf="c1"></span>
                        <span *ngIf="c2"></span>
                    </div>`).replace(/(\s|\s)/gi, ""));
            });
    
            mocha.it("Can use jsx variable with condition", function () {
                const block = generator.createBlock([
                    generator.createVariableStatement(
                        [],
                        generator.createVariableDeclarationList(
                            [generator.createVariableDeclaration(
                                generator.createIdentifier("v"),
                                undefined,
                                generator.createBinary(
                                    generator.createIdentifier("c1"),
                                    generator.SyntaxKind.AmpersandAmpersandToken,
                                    generator.createJsxSelfClosingElement(
                                        generator.createIdentifier("span")
                                    )
                                )
                            )],
                            generator.SyntaxKind.ConstKeyword
                        )
                    ),
                    generator.createReturn(
                        generator.createJsxElement(
                            generator.createJsxOpeningElement(
                                generator.createIdentifier("div"),
                                [],
                                []),
                            [generator.createJsxExpression(
                                undefined,
                                generator.createBinary(
                                    generator.createIdentifier("c2"),
                                    generator.SyntaxKind.AmpersandAmpersandToken,
                                    generator.createIdentifier("v")
                                ),
                            )],
                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                        )
                    )
                ], false);
    
                const expression = generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("View"),
                    [],
                    [],
                    "",
                    block
                );
    
                assert.strictEqual(expression.toString(), "");
                assert.strictEqual((expression.getTemplate({
                    internalState: [],
                    state: [],
                    props: [],
                    members: []
                }) as string).replace(/(\s|\s)/gi, ""), (`<div >
                        <span *ngIf="(c1)&&c2"></span>
                    </div>`).replace(/(\s|\s)/gi, ""));
            });

            mocha.it("Can store map in variable", function () {
                const block = generator.createBlock([
                    generator.createVariableStatement(
                        [],
                        generator.createVariableDeclarationList(
                            [generator.createVariableDeclaration(
                                generator.createIdentifier("v"),
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
                                    [generator.createArrowFunction(
                                        undefined,
                                        undefined,
                                        [generator.createParameter(
                                            undefined,
                                            undefined,
                                            undefined,
                                            generator.createIdentifier("items"),
                                            undefined,
                                            undefined,
                                            undefined
                                        )],
                                        undefined,
                                        generator.createToken(generator.SyntaxKind.EqualsGreaterThanToken),
                                        generator.createJsxElement(
                                            generator.createJsxOpeningElement(
                                                generator.createIdentifier("div"),
                                                undefined,
                                                generator.createJsxAttributes([])
                                            ),
                                            [],
                                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                                        )
                                    )]
                                )
                            )],
                            generator.SyntaxKind.ConstKeyword
                        )
                    ),
                    generator.createReturn(
                        generator.createJsxElement(
                            generator.createJsxOpeningElement(
                                generator.createIdentifier("div"),
                                [],
                                []),
                            [generator.createJsxExpression(
                                undefined,
                                generator.createIdentifier("v"),
                            )],
                            generator.createJsxClosingElement(generator.createIdentifier("div"))
                        )
                    )
                ], false);
    
                const expression = generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("View"),
                    [],
                    [],
                    "",
                    block
                );
    
                assert.strictEqual(expression.toString(), "");
                assert.strictEqual((expression.getTemplate({
                    internalState: [],
                    state: [],
                    props: [],
                    members: []
                }) as string)
                    .replace(/(\s|\s)/gi, ""), (`<div>
                        <ng-container *ngFor="let items of viewModel.items">
                            <div ></div>
                        </ng-container>
                    </div>`).replace(/(\s|\s)/gi, ""));
            });

        });
    });


    mocha.describe("Decorators", function () {
        mocha.it("OneWay -> Input", function () {
            const decorator = createDecorator("OneWay");

            assert.strictEqual(decorator.name, "OneWay");
            assert.strictEqual(decorator.toString(), "@Input()");
        });

        mocha.it("TwoWay -> Output", function () {
            const decorator = createDecorator("TwoWay");

            assert.strictEqual(decorator.toString(), "@Input()");
        });

        mocha.it("Event -> Output", function () {
            const decorator = createDecorator("Event");

            assert.strictEqual(decorator.toString(), "@Output()");
        });

        mocha.it("Template -> Input", function () {
            const decorator = createDecorator("Template");

            assert.strictEqual(decorator.toString(), "@Input()");
        });

        mocha.it("Effect -> ''", function () {
            const decorator = createDecorator("Effect");

            assert.strictEqual(decorator.toString(), "");
        });

        mocha.it("Ref -> ''", function () {
            const decorator = createDecorator("Ref");

            assert.strictEqual(decorator.toString(), "");
        });

        mocha.it("InternalState -> ''", function () {
            const decorator = createDecorator("InternalState");

            assert.strictEqual(decorator.toString(), "");
        });

        mocha.describe("Component", function () {
            this.beforeEach(function () {
                generator.setContext({});
            });
            this.afterEach(function () {
                generator.setContext(null);
            });
            mocha.it("Replace viewFunction with template", function () {
                generator.createFunctionDeclaration(
                    [],
                    [],
                    "",
                    generator.createIdentifier("viewFunction"),
                    [],
                    [],
                    "",
                    generator.createBlock([
                        generator.createReturn(
                            generator.createJsxSelfClosingElement(
                                generator.createIdentifier("div")
                            )
                        )
                    ], false)
                );

                const decorator = generator.createDecorator(
                    generator.createCall(
                        generator.createIdentifier("Component"), [],
                        [generator.createObjectLiteral([
                            generator.createPropertyAssignment(
                                generator.createIdentifier("view"),
                                generator.createIdentifier("viewFunction")
                            )
                        ], false)])
                );

                assert.strictEqual(decorator.toString(), `@Component({template:\`<div ></div>\`})`);
            });

            mocha.it("Remove viewModel", function () {
                const decorator = generator.createDecorator(
                    generator.createCall(
                        generator.createIdentifier("Component"), [],
                        [generator.createObjectLiteral([
                            generator.createPropertyAssignment(
                                generator.createIdentifier("viewModel"),
                                generator.createIdentifier("viewModel")
                            )
                        ], false)])
                );

                assert.strictEqual(decorator.toString(), `@Component({})`);
            });
        });
    });

    mocha.describe("ComponentBindings", function () {
        this.beforeEach(function () { 
            generator.setContext({});
        })
        this.afterEach(function () { 
            generator.setContext(null);
        });
        mocha.it("Generate componentBindings as a class", function () {
            const bindings = generator.createClassDeclaration(
                [createDecorator("ComponentBindings")],
                ["export", "default"],
                generator.createIdentifier("ComponentInput"),
                [],
                [],
                [
                    generator.createProperty(
                        [createDecorator("OneWay")],
                        [],
                        generator.createIdentifier("p1"),
                        generator.SyntaxKind.QuestionToken,
                        "number",
                        generator.createNumericLiteral("10")
                    ),
                    generator.createProperty(
                        [createDecorator("OneWay")],
                        [],
                        generator.createIdentifier("p2"),
                        generator.SyntaxKind.QuestionToken,
                        "number",
                        generator.createNumericLiteral("11")
                    )
                ]
            );

            assert.strictEqual(getResult(bindings.toString()), getResult(`
                export default class ComponentInput {
                    @Input() p1?:number = 10;
                    @Input() p2?:number = 11;
                }`)
            );
        });

        mocha.it("Do not include inherited props", function () {
            generator.createClassDeclaration(
                [createDecorator("ComponentBindings")],
                ["export", "default"],
                generator.createIdentifier("Base"),
                [],
                [],
                [
                    generator.createProperty(
                        [createDecorator("OneWay")],
                        [],
                        generator.createIdentifier("p1"),
                        generator.SyntaxKind.QuestionToken,
                        "number",
                        generator.createNumericLiteral("10")
                    )
                ]
            );

            const heritageClause = generator.createHeritageClause(
                generator.SyntaxKind.ExtendsKeyword,
                [generator.createExpressionWithTypeArguments(
                    undefined,
                    generator.createIdentifier("Base")
                )]
            );

            const child = generator.createClassDeclaration(
                [createDecorator("ComponentBindings")],
                ["export", "default"],
                generator.createIdentifier("Child"),
                [],
                [heritageClause],
                []
            );

            assert.strictEqual(getResult(child.toString()), getResult("export default class Child extends Base {}"));
        });

        mocha.it("Ref Prop generates ViewChild", function () {
            const property = generator.createProperty(
                [createDecorator("Ref")],
                [],
                generator.createIdentifier("host"),
                generator.SyntaxKind.QuestionToken,
                "HTMLDivElement",
                generator.createArrowFunction([], [], [], "", generator.SyntaxKind.EqualsGreaterThanToken, generator.createNull())
            );

            assert.strictEqual(property.toString(), `@ViewChild("host", {static: false}) host:ElementRef<HTMLDivElement>`);
        });

        mocha.it("Event Prop generates Event EventEmitter", function () {
            const property = generator.createProperty(
                [createDecorator("Event")],
                [],
                generator.createIdentifier("onClick"),
                generator.SyntaxKind.QuestionToken,
                undefined,
                generator.createArrowFunction([], [], [], "", generator.SyntaxKind.EqualsGreaterThanToken, generator.createNull())
            );

            assert.strictEqual(property.toString(), "@Output() onClick?:EventEmitter<any> = new EventEmitter()");
        });

        mocha.it.skip("Event Prop with type", function () {
            const property = generator.createProperty(
                [createDecorator("Event")],
                [],
                generator.createIdentifier("onClick"),
                generator.SyntaxKind.QuestionToken,
                generator.createFunctionTypeNode(
                    undefined,
                    [generator.createParameter(
                        [],
                        [],
                        "",
                        generator.createIdentifier("a"),
                        "",
                        "number",
                        generator.createNumericLiteral("1")
                    )],
                    "void"
                ),
                generator.createArrowFunction([], [], [], "", generator.SyntaxKind.EqualsGreaterThanToken, generator.createNull())
            );

            assert.strictEqual(property.toString(), "@Input() onClick:EventEmitter<number> = new EventEmitter()");
        });  
        
        mocha.it("Generate change for TwoWay prop with type", function () { 
            const property = generator.createProperty(
                [createDecorator("TwoWay")],
                [],
                generator.createIdentifier("pressed"),
                generator.SyntaxKind.QuestionToken,
                "boolean",
                generator.createFalse()
            );

            assert.strictEqual(getResult(property.toString()),
                getResult(`@Input() pressed?:boolean = false
                 @Output() pressedChange?: EventEmitter<boolean> = new EventEmitter()`)
            );
        });

        mocha.it("Generate change for TwoWay prop without type", function () { 
            const property = generator.createProperty(
                [createDecorator("TwoWay")],
                [],
                generator.createIdentifier("pressed"),
                generator.SyntaxKind.QuestionToken,
                undefined,
                generator.createFalse()
            );

            assert.strictEqual(getResult(property.toString()),
                getResult(`@Input() pressed?:any = false
                 @Output() pressedChange?: EventEmitter<any> = new EventEmitter()`)
            );
        });

        mocha.it("@Slot prop should not be a member of component", function () {
            const property = generator.createProperty(
                [createDecorator("Slot")],
                [],
                generator.createIdentifier("name"),
                generator.SyntaxKind.QuestionToken,
                undefined,
                generator.createFalse()
            );

            assert.strictEqual(property.toString(), "");
        });

        mocha.it("@Template prop without type", function () {
            const property = generator.createProperty(
                [createDecorator("Template")],
                [],
                generator.createIdentifier("name"),
                generator.SyntaxKind.QuestionToken,
                undefined,
                generator.createFalse()
            );

            assert.strictEqual(property.toString(), " @Input() name?:TemplateRef<any> = false");
        });

        mocha.it("get prop with same name in get accessor", function () {
            const property = generator.createGetAccessor(
                [],
                [],
                generator.createIdentifier("name"),
                [],
                undefined,
                generator.createBlock([
                    generator.createPropertyAccess(
                        generator.createPropertyAccess(
                            generator.createThis(),
                            generator.createIdentifier("props")
                        ),
                        generator.createIdentifier("name")
                    )
                ], false)
            );
            property.prefix = "_";

            const prop = new Property(
                [createDecorator("OneWay")],
                [],
                generator.createIdentifier("name"),
                undefined,
                undefined,
                undefined,
                true
            );

            assert.strictEqual(getResult(property.toString({
                internalState: [],
                state: [],
                props: [],
                members: [property, prop]
            })), getResult("get _name(){this.name}"));
        });

    });

    mocha.describe("Angular Component", function () { 
        
        mocha.it("Calculate Selector", function () {
            const decorator = createComponentDecorator({})
            const component = generator.createComponent(
                decorator,
                [],
                generator.createIdentifier("BaseWidget"),
                [],
                [],
                []
            );

            assert.strictEqual(component.selector, "dx-base-widget");
            assert.strictEqual(decorator.toString(), `@Component({selector:"dx-base-widget"})`);
        });

        mocha.describe("Imports", function () {
            
            mocha.it("Empty component", function () { 
                const component = createComponent();
                assert.strictEqual(getResult(component.compileImports()), getResult(`import { Component, NgModule } from "@angular/core"; import {CommonModule} from "@angular/common"`));
            });

            mocha.it("Has OneWay property - Input", function () {
                const component = createComponent(
                    [
                        generator.createProperty(
                            [createDecorator("OneWay")],
                            [],
                            generator.createIdentifier("p")
                        )
                    ]
                );
                assert.strictEqual(getResult(component.compileImports()), getResult(`import { Component, NgModule, Input } from "@angular/core"; import {CommonModule} from "@angular/common"`));
            });

            mocha.it("Has Template property - Input, TemplateRef", function () {
                const component = createComponent(
                    [
                        generator.createProperty(
                            [createDecorator("Template")],
                            [],
                            generator.createIdentifier("p")
                        )
                    ]
                );
                assert.strictEqual(getResult(component.compileImports()), getResult(`import { Component, NgModule, Input, TemplateRef } from "@angular/core"; import {CommonModule} from "@angular/common"`));
            });

            mocha.it("Has TwoWay property - Input, Output, EventEmitter", function () {
                const component = createComponent(
                    [
                        generator.createProperty(
                            [createDecorator("TwoWay")],
                            [],
                            generator.createIdentifier("p")
                        )
                    ]
                );
                assert.strictEqual(getResult(component.compileImports()), getResult(`import { Component, NgModule, Input, Output, EventEmitter } from "@angular/core"; import {CommonModule} from "@angular/common"`));
            });

            mocha.it("Import should not have duplicates", function () {
                const component = createComponent(
                    [
                        generator.createProperty(
                            [createDecorator("OneWay")],
                            [],
                            generator.createIdentifier("p")
                        ),
                        generator.createProperty(
                            [createDecorator("TwoWay")],
                            [],
                            generator.createIdentifier("p")
                        )
                    ]
                );
                assert.strictEqual(getResult(component.compileImports()), getResult(`import { Component, NgModule, Input, Output, EventEmitter } from "@angular/core"; import {CommonModule} from "@angular/common"`));
            });

            mocha.it("Has Event property - Output, EventEmitter", function () {
                const component = createComponent(
                    [
                        generator.createProperty(
                            [createDecorator("Event")],
                            [],
                            generator.createIdentifier("p")
                        )
                    ]
                );
                assert.strictEqual(getResult(component.compileImports()), getResult(`import { Component, NgModule, Output, EventEmitter } from "@angular/core"; import {CommonModule} from "@angular/common"`));
            });

            mocha.it("Has Ref property - ViewChild, ElementRef", function () {
                const component = createComponent(
                    [
                        generator.createProperty(
                            [createDecorator("Ref")],
                            [],
                            generator.createIdentifier("p")
                        )
                    ]
                );
                assert.strictEqual(getResult(component.compileImports()), getResult(`import { Component, NgModule, ViewChild, ElementRef } from "@angular/core"; import {CommonModule} from "@angular/common"`));
            });
        });

        mocha.it("generate component skeleton", function () { 
            const component = generator.createComponent(
                createComponentDecorator({}),
                [generator.SyntaxKind.ExportKeyword, generator.SyntaxKind.DefaultKeyword],
                generator.createIdentifier("BaseWidget"),
                [],
                [],
                []
            );

            assert.strictEqual(getResult(component.toString()), getResult(`
                ${component.compileImports()}
                ${component.decorator}
                export default class BaseWidget {

                }

                @NgModule({
                    declarations: [BaseWidget],
                    imports: [
                        CommonModule
                    ],
                    exports: [BaseWidget]
                })
                export class DxBaseWidgetModule {}
            `));
        });

        mocha.it("generate component skeleton with extends of Component Bindings", function () { 
            generator.createClassDeclaration(
                [generator.createDecorator(
                    generator.createCall(generator.createIdentifier("ComponentBindings"), [], [])
                )],
                [],
                generator.createIdentifier("Input"),
                [],
                [],
                [
                    generator.createProperty(
                        [],
                        [],
                        generator.createIdentifier("p"),
                        "",
                        "",
                        generator.createNumericLiteral("10")
                    )
                ]
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

            const component = generator.createComponent(
                createComponentDecorator({}),
                [generator.SyntaxKind.ExportKeyword, generator.SyntaxKind.DefaultKeyword],
                generator.createIdentifier("BaseWidget"),
                [],
                [heritageClause],
                []
            );

            assert.strictEqual(getResult(component.toString()), getResult(`
                ${component.compileImports()}
                ${component.decorator}
                export default class BaseWidget extends Input {

                }

                @NgModule({
                    declarations: [BaseWidget],
                    imports: [
                        CommonModule
                    ],
                    exports: [BaseWidget]
                })
                export class DxBaseWidgetModule {}
            `));
        });

        mocha.describe("Default options", function () {
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

            mocha.it("Add import convertRulesToOptions, Rule", function () {
                const component = createComponent([]);
                assert.ok(component.compileImports().indexOf(`import {convertRulesToOptions, Rule} from "../default_options"`) > -1);
            });

            mocha.it("Compile defaultOptions expression if defaultOptionRules expression is set", function () {
                const component = createComponent([], {
                    defaultOptionRules: generator.createIdentifier("rules")
                });
                assert.strictEqual(getResult(component.compileDefaultOptions([])), getResult(`
                    type BaseWidgetOptionRule = Rule<BaseWidget>;
                    const __defaultOptionRules:BaseWidgetOptionRule[] = rules;
                    export function defaultOptions(rule: BaseWidgetOptionRule) { 
                        __defaultOptionRules.push(rule);
                        
                    }`));
            });

        });

        mocha.describe("Members generation", function () { 
            mocha.it("Access props - this.prop", function () { 
                const property = new Property(
                    [createDecorator("OneWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("width")
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: []
                }), "this.width");
            });

            mocha.it("Access TwoWay prop - this.prop", function () { 
                const property = new Property(
                    [createDecorator("TwoWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("width")
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: []
                }), "this.width");
            });

            mocha.it("Access props - this.props.prop", function () { 
                const property = new Property(
                    [createDecorator("OneWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createPropertyAccess(
                    generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("props")
                    ),
                    generator.createIdentifier("width")
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: []
                }), "this.width");
            });

            mocha.it("Access props - viewModel.props.prop -> newViewModel.prop", function () { 
                const property = new Property(
                    [createDecorator("OneWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createPropertyAccess(
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("props")
                    ),
                    generator.createIdentifier("width")
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: [],
                    componentContext: "viewModel",
                    newComponentContext: "newViewModel"
                }), "newViewModel.width");
            });

            mocha.it("Access props - viewModel.props.prop", function () { 
                const property = new Property(
                    [createDecorator("OneWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createPropertyAccess(
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("props")
                    ),
                    generator.createIdentifier("width")
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: [],
                    componentContext: "viewModel",
                    newComponentContext: "newViewModel"
                }), "newViewModel.width");
            });

            mocha.it("Access props - viewModel.props.prop - prop", function () { 
                const property = new Property(
                    [createDecorator("OneWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined,
                    true
                );

                const expression = generator.createPropertyAccess(
                    generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("props")
                    ),
                    generator.createIdentifier("width")
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: [],
                    componentContext: "viewModel",
                    newComponentContext: ""
                }), "width");
            });

            mocha.it("Access props - this.props", function () { 
                const expression = generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("props")
                    )

                assert.strictEqual(expression.toString({
                    members: [],
                    internalState: [],
                    state: [],
                    props: []
                }), "this");
            });

            mocha.it("Access TwoWay props - this.props.prop", function () { 
                const property = new Property(
                    [createDecorator("TwoWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createPropertyAccess(
                    generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("props")
                    ),
                    generator.createIdentifier("width")
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: []
                }), "this.width");
            });

            mocha.it("Call Event", function () { 
                const property = new Property(
                    [createDecorator("Event")],
                    [],
                    generator.createIdentifier("onClick"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createCall(
                    generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("onClick")
                    ),
                    [],
                    [generator.createNumericLiteral("10")]
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: []
                }), "this.onClick!.emit(10)");
            });

            mocha.it("Set TwoWay Prop", function () { 
                const property = new Property(
                    [createDecorator("TwoWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createBinary(
                    generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("width")
                    ),
                    generator.SyntaxKind.EqualsToken,
                    generator.createNumericLiteral("10")
                );

                assert.strictEqual(getResult(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: []
                })), getResult("this.widthChange!.emit(this.width=10)"));
            });

            mocha.it("Can't set OneWay Prop", function () { 
                const property = new Property(
                    [createDecorator("OneWay")],
                    [],
                    generator.createIdentifier("width"),
                    undefined,
                    undefined,
                    undefined
                );

                const expression = generator.createBinary(
                    generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("width")
                    ),
                    generator.SyntaxKind.EqualsToken,
                    generator.createNumericLiteral("10")
                );
                let error = null;
                try {
                    expression.toString({
                        members: [property],
                        internalState: [],
                        state: [],
                        props: []
                    });
                } catch (e) { 
                    error = e;
                }
                assert.strictEqual(error, "Error: Can't assign property use TwoWay() or Internal State - this.width=10");
            });

            mocha.it("Access elementRef", function () { 
                const property = new Property(
                    [createDecorator("Ref")],
                    [],
                    generator.createIdentifier("div"),
                    undefined,
                    undefined,
                    undefined
                );

                const propertyWithExclamation = new Property(
                    [createDecorator("Ref")],
                    [],
                    generator.createIdentifier("div"),
                    "!",
                    undefined,
                    undefined
                );

                const propertyWithQuestion = new Property(
                    [createDecorator("Ref")],
                    [],
                    generator.createIdentifier("div"),
                    "?",
                    undefined,
                    undefined
                );

                const expression = generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("div")
                );

                assert.strictEqual(expression.toString({
                    members: [property],
                    internalState: [],
                    state: [],
                    props: []
                }), "this.div.nativeElement");

                assert.strictEqual(expression.toString({
                    members: [propertyWithExclamation],
                    internalState: [],
                    state: [],
                    props: []
                }), "this.div!.nativeElement");

                assert.strictEqual(expression.toString({
                    members: [propertyWithQuestion],
                    internalState: [],
                    state: [],
                    props: []
                }), "this.div?.nativeElement");
            });
        });
    });

});
