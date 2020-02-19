import mocha from "mocha";
import generator, { Property } from "../angular-generator";
import assert from "assert";

import { printSourceCodeAst as getResult } from "./helpers/common";

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
                generator.setContext({});

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

            mocha.it("Arrow function JSX can be converted to template", function () {
                const expression = generator.createArrowFunction(
                    [],
                    [],
                    [],
                    undefined,
                    generator.SyntaxKind.GreaterThanToken,
                    generator.createJsxElement(
                        generator.createJsxSelfClosingElement(
                            generator.createIdentifier("div")
                        ),
                        [],
                        ""
                    )
                );

                assert.strictEqual(expression.isJsx(), true);
                assert.strictEqual(expression.getTemplate(), "<div />");
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

        mocha.it("Event -> Input", function () {
            const decorator = createDecorator("Event");

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
                            generator.createJsxElement(
                                generator.createJsxSelfClosingElement(
                                    generator.createIdentifier("div")
                                ),
                                [],
                                ""
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

                assert.strictEqual(decorator.toString(), `@Component({template:\`<div />\`})`);
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

        mocha.it("Event Prop generates Event EventEmitter", function () {
            const property = generator.createProperty(
                [createDecorator("Ref")],
                [],
                generator.createIdentifier("host"),
                generator.SyntaxKind.QuestionToken,
                "HTMLDivElement",
                generator.createArrowFunction([], [], [], "", generator.SyntaxKind.EqualsGreaterThanToken, generator.createNull())
            );

            assert.strictEqual(property.toString(), `@ViewChild("_widgetModel.host", {static: false}) host:ElementRef<HTMLDivElement>`);
        });

        mocha.it("Ref Prop generates ViewChild", function () {
            const property = generator.createProperty(
                [createDecorator("Event")],
                [],
                generator.createIdentifier("onClick"),
                generator.SyntaxKind.QuestionToken,
                undefined,
                generator.createArrowFunction([], [], [], "", generator.SyntaxKind.EqualsGreaterThanToken, generator.createNull())
            );

            assert.strictEqual(property.toString(), "@Input() onClick:EventEmitter<any> = new EventEmitter()");
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
        
        mocha.it("Generate change for TwoWay prop", function () { 
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
                 @Output() pressedChange: EventEmitter<boolean> = new EventEmitter()`)
            );
        });

        mocha.it("Generate change for TwoWay prop", function () { 
            const property = generator.createProperty(
                [createDecorator("TwoWay")],
                [],
                generator.createIdentifier("pressed"),
                generator.SyntaxKind.QuestionToken,
                undefined,
                generator.createFalse()
            );

            assert.strictEqual(getResult(property.toString()),
                getResult(`@Input() pressed?: = false
                 @Output() pressedChange: EventEmitter<any> = new EventEmitter()`)
            );
        });
    });

    mocha.describe("Angular Component", function () { 
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
            function createComponent(properties: Property[]=[]) {
                return generator.createComponent(
                    createComponentDecorator({}),
                    [],
                    generator.createIdentifier("BaseWidget"),
                    [],
                    [],
                    properties
                );
            }

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

            mocha.it("Has Event property - EventEmitter", function () {
                const component = createComponent(
                    [
                        generator.createProperty(
                            [createDecorator("Event")],
                            [],
                            generator.createIdentifier("p")
                        )
                    ]
                );
                assert.strictEqual(getResult(component.compileImports()), getResult(`import { Component, NgModule, EventEmitter } from "@angular/core"; import {CommonModule} from "@angular/common"`));
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
                export default class DxBaseWidgetComponent {

                }

                @NgModule({
                    declarations: [DxBaseWidgetComponent],
                    imports: [
                        CommonModule
                    ],
                    exports: [DxBaseWidgetComponent]
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
                export default class DxBaseWidgetComponent extends Input {

                }

                @NgModule({
                    declarations: [DxBaseWidgetComponent],
                    imports: [
                        CommonModule
                    ],
                    exports: [DxBaseWidgetComponent]
                })
                export class DxBaseWidgetModule {}
            `));
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
                }), "this.onClick.emit(10)");
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
                })), getResult("this.widthChange.emit(this.width=10)"));
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
        });
    });

});
