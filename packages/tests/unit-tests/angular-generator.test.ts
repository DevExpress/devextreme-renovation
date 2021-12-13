import assert from 'assert';
import path from 'path';

import generator, {
  AngularComponent,
  AngularDirective,
  JsxExpression,
  SetAccessor,
  toStringOptions
} from '@devextreme-generator/angular';
import {
  Block,
  Decorators,
  Expression,
  GeneratorContext,
  Identifier,
  Parameter,
  TypeExpression
} from '@devextreme-generator/core';
import { ComponentParameters } from '@devextreme-generator/declarations';
import { assertCode, printSourceCodeAst as getResult, removeSpaces } from './helpers/common';
import factory from './helpers/create-component';
import mocha from './helpers/mocha';
import { reset } from 'angular-generator/src/expressions/utils/uniq_name_generator';

const { createComponent, createComponentDecorator, createDecorator } = factory(
  generator
);

mocha.describe("Angular generator", function () {
  this.beforeEach(function () {
    reset();
  });

  mocha.describe("JSX -> AngularTemplate", function () {
    this.beforeEach(function () {
      generator.setContext({
        dirname: __dirname,
      });
    });

    this.afterEach(function () {
      generator.setContext(null);
    });

    mocha.it("Empty JsxOpeningElement", function () {
      assert.strictEqual(
        generator
          .createJsxOpeningElement(
            generator.createIdentifier("div"),
            undefined,
            undefined
          )
          .toString(),
        "<div >"
      );
    });

    mocha.it(
      "Empty JsxSelfClosingElement should have opening and closing tags",
      function () {
        assert.strictEqual(
          generator
            .createJsxSelfClosingElement(
              generator.createIdentifier("div"),
              undefined,
              undefined
            )
            .toString(),
          "<div ></div>"
        );
      }
    );

    mocha.it("collision-tag-name-and-property", function () {
      const openingElement = generator.createJsxOpeningElement(
        generator.createIdentifier("text"),
        undefined,
        undefined
      );
      const options = {
        members: [],
        variables: {},
      };
      assert.strictEqual(openingElement.toString(options), "<text >");
    });

    mocha.it("Void elements should be self-closing", function () {
      assert.strictEqual(
        generator
          .createJsxSelfClosingElement(
            generator.createIdentifier("img"),
            undefined,
            undefined
          )
          .toString(),
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

    mocha.it(
      `process title attribute - use empty string if value is undefined"`,
      function () {
        const expression = generator.createJsxAttribute(
          generator.createIdentifier("title"),
          generator.createJsxExpression(
            undefined,
            generator.createIdentifier("value")
          )
        );

        assert.strictEqual(
          expression.toString(),
          `[title]="value!==undefined?value:''"`
        );
      }
    );

    mocha.it(
      `do not process title attribute if it stringLiteral value"`,
      function () {
        const expression = generator.createJsxAttribute(
          generator.createIdentifier("title"),
          generator.createStringLiteral("value")
        );

        assert.strictEqual(expression.toString(), `title="value"`);
      }
    );

    mocha.it(
      `JsxAttribute with template expression - [attr]="string concatenation"`,
      function () {
        const templateExpression = generator.createTemplateExpression(
          generator.createTemplateHead("a"),
          [
            generator.createTemplateSpan(
              generator.createNumericLiteral("1"),
              generator.createTemplateMiddle("b")
            ),
            generator.createTemplateSpan(
              generator.createNumericLiteral("2"),
              generator.createTemplateTail("c")
            ),
          ]
        );

        const expression = generator.createJsxAttribute(
          generator.createIdentifier("attr"),
          generator.createJsxExpression(undefined, templateExpression)
        );

        assert.strictEqual(expression.toString(), `[attr]="'a'+1+'b'+2+'c'"`);
      }
    );

    mocha.it("JsxAttribute without initializer", function () {
      const expression = generator.createJsxAttribute(
        generator.createIdentifier("a"),
        undefined
      );
      assert.strictEqual(
        removeSpaces(expression.toString()),
        removeSpaces(`[a]="true"`)
      );
    });

    mocha.it(
      `JsxAttribute with string literal expression - attr="value"`,
      function () {
        const expression = generator.createJsxAttribute(
          generator.createIdentifier("attr"),
          generator.createStringLiteral("value")
        );

        assert.strictEqual(expression.toString(), `attr="value"`);
      }
    );

    mocha.it(
      `JsxAttribute is JsxExpression with stringLiteral - attr="value"`,
      function () {
        const expression = generator.createJsxAttribute(
          generator.createIdentifier("attr"),
          generator.createJsxExpression(
            undefined,
            generator.createStringLiteral("value")
          )
        );

        assert.strictEqual(expression.toString(), `attr="value"`);
      }
    );

    ['aria-label', 'aria-labelledby', 'aria-colindex', 'aria-rowindex', 'aria-selected'].forEach((attrName) => {
      mocha.it(`${attrName} attribute binding - [attr.${attrName}]"`, function () {
        const expression = generator.createJsxAttribute(
          generator.createIdentifier(attrName),
          generator.createJsxExpression(
            undefined,
            generator.createIdentifier("value")
          )
        );
  
        assert.strictEqual(expression.toString(), `[attr.${attrName}]="value"`);
      });
  
      mocha.it(`${attrName} attribute - ${attrName}"`, function () {
        const expression = generator.createJsxAttribute(
          generator.createIdentifier(attrName),
          generator.createJsxExpression(
            undefined,
            generator.createStringLiteral("value")
          )
        );
  
        assert.strictEqual(expression.toString(), `${attrName}="value"`);
      });
    })
    
    mocha.it("JsxSelfClosingElement with attributes", function () {
      const expression = generator.createJsxSelfClosingElement(
        generator.createIdentifier("div"),
        [],
        generator.createJsxAttributes([
          generator.createJsxAttribute(
            generator.createIdentifier("a1"),
            generator.createNumericLiteral("10")
          ),
          generator.createJsxAttribute(
            generator.createIdentifier("a2"),
            generator.createNumericLiteral("15")
          ),
        ])
      );

      assert.strictEqual(
        expression.toString(),
        `<div [a1]="10"\n[a2]="15"></div>`
      );
    });

    mocha.describe("JsxAttribute SVG with svg", function () {
      mocha.it("name -> [attr.name]", function () {
        const attrName = "height";
        const attribute = generator.createJsxAttribute(
          generator.createIdentifier(attrName),
          generator.createJsxExpression(
            undefined,
            generator.createNumericLiteral("10")
          )
        );

        assert.strictEqual(
          attribute.toString({
            members: [],
            isSVG: true,
          }),
          `[attr.${attrName}]="10"`,
          attrName
        );
      });

      mocha.it("className->attr.class", function () {
        const attrName = "class";
        const attribute = generator.createJsxAttribute(
          generator.createIdentifier(attrName),
          generator.createJsxExpression(
            undefined,
            generator.createNumericLiteral("10")
          )
        );

        assert.strictEqual(
          attribute.toString({
            members: [],
            isSVG: true,
          }),
          `[attr.${attrName}]="10"`,
          attrName
        );
      });

      mocha.it("camelCase -> camel-case", function () {
        const attribute = generator.createJsxAttribute(
          generator.createIdentifier("strokeWidth"),
          generator.createJsxExpression(
            undefined,
            generator.createNumericLiteral("10")
          )
        );

        assert.strictEqual(
          attribute.toString({
            members: [],
            isSVG: true,
          }),
          `[attr.stroke-width]="10"`
        );
      });

      mocha.it("Do not use attr.binding for string literal value", function () {
        const attribute = generator.createJsxAttribute(
          generator.createIdentifier("width"),
          generator.createJsxExpression(
            undefined,
            generator.createStringLiteral("10px")
          )
        );

        assert.strictEqual(
          attribute.toString({
            members: [],
            isSVG: true,
          }),
          'width="10px"'
        );
      });

      mocha.it("do not dasherize not-kebab-case attribute", function () {
        const expression = generator.createJsxAttribute(
          generator.createIdentifier("viewBox"),
          generator.createJsxExpression(
            undefined,
            generator.createIdentifier("value")
          )
        );

        assert.strictEqual(
          expression.toString({
            members: [],
            isSVG: true,
          }),
          `[attr.viewBox]="value"`
        );
      });
    });

    mocha.it("JSX element with Opening and Close Elements", function () {
      const expression = generator.createJsxElement(
        generator.createJsxOpeningElement(
          generator.createIdentifier("div"),
          undefined,
          generator.createJsxAttributes([
            generator.createJsxAttribute(
              generator.createIdentifier("a"),
              generator.createIdentifier("value")
            ),
          ])
        ),
        [],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(expression.toString(), '<div [a]="value"></div>');
    });

    mocha.it("JsxElement: trim spaces in string children", function () {
      const expression = generator.createJsxElement(
        generator.createJsxOpeningElement(
          generator.createIdentifier("div"),
          undefined,
          []
        ),
        ["     a      "],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(expression.toString(), "<div >a</div>");
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
          ),
        ],
        generator.createJsxClosingElement(
          generator.createIdentifier("Fragment")
        )
      );

      assert.strictEqual(expression.toString(), "<div ></div>");
    });

    mocha.it("JSX element with with child element", function () {
      const expression = generator.createJsxElement(
        generator.createJsxOpeningElement(
          generator.createIdentifier("parent"),
          undefined,
          []
        ),
        [
          generator.createJsxSelfClosingElement(
            generator.createIdentifier("child")
          ),
        ],
        generator.createJsxClosingElement(generator.createIdentifier("parent"))
      );

      assert.strictEqual(
        expression.toString(),
        "<parent ><child ></child></parent>"
      );
    });

    mocha.it("Pass svg children into component", function () {
      const component = createComponent([
        generator.createProperty(
          [
            createDecorator(Decorators.Slot, {
              isSVG: generator.createTrue(),
            }),
          ],
          [],
          generator.createIdentifier("children")
        ),
      ]);

      const expression = generator.createJsxElement(
        generator.createJsxOpeningElement(component._name),
        [
          generator.createJsxSelfClosingElement(
            generator.createIdentifier("text")
          ),
        ],
        generator.createJsxClosingElement(component._name)
      );

      assert.strictEqual(
        removeSpaces(expression.toString()),
        removeSpaces(`
          <dx-base-widget #basewidget1 style="display:contents" ><svg:text ></text></dx-base-widget>
          <ng-content *ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
        `)
      );
    });

    mocha.it(
      "Pass not svg children into svg widget - throw exception",
      function () {
        const component = createComponent(
          [
            generator.createProperty(
              [createDecorator(Decorators.Slot)],
              [],
              generator.createIdentifier("children")
            ),
          ],
          {
            isSVG: generator.createTrue(),
          }
        );

        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(component._name),
          [
            generator.createJsxExpression(
              undefined,
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("children")
              )
            ),
          ],
          generator.createJsxClosingElement(component._name)
        );

        let error: string | null = null;
        try {
          expression.toString({
            members: [
              generator.createProperty(
                [createDecorator(Decorators.Slot)],
                [],
                generator.createIdentifier("children")
              ),
            ],
            componentContext: "viewModel",
            newComponentContext: "",
          });
        } catch (e) {
          error = e;
        }

        assert.strictEqual(
          error,
          "Can't pass children slot into BaseWidget: Use @Slot({isSVG: true})"
        );
      }
    );

    mocha.it(
      "JSX element with with child element that transformed from expression - no wrap it {{}}",
      function () {
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
                generator.createToken(
                  generator.SyntaxKind.AmpersandAmpersandToken
                ),
                generator.createJsxElement(
                  generator.createJsxOpeningElement(
                    generator.createIdentifier("child"),
                    undefined,
                    []
                  ),
                  [],
                  generator.createJsxClosingElement(
                    generator.createIdentifier("child")
                  )
                )
              )
            ),
          ],
          generator.createJsxClosingElement(
            generator.createIdentifier("parent")
          )
        );
        assert.strictEqual(
          expression.toString(),
          `<parent ><child *ngIf="true"></child></parent>`
        );
      }
    );

    mocha.it(
      `<element>{"text"}</element> -> <element>text</element>`,
      function () {
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
            ),
          ],
          generator.createJsxClosingElement(
            generator.createIdentifier("element")
          )
        );
        assert.strictEqual(expression.toString(), `<element >text</element>`);
      }
    );

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

      assert.strictEqual(
        expression.toString(),
        `[ngStyle]="__processNgStyle(value)"`
      );
    });

    mocha.it(
      "notJsxExpr && <element></element> -> <element *ngIf='notJsxExpr'></element>",
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
                    generator.createJsxAttributes([])
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
          `<input *ngIf="viewModel.input"></input>`
        );
      }
    );

    mocha.it("Binary operator in attribute", function () {
      const expression = generator.createJsxSelfClosingElement(
        generator.createIdentifier("input"),
        undefined,
        [
          generator.createJsxAttribute(
            generator.createIdentifier("a"),
            generator.createJsxExpression(
              undefined,
              generator.createBinary(
                generator.createIdentifier("s1"),
                generator.SyntaxKind.PlusToken,
                generator.createIdentifier("s2")
              )
            )
          ),
        ]
      );

      assert.strictEqual(expression.toString(), `<input [a]="s1 + s2"/>`);
    });

    mocha.it(
      "not supported binary expression in JsxExpression - throw exception",
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
                generator.createToken(generator.SyntaxKind.PlusToken),
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
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        let error;
        try {
          expression.toString();
        } catch (e) {
          error = e;
        }

        assert.strictEqual(
          error,
          "Operator + is not supported: viewModel.input + <input ></input>"
        );
      }
    );

    mocha.it("non jsx binary in element", function () {
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
              generator.createIdentifier("s1"),
              generator.SyntaxKind.PlusToken,
              generator.createIdentifier("s2")
            )
          ),
        ],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(expression.toString(), "<div >{{s1 + s2}}</div>");
    });

    mocha.it(
      "notJsxExpr && <element/> -> <element *ngIf='notJsxExpr' />",
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
                  generator.createJsxAttributes([])
                )
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(
          expression.children[0].toString(),
          `<input *ngIf="viewModel.input"/>`
        );
      }
    );

    mocha.it(
      "ngIf directive with string - replace quotes with backslash quotes",
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
                generator.createBinary(
                  generator.createIdentifier("viewModel"),
                  generator.SyntaxKind.EqualsEqualsEqualsToken,
                  generator.createStringLiteral("input")
                ),
                generator.createToken(
                  generator.SyntaxKind.AmpersandAmpersandToken
                ),
                generator.createJsxSelfClosingElement(
                  generator.createIdentifier("input"),
                  undefined,
                  generator.createJsxAttributes([])
                )
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(
          expression.children[0].toString(),
          `<input *ngIf="viewModel === 'input'"/>`
        );
      }
    );

    mocha.it(
      "condition?then:else - <div ngIf='condition'> <div ngIf='!(condition)'",
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
                  generator.createIdentifier("div"),
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
            `<div [a]="_value" *ngIf="condition"></div>\n<input [a]="_value" *ngIf="!(condition)"/>`
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
            `<ng-container *ngIf="condition">
              {{_value}}
            </ng-container>
            <ng-container *ngIf="!(condition)">
              {{!_value}}
            </ng-container>`
          )
        );
      }
    );

    mocha.it("conditional expression with paren", function () {
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
              generator.createParen(
                generator.createJsxSelfClosingElement(
                  generator.createIdentifier("div"),
                  [],
                  []
                )
              ),
              generator.createParen(
                generator.createJsxSelfClosingElement(
                  generator.createIdentifier("input"),
                  [],
                  []
                )
              )
            )
          ),
        ],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(
        removeSpaces(expression.children[0].toString()),
        removeSpaces(
          `<div *ngIf="condition"></div>\n<input *ngIf="!(condition)"/>`
        )
      );
    });

    mocha.it(
      "<element>nonJsxExpr</element> -> <element>{{nonJsxExpr}}</element>",
      function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("span"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("text")
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("span"))
        );

        assert.strictEqual(
          expression.toString(),
          "<span >{{viewModel.text}}</span>"
        );
      }
    );

    mocha.it("render element from variable", function () {
      const variable = generator.createJsxElement(
        generator.createJsxOpeningElement(
          generator.createIdentifier("span"),
          undefined,
          []
        ),
        [],
        generator.createJsxClosingElement(generator.createIdentifier("span"))
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
            generator.createIdentifier("var")
          ),
        ],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(
        expression.toString({
          members: [],
          variables: {
            var: variable,
          },
        }),
        `<div ><ng-container *ngTemplateOutlet="var"></ng-container></div>`
      );
    });

    mocha.it(
      "render element from variable in condition expression in parens",
      function () {
        const variable = generator.createParen(
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
                generator.createParen(generator.createIdentifier("var")),
                generator.createParen(generator.createIdentifier("var"))
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(
          removeSpaces(
            expression.toString({
              members: [],
              variables: {
                var: variable,
              },
            })
          ),
          removeSpaces(`
          <div >
            <ng-container *ngIf="condition">
              <ng-container *ngTemplateOutlet="var"></ng-container>
            </ng-container>
            <ng-container *ngIf="!(condition)">
              <ng-container *ngTemplateOutlet="var"></ng-container>
            </ng-container>
          </div>`)
        );
      }
    );

    mocha.it("render element from variable in condition", function () {
      const variable = generator.createJsxElement(
        generator.createJsxOpeningElement(
          generator.createIdentifier("span"),
          undefined,
          []
        ),
        [],
        generator.createJsxClosingElement(generator.createIdentifier("span"))
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
              generator.createIdentifier("var"),
              generator.createIdentifier("var")
            )
          ),
        ],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(
        removeSpaces(
          expression.toString({
            members: [],
            variables: {
              var: variable,
            },
          })
        ),
        removeSpaces(`
          <div >
            <ng-container *ngIf="condition">
              <ng-container *ngTemplateOutlet="var"></ng-container>
            </ng-container>
            <ng-container *ngIf="!(condition)">
              <ng-container *ngTemplateOutlet="var"></ng-container>
            </ng-container>
          </div>`)
      );
    });

    mocha.describe("Dynamic components", function () {
      mocha.it(
        "<DynamicComponent /> -> <ng-template dynamicComponent>",
        function () {
          const getterName = "DynamicComponent";
          const getter = generator.createGetAccessor(
            [],
            undefined,
            generator.createIdentifier(getterName),
            [],
            undefined,
            generator.createBlock([], false)
          );

          const element = generator.createJsxSelfClosingElement(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier(getterName)
            )
          );

          const options: toStringOptions = {
            members: [getter],
            componentContext: "viewModel",
            newComponentContext: "",
          };

          assert.strictEqual(
            removeSpaces(element.toString(options)),
            removeSpaces(`
              <ng-template dynamicComponent
                [props]="{}"
                [componentConstructor]="DynamicComponent"
                let-DynamicComponent="DynamicComponent"
              >
              </ng-template>`)
          );
          assert.strictEqual(options.hasDynamicComponents, true);
        }
      );

      mocha.it("<DynamicComponent [props]='value'/>", function () {
        const getterName = "DynamicComponent";
        const getter = generator.createGetAccessor(
          [],
          undefined,
          generator.createIdentifier(getterName),
          [],
          undefined,
          generator.createBlock([], false)
        );

        const element = generator.createJsxSelfClosingElement(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier(getterName)
          ),
          undefined,
          [
            generator.createJsxAttribute(
              generator.createIdentifier("prop1"),
              generator.createStringLiteral("value1")
            ),
            generator.createJsxAttribute(
              generator.createIdentifier("prop2"),
              generator.createStringLiteral("value2")
            ),
          ]
        );

        const options: toStringOptions = {
          members: [getter],
          componentContext: "viewModel",
          newComponentContext: "",
        };

        assert.strictEqual(
          removeSpaces(element.toString(options)),
          removeSpaces(`
            <ng-template dynamicComponent
              [props]="{prop1:'value1',prop2:'value2'}"
              [componentConstructor]="DynamicComponent"
              let-DynamicComponent="DynamicComponent">
            </ng-template>`)
        );
      });

      mocha.it("<DynamicComponent with spreadProps/>", function () {
        const getterName = "DynamicComponent";
        const getter = generator.createGetAccessor(
          [],
          undefined,
          generator.createIdentifier(getterName),
          [],
          undefined,
          generator.createBlock([], false)
        );

        const element = generator.createJsxSelfClosingElement(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier(getterName)
          ),
          undefined,
          [
            generator.createJsxAttribute(
              generator.createIdentifier("prop1"),
              generator.createIdentifier("value1")
            ),
            generator.createJsxSpreadAttribute(
              generator.createIdentifier("spreadValue")
            ),
            generator.createJsxAttribute(
              generator.createIdentifier("prop2"),
              generator.createStringLiteral("value2")
            ),
            generator.createJsxSpreadAttribute(
              generator.createIdentifier("oneMoreSpread")
            ),
          ]
        );

        const options: toStringOptions = {
          members: [getter],
          componentContext: "viewModel",
          newComponentContext: "",
        };

        assert.strictEqual(
          removeSpaces(element.toString(options)),
          removeSpaces(`
            <ng-template dynamicComponent
              [props]="{prop1:value1,dxSpreadProp1:spreadValue,prop2:'value2',dxSpreadProp3:oneMoreSpread}"
              [componentConstructor]="DynamicComponent"
              let-DynamicComponent="DynamicComponent">
            </ng-template>`)
        );
      });

      mocha.it(
        "<DynamicComponent></DynamicComponent> -> <ng-template dynamicComponent>",
        function () {
          const getterName = "DynamicComponent";
          const getter = generator.createGetAccessor(
            [],
            undefined,
            generator.createIdentifier(getterName),
            [],
            undefined,
            generator.createBlock([], false)
          );

          const tag = generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier(getterName)
          );
          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(tag, undefined, []),
            [],
            generator.createJsxClosingElement(tag)
          );

          assert.strictEqual(
            removeSpaces(
              element.toString({
                members: [getter],
                componentContext: "viewModel",
                newComponentContext: "",
              })
            ),
            removeSpaces(`
              <ng-template dynamicComponent
                [props]="{}"
                [componentConstructor]="DynamicComponent"
                let-DynamicComponent="DynamicComponent">
              </ng-template>`)
          );
        }
      );

      mocha.it(
        "<DynamicComponent template={()=><div/>}/> -> <component><template></component>",
        function () {
          const component = createComponent([
            generator.createProperty(
              [createDecorator(Decorators.Template)],
              [],
              generator.createIdentifier("template")
            ),
          ]);

          const getterName = "DynamicComponent";
          const getter = generator.createGetAccessor(
            [],
            undefined,
            generator.createIdentifier(getterName),
            [],
            generator.createTypeReferenceNode(component._name),
            generator.createBlock([], false)
          );

          const tag = generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            getter._name
          );
          const element = generator.createJsxSelfClosingElement(
            tag,
            undefined,
            [
              generator.createJsxAttribute(
                generator.createIdentifier("template"),
                generator.createJsxExpression(
                  undefined,
                  generator.createArrowFunction(
                    [],
                    undefined,
                    [],
                    undefined,
                    generator.SyntaxKind.EqualsGreaterThanToken,
                    generator.createJsxSelfClosingElement(
                      generator.createIdentifier("div")
                    )
                  )
                )
              ),
            ]
          );

          const options: toStringOptions = {
            members: [getter],
            componentContext: "viewModel",
            newComponentContext: "",
          };

          assert.strictEqual(
            removeSpaces(element.toString(options)),
            removeSpaces(`
              <ng-template dynamicComponent
                [props]="{template:__template__generated}"
                [componentConstructor]="DynamicComponent"
                let-DynamicComponent="DynamicComponent">
                </ng-template>
                <ng-template #__template__generated>
                    <div></div>
                  </ng-template>
            `)
          );
        }
      );

      mocha.it("can't parse template", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.Template)],
            [],
            generator.createIdentifier("template")
          ),
        ]);

        const getterName = "DynamicComponent";
        const getter = generator.createGetAccessor(
          [],
          undefined,
          generator.createIdentifier(getterName),
          [],
          generator.createTypeReferenceNode(component._name),
          generator.createBlock([], false)
        );

        const tag = generator.createPropertyAccess(
          generator.createIdentifier("viewModel"),
          getter._name
        );
        const element = generator.createJsxSelfClosingElement(tag, undefined, [
          generator.createJsxAttribute(
            generator.createIdentifier("template"),
            generator.createArrowFunction(
              [],
              undefined,
              [],
              undefined,
              generator.SyntaxKind.EqualsGreaterThanToken,
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("div")
              )
            )
          ),
        ]);

        const options: toStringOptions = {
          members: [getter],
          componentContext: "viewModel",
          newComponentContext: "",
        };

        assert.strictEqual(
          removeSpaces(element.toString(options)),
          removeSpaces(`
              <ng-template dynamicComponent
                [props]="{template: null}"
                [componentConstructor]="DynamicComponent"
                let-DynamicComponent="DynamicComponent">
                </ng-template>
                <ng-template #__template__generated>
                    <div></div>
                  </ng-template>
            `)
        );
      });

      mocha.it(
        "<DynamicComponent template={()=><div/>}></DynamicComponent> -> <component><template></component>",
        function () {
          const component = createComponent([
            generator.createProperty(
              [createDecorator(Decorators.Template)],
              [],
              generator.createIdentifier("template")
            ),
          ]);

          const getterName = "DynamicComponent";
          const getter = generator.createGetAccessor(
            [],
            undefined,
            generator.createIdentifier(getterName),
            [],
            generator.createTypeReferenceNode(component._name),
            generator.createBlock([], false)
          );

          const tag = generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            getter._name
          );
          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(tag, undefined, [
              generator.createJsxAttribute(
                generator.createIdentifier("template"),
                generator.createJsxExpression(
                  undefined,
                  generator.createArrowFunction(
                    [],
                    undefined,
                    [],
                    undefined,
                    generator.SyntaxKind.EqualsGreaterThanToken,
                    generator.createJsxSelfClosingElement(
                      generator.createIdentifier("div")
                    )
                  )
                )
              ),
            ]),
            [
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("div")
              ),
            ],
            generator.createJsxClosingElement(tag)
          );

          const options: toStringOptions = {
            members: [getter],
            componentContext: "viewModel",
            newComponentContext: "",
          };

          assert.strictEqual(
            removeSpaces(element.toString(options)),
            removeSpaces(`
              <ng-template dynamicComponent
                [props]="{template:__template__generated}"
                [componentConstructor]="DynamicComponent"
                let-DynamicComponent="DynamicComponent">
                  <div></div>
                </ng-template>
                <ng-template #__template__generated>
                  <div></div>
                </ng-template>
            `)
          );
        }
      );

      mocha.it(
        "condition && <DynamicComponent /> -> <ng-template *ngIf dynamicComponent>",
        function () {
          const getterName = "DynamicComponent";
          const getter = generator.createGetAccessor(
            [],
            undefined,
            generator.createIdentifier(getterName),
            [],
            undefined,
            generator.createBlock([], false)
          );

          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div")
            ),
            [
              generator.createJsxExpression(
                undefined,
                generator.createBinary(
                  generator.createIdentifier("condition"),
                  generator.SyntaxKind.AmpersandAmpersandToken,
                  generator.createJsxSelfClosingElement(
                    generator.createPropertyAccess(
                      generator.createIdentifier("viewModel"),
                      generator.createIdentifier(getterName)
                    )
                  )
                )
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          const options: toStringOptions = {
            members: [getter],
            componentContext: "viewModel",
            newComponentContext: "",
          };

          assert.strictEqual(
            removeSpaces(element.toString(options)),
            removeSpaces(
              `<div>
              <ng-template dynamicComponent
                *ngIf="condition"
                [props]="{}"
                [componentConstructor]="DynamicComponent"
                let-DynamicComponent="DynamicComponent">
              </ng-template>
            </div>`
            )
          );
        }
      );

      mocha.it("map <DynamicComponent />", function () {
        const getterName = "DynamicComponent";
        const getter = generator.createGetAccessor(
          [],
          undefined,
          generator.createIdentifier(getterName),
          [],
          undefined,
          generator.createBlock([], false)
        );

        const element = generator.createJsxElement(
          generator.createJsxOpeningElement(generator.createIdentifier("div")),
          [
            generator.createJsxExpression(
              undefined,
              generator.createCall(
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier(getterName)
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
                      generator.createParameter(
                        undefined,
                        undefined,
                        undefined,
                        generator.createIdentifier("index"),
                        undefined,
                        undefined,
                        undefined
                      ),
                    ],
                    undefined,
                    generator.createToken(
                      generator.SyntaxKind.EqualsGreaterThanToken
                    ),
                    generator.createJsxSelfClosingElement(
                      generator.createIdentifier("item"),
                      undefined,
                      [
                        generator.createJsxAttribute(
                          generator.createIdentifier("key"),
                          generator.createIdentifier("index")
                        ),
                        generator.createJsxAttribute(
                          generator.createIdentifier("prop"),
                          generator.createIdentifier("value")
                        ),
                      ]
                    )
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        const options: toStringOptions = {
          members: [getter],
          componentContext: "viewModel",
          newComponentContext: "",
        };

        assert.strictEqual(
          removeSpaces(element.toString(options)),
          removeSpaces(`<div>
            <ng-container *ngFor="let item of DynamicComponent; index as index">
              <ng-template dynamicComponent
                [props]="{prop:value}"
                [componentConstructor]="item"
                let-DynamicComponent="DynamicComponent"></ng-template>
            </ng-container>
          </div>`)
        );
      });
    });

    mocha.describe("Component", function () {
      mocha.it("Render himself", function () {
        const componentName = "BaseWidget";

        const element = generator.createJsxSelfClosingElement(
          generator.createIdentifier(componentName)
        );

        const component = createComponent([]);

        assert.strictEqual(component.name, componentName);
        assert.strictEqual(
          removeSpaces(element.toString({
            members: [],
          })),
          removeSpaces(`
            <dx-base-widget #basewidget1 style="display:contents" ></dx-base-widget>
            <ng-content *ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
          `)
        );
      });

      mocha.it("<SVGComponent/>", function () {
        const component = createComponent([], {
          isSVG: generator.createTrue(),
        });

        const element = generator.createJsxSelfClosingElement(
          generator.createIdentifier(component.name)
        );

        assert.strictEqual(
          removeSpaces(element.toString({
            members: [],
          })),
          removeSpaces(`
            <g BaseWidget></g>
          `)
        );
      });

      mocha.it(
        "render svg component with children inside html component",
        function () {
          const component = createComponent([], {
            isSVG: generator.createTrue(),
          });

          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("div")
            ),
            [
              generator.createJsxElement(
                generator.createJsxOpeningElement(component._name),
                [
                  generator.createJsxSelfClosingElement(
                    generator.createIdentifier("text"),
                    undefined,
                    [
                      generator.createJsxAttribute(
                        generator.createIdentifier("style"),
                        generator.createIdentifier("styleValue")
                      ),
                    ]
                  ),
                ],
                generator.createJsxClosingElement(component._name)
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          const options: toStringOptions = {
            members: [],
            isSVG: false,
          };

          assert.strictEqual(
            removeSpaces(element.toString(options)),
            removeSpaces(`
            <div>
              <g BaseWidget>
                <svg:text [ngStyle]="__processNgStyle(styleValue)"></text>
              </g >
            </div>`)
          );

          assert.strictEqual(options.isSVG, false);
          assert.strictEqual(options.hasStyle, true);
        }
      );

      mocha.it("<SVG Component></SVGComponent>", function () {
        const component = createComponent([], {
          isSVG: generator.createTrue(),
        });

        const element = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier(component.name)
          ),
          [],
          generator.createJsxClosingElement(
            generator.createIdentifier(component.name)
          )
        );

        assert.strictEqual(
          removeSpaces(element.toString({
            members: [],
          })),
          removeSpaces(`
            <g BaseWidget></g>
          `)
        );
      });
    });

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
            <div #slotChildren style="display:contents">
              <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
            </div>
            <ng-container *ngIf="!(children)">{{alternative}}</ng-container>
              `)
        );
      });
    });

    mocha.describe("Spread Attributes on html element", function () {
      this.beforeEach(function () {
        generator.setContext(null);
        generator.setContext({
          dirname: __dirname,
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

      mocha.it(
        "element with spread attribute should not generate ref attribute if it have one",
        function () {
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
              ),
            ]
          );

          assert.strictEqual(element.toString(), "<input #value/>");
          const spreadAttributes = element.getSpreadAttributes();
          assert.strictEqual(spreadAttributes.length, 1);
          assert.strictEqual(spreadAttributes[0].expression.toString(), "attr");
          assert.strictEqual(
            spreadAttributes[0].refExpression.toString(),
            "value"
          );
        }
      );

      mocha.it(
        "element with spread attribute should generate unique ref attribute if it have no one",
        function () {
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
          assert.strictEqual(
            spreadAttributes[0].refExpression.toString(),
            "_auto_ref_0"
          );
        }
      );

      mocha.it(
        "getJsxAttributes should collect attributes from all tree",
        function () {
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
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          assert.strictEqual(
            element.toString(),
            "<div #_auto_ref_0><input #_auto_ref_1/></div>"
          );
          const spreadAttributes = element.getSpreadAttributes();
          assert.strictEqual(spreadAttributes.length, 2);
        }
      );
    });

    mocha.describe("Spread attribute on component", function () {
      this.beforeEach(function () {
        generator.setContext({
          dirname: __dirname,
        });
      });

      this.afterEach(function () {
        generator.setContext(null);
      });

      mocha.it("...props - pick only props those exist in widget", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          ),
        ]);

        const element = generator.createJsxSelfClosingElement(
          component._name,
          [],
          [
            generator.createJsxSpreadAttribute(
              generator.createIdentifier("props")
            ),
          ]
        );

        const p1 = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p1")
        );

        const p2 = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p2")
        );

        assert.strictEqual(
          removeSpaces(element.toString({
            componentContext: "",
            newComponentContext: "",
            members: [p1, p2],
          })),
          removeSpaces(`
            <dx-base-widget #basewidget1 style="display:contents" [p1]="p1"></dx-base-widget>
            <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
          `)
        );
      });

      mocha.it("...props, method - pick method", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          ),
        ]);

        const element = generator.createJsxSelfClosingElement(
          component._name,
          [],
          [
            generator.createJsxSpreadAttribute(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("props")
              )
            ),
            generator.createJsxAttribute(
              generator.createIdentifier("p1"),
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("p1")
              )
            ),
          ]
        );

        const p1 = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p1")
        );

        const p1Method = generator.createMethod(
          [],
          [],
          undefined,
          generator.createIdentifier("p1"),
          undefined,
          undefined,
          [],
          undefined,
          generator.createBlock([], false)
        );

        p1Method.prefix = "__";

        assert.strictEqual(
          removeSpaces(element.toString({
            componentContext: "viewModel",
            newComponentContext: "",
            members: [p1, p1Method],
          })),
          removeSpaces(`
            <dx-base-widget #basewidget1 style="display:contents" [p1]="__p1"></dx-base-widget>
            <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
          `)
        );
      });

      mocha.it(
        "method, ...props - pick method if props is not exist",
        function () {
          const component = createComponent([
            generator.createProperty(
              [createDecorator(Decorators.OneWay)],
              [],
              generator.createIdentifier("p1")
            ),
          ]);

          const element = generator.createJsxSelfClosingElement(
            component._name,
            [],
            [
              generator.createJsxAttribute(
                generator.createIdentifier("p1"),
                generator.createPropertyAccess(
                  generator.createIdentifier("viewModel"),
                  generator.createIdentifier("p1")
                )
              ),
              generator.createJsxSpreadAttribute(
                generator.createPropertyAccess(
                  generator.createIdentifier("viewModel"),
                  generator.createIdentifier("props")
                )
              ),
            ]
          );

          const p1 = generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          );

          const p1Method = generator.createMethod(
            [],
            [],
            undefined,
            generator.createIdentifier("p1"),
            undefined,
            undefined,
            [],
            undefined,
            generator.createBlock([], false)
          );

          p1Method.prefix = "__";

          assert.strictEqual(
            removeSpaces(element.toString({
              componentContext: "viewModel",
              newComponentContext: "",
              members: [p1, p1Method],
            })),
            removeSpaces(`
              <dx-base-widget #basewidget1 style="display:contents" [p1]="(p1!==undefined?p1:__p1)"></dx-base-widget>
              <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
            `)
          );
        }
      );

      mocha.it("getter, ...props - pick getter, prop", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          ),
        ]);

        const element = generator.createJsxSelfClosingElement(
          component._name,
          [],
          [
            generator.createJsxAttribute(
              generator.createIdentifier("p1"),
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("p1")
              )
            ),
            generator.createJsxSpreadAttribute(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("props")
              )
            ),
          ]
        );

        const p1 = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p1")
        );

        const p1Method = generator.createGetAccessor(
          [],
          [],
          generator.createIdentifier("p1"),
          [],
          undefined,
          generator.createBlock([], false)
        );

        p1Method.prefix = "__";

        assert.strictEqual(
          removeSpaces(element.toString({
            componentContext: "viewModel",
            newComponentContext: "",
            members: [p1, p1Method],
          })),
          removeSpaces(`
            <dx-base-widget #basewidget1 style="display:contents" [p1]="(p1!==undefined?p1:__p1)"></dx-base-widget>
            <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
          `)
        );
      });

      mocha.it("...props, getter - pick props,getter", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          ),
        ]);

        const element = generator.createJsxSelfClosingElement(
          component._name,
          [],
          [
            generator.createJsxSpreadAttribute(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("props")
              )
            ),
            generator.createJsxAttribute(
              generator.createIdentifier("p1"),
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("p1")
              )
            ),
          ]
        );

        const p1 = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p1")
        );

        const p1Method = generator.createGetAccessor(
          [],
          [],
          generator.createIdentifier("p1"),
          [],
          undefined,
          generator.createBlock([], false)
        );

        p1Method.prefix = "__";

        assert.strictEqual(
          removeSpaces(element.toString({
            componentContext: "viewModel",
            newComponentContext: "",
            members: [p1, p1Method],
          })),
          removeSpaces(`
            <dx-base-widget #basewidget1 style="display:contents" [p1]="(__p1!==undefined?__p1:p1)"></dx-base-widget>
            <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
          `)
        );
      });

      mocha.it("...{...props, ...restAttributes} - pick props", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          ),
        ]);

        const element = generator.createJsxSelfClosingElement(
          component._name,
          [],
          [
            generator.createJsxSpreadAttribute(
              generator.createObjectLiteral(
                [
                  generator.createSpreadAssignment(
                    generator.createPropertyAccess(
                      generator.createIdentifier("viewModel"),
                      generator.createIdentifier("props")
                    )
                  ),
                  generator.createSpreadAssignment(
                    generator.createPropertyAccess(
                      generator.createIdentifier("viewModel"),
                      generator.createIdentifier("restAttributes")
                    )
                  ),
                ],
                false
              )
            ),
          ]
        );

        const p1 = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p1")
        );

        const restAttributes = generator.createGetAccessor(
          [],
          [],
          generator.createIdentifier("restAttributes"),
          [],
          undefined,
          generator.createBlock([], false)
        );

        restAttributes.prefix = "__";

        assert.strictEqual(
          removeSpaces(element.toString({
            componentContext: "viewModel",
            newComponentContext: "",
            members: [p1, restAttributes],
          })),
          removeSpaces(`
            <dx-base-widget #basewidget1 style="display:contents" [p1]="p1"></dx-base-widget>
            <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
          `)
        );
      });

      mocha.it("...{x: x, y}", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("x")
          ),
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("y")
          ),
        ]);

        const element = generator.createJsxSelfClosingElement(
          component._name,
          [],
          [
            generator.createJsxSpreadAttribute(
              generator.createObjectLiteral(
                [
                  generator.createPropertyAssignment(
                    generator.createIdentifier("x"),
                    generator.createIdentifier("xValue")
                  ),
                  generator.createShorthandPropertyAssignment(
                    generator.createIdentifier("y")
                  ),
                ],
                false
              )
            ),
          ]
        );

        assert.strictEqual(
          removeSpaces(
            element.toString({
              componentContext: "viewModel",
              newComponentContext: "",
              members: [],
            })
          ),
          removeSpaces(`
            <dx-base-widget #basewidget1 style="display:contents" [x]="xValue" [y]="y"></dx-base-widget>
            <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
          `)
        );
      });
    });

    mocha.describe("hasStyle", function () {
      this.beforeEach(function () {
        this.options = {
          members: [],
          hasStyle: false,
        };
      });
      mocha.it("false if there is not any style attribute", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("span"),
            undefined,
            []
          ),
          [],
          generator.createJsxClosingElement(generator.createIdentifier("span"))
        );

        expression.toString(this.options);

        assert.strictEqual(this.options.hasStyle, false);
      });

      mocha.it("true if there is a style attribute", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("span"),
            undefined,
            [
              generator.createJsxAttribute(
                generator.createIdentifier("style"),
                generator.createIdentifier("value")
              ),
            ]
          ),
          [],
          generator.createJsxClosingElement(generator.createIdentifier("span"))
        );

        expression.toString(this.options);

        assert.strictEqual(this.options.hasStyle, true);
      });

      mocha.it(
        "true if there is a style attribute in the child element",
        function () {
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
                    ),
                  ]
                ),
                [],
                generator.createJsxClosingElement(
                  generator.createIdentifier("span")
                )
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          expression.toString(this.options);

          assert.strictEqual(this.options.hasStyle, true);
        }
      );

      mocha.it(
        "true if there is a style attribute in the child self-closing element",
        function () {
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
                  ),
                ]
              ),
            ],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
          );

          expression.toString(this.options);

          assert.strictEqual(this.options.hasStyle, true);
        }
      );
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

      assert.strictEqual(
        expression.toString({
          members: [
            generator.createProperty(
              [createDecorator(Decorators.Ref)],
              [],
              generator.createIdentifier("refName"),
              undefined,
              undefined,
              undefined
            ),
          ],
          componentContext: "viewModel",
          newComponentContext: "",
        }),
        "#refNameLink"
      );
    });

    mocha.it("ref with component context", function () {
      const expression = generator.createJsxAttribute(
        generator.createIdentifier("ref"),
        generator.createAsExpression(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier("refName")
          ),
          generator.createKeywordTypeNode("any")
        )
      );

      assert.strictEqual(
        expression.toString({
          members: [
            generator.createProperty(
              [createDecorator(Decorators.Ref)],
              [],
              generator.createIdentifier("refName"),
              undefined,
              generator.createKeywordTypeNode("HTMLDivElement"),
              undefined
            ),
          ],
          componentContext: "viewModel",
          newComponentContext: "",
        }),
        "#refNameLink"
      );
    });

    mocha.describe("slots", function () {
      mocha.it("named slot", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("span"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("name")
              )
            ),
          ],
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

        assert.strictEqual(
          removeSpaces(
            expression.toString({
              members: [slotProperty],
              componentContext: "viewModel",
            })
          ),
          removeSpaces(`
          <span >
            <div #slotName style="display: contents">
              <ng-container [ngTemplateOutlet]="dxname"></ng-container>
            </div>
          </span>`)
        );
      });

      mocha.it("named slot with empty context", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("span"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("name")
              )
            ),
          ],
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

        assert.strictEqual(
          removeSpaces(
            expression.toString({
              members: [slotProperty],
              componentContext: "viewModel",
              newComponentContext: "",
            })
          ),
          removeSpaces(`
          <span>
            <div #slotName style="display: contents">
              <ng-container [ngTemplateOutlet]="dxname"></ng-container>
            </div>
          </span>`)
        );
      });

      mocha.it("children slot", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("span"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("children")
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("span"))
        );

        const slotProperty = generator.createProperty(
          [createDecorator("Slot")],
          [],
          generator.createIdentifier("children"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          generator.createFalse()
        );

        assert.strictEqual(
          removeSpaces(
            expression.toString({
              members: [slotProperty],
            })
          ),
          removeSpaces(`
          <span>
            <div #slotChildren style="display: contents">
              <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
            </div>
          </span>`)
        );
      });

      mocha.it("slot in svg component", function () {
        const expression = generator.createJsxElement(
          generator.createJsxOpeningElement(
            generator.createIdentifier("svg"),
            undefined,
            []
          ),
          [
            generator.createJsxExpression(
              undefined,
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("children")
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("svg"))
        );

        const slotProperty = generator.createProperty(
          [createDecorator("Slot")],
          [],
          generator.createIdentifier("children"),
          generator.SyntaxKind.QuestionToken,
          undefined,
          generator.createFalse()
        );

        assert.strictEqual(
          removeSpaces(
            expression.toString({
              members: [slotProperty],
              isSVG: true,
            })
          ),
          removeSpaces(`
          <svg:svg >
            <svg:g #slotChildren >
              <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
            </svg:g>
          </svg>`)
        );
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
              generator.createIdentifier("Widget"),
              undefined
            ),
            generator.createStringLiteral(
              "./test-cases/declarations/src/empty-component"
            )
          );
        });

        this.afterEach(function () {
          generator.setContext(null);
        });

        mocha.it("<Widget></Widget> -> <dx-widget></dx-widget>", function () {
          const element = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createIdentifier("Widget")
            ),
            [],
            generator.createJsxClosingElement(
              generator.createIdentifier("Widget")
            )
          );

          assert.strictEqual(removeSpaces(element.toString()), removeSpaces(`
            <dx-widget #widget1 style="display:contents"></dx-widget>
            <ng-content *ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>`));
        });

        mocha.it("<Widget/> -> <dx-widget></dx-widget>", function () {
          const element = generator.createJsxSelfClosingElement(
            generator.createIdentifier("Widget"),
            []
          );

          assert.strictEqual(
            removeSpaces(element.toString()),
            removeSpaces(`
              <dx-widget #widget1 style="display:contents"></dx-widget>
              <ng-content *ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>
            `));
        });

        mocha.it(
          "import component statement should have import module",
          function () {
            const expression = generator.createImportDeclaration(
              [],
              [],
              generator.createImportClause(
                generator.createIdentifier("Component"),
                undefined
              ),
              generator.createStringLiteral(
                "./test-cases/declarations/src/empty-component"
              )
            );

            assert.strictEqual(
              expression.toString(),
              `import Component,{DxWidgetModule} from "./test-cases/declarations/src/empty-component"`
            );
          }
        );

        mocha.it(
          "import named exported component statement should have import module",
          function () {
            const expression = generator.createImportDeclaration(
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
            assertCode(
              expression.toString(),
              `import {Widget, DxWidgetModule} from "./test-cases/declarations/src/export-named-api-ref"`
            );
          }
        );

        mocha.it("Event attribute should be wrapped in paren", function () {
          generator.createClassDeclaration(
            [createComponentDecorator({})],
            [],
            generator.createIdentifier("Widget"),
            [],
            [],
            [
              generator.createProperty(
                [createDecorator(Decorators.Event)],
                [],
                generator.createIdentifier("event"),
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
                generator.createIdentifier("event"),
                generator.createIdentifier("value")
              ),
            ]
          );

          assert.strictEqual(
            removeSpaces(element.toString({
              members: [],
            })),
            removeSpaces(`<dx-widget (event)="value($event)" #widget1 style="display:contents"></dx-widget>
            <ng-content *ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>`)
          );
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
                [createDecorator(Decorators.OneWay)],
                [],
                generator.createIdentifier("className"),
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
                generator.createIdentifier("className"),
                generator.createIdentifier("value")
              ),
            ]
          );

          assert.strictEqual(
            removeSpaces(element.toString({
              members: [],
            })),
            removeSpaces(`<dx-widget [className]="value" #widget1 style="display:contents"></dx-widget>
            <ng-content *ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>`)
          );
        });

        mocha.it(
          "className should be renamed to class in children",
          function () {
            generator.createClassDeclaration(
              [createComponentDecorator({})],
              [],
              generator.createIdentifier("Widget"),
              [],
              [],
              [
                generator.createProperty(
                  [createDecorator(Decorators.OneWay)],
                  [],
                  generator.createIdentifier("className"),
                  undefined,
                  undefined,
                  undefined
                ),
              ]
            );

            const element = generator.createJsxElement(
              generator.createJsxOpeningElement(
                generator.createIdentifier("Widget"),
                [],
                [
                  generator.createJsxAttribute(
                    generator.createIdentifier("className"),
                    generator.createIdentifier("value")
                  ),
                ]
              ),
              [
                generator.createJsxElement(
                  generator.createJsxOpeningElement(
                    generator.createIdentifier("div"),
                    [],
                    [
                      generator.createJsxAttribute(
                        generator.createIdentifier("className"),
                        generator.createStringLiteral("class-name")
                      ),
                    ]
                  ),
                  [],
                  generator.createJsxClosingElement(
                    generator.createIdentifier("div")
                  )
                ),
              ],
              generator.createJsxClosingElement(
                generator.createIdentifier("Widget")
              )
            );

            assert.strictEqual(
              removeSpaces(element.toString({
                members: [],
              })),
              removeSpaces(`<dx-widget [className]="value" #widget1 style="display:contents">
                <div class="class-name"></div>
              </dx-widget>
              <ng-content *ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>`)
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
              removeSpaces(
                element.toString({
                  componentContext: "",
                  newComponentContext: "",
                  members: [slotProperty],
                })
              ),
              removeSpaces(`
              <dx-widget #widget1 style="display:contents">
                <div #slotChildren style="display: contents">
                  <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
                </div>
              </dx-widget>
              <ng-content*ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>`)
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
              removeSpaces(
                element.toString({
                  componentContext: "",
                  newComponentContext: "",
                  members: [slotProperty, namedSlot],
                })
              ),
              removeSpaces(`
              <dx-widget #widget1 style="display:contents">
                <div #slotChildrenstyle="display:contents">
                  <ng-container [ngTemplateOutlet]="dxchildren">
                  </ng-container>
                </div>
                <div #slotNamedSlot style="display:contents">
                  <ng-container[ngTemplateOutlet]="dxnamedSlot">
                  </ng-container>
                </div>
              </dx-widget>
              <ng-content*ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>`)
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
                    generator.createIdentifier(
                      generator.SyntaxKind.ThisKeyword
                    ),
                    generator.createIdentifier("props")
                  )
                ),
              ]
            );

            assert.strictEqual(
              removeSpaces(
                element.toString({
                  componentContext: "this",
                  newComponentContext: "",
                  members: [slotProperty],
                })
              ),
              removeSpaces(`
              <dx-widget #widget1 style="display:contents">
                <div #slotChildren style="display: contents">
                  <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
                </div>
              </dx-widget>
              <ng-content*ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>`)
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
              [],
              generator.createJsxClosingElement(
                generator.createIdentifier("Widget")
              )
            );

            assert.strictEqual(
              removeSpaces(
                element.toString({
                  componentContext: "",
                  newComponentContext: "",
                  members: [slotProperty],
                })
              ),
              removeSpaces(`
              <dx-widget #widget1 style="display:contents">
                <div #slotChildren style="display: contents">
                  <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
                </div>
              </dx-widget>
              <ng-content*ngTemplateOutlet="widget1?.widgetTemplate"></ng-content>`)
            );
          });
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

        assert.strictEqual(
          expression.toString({
            members: [templateProperty],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          `<ng-container *ngTemplateOutlet="template"></ng-container>`
        );
      });

      mocha.it(
        "<template><template -> <ng-container></ng-container>",
        function () {
          const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("template")
              ),
              [],
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
            `<ng-container *ngTemplateOutlet="template"></ng-container>`
          );
        }
      );

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
          removeSpaces(
            expression.toString({
              members: [templateProperty],
              componentContext: "viewModel",
              newComponentContext: "",
            })
          ),
          removeSpaces(
            `<ng-container *ngTemplateOutlet="template; context:{a1: \'str\',a2: 10}"></ng-container>`
          )
        );
      });

      mocha.it(
        "template attributes -> template context. bind method to this",
        function () {
          const expression = generator.createJsxSelfClosingElement(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("template")
            ),
            [],
            [
              generator.createJsxAttribute(
                generator.createIdentifier("m"),
                generator.createPropertyAccess(
                  generator.createIdentifier("viewModel"),
                  generator.createIdentifier("m")
                )
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

          const method = generator.createMethod(
            [],
            [],
            undefined,
            generator.createIdentifier("m"),
            undefined,
            undefined,
            [],
            undefined,
            generator.createBlock([], false)
          );

          assert.strictEqual(
            removeSpaces(
              expression.toString({
                members: [templateProperty, method],
                componentContext: "viewModel",
                newComponentContext: "",
              })
            ),
            removeSpaces(
              `<ng-container*ngTemplateOutlet="template;context:{m:m.bind(this)}"></ng-container>`
            )
          );
        }
      );

      mocha.it(
        "template attributes -> template context. Do not bind GetAccessor to this",
        function () {
          const expression = generator.createJsxSelfClosingElement(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("template")
            ),
            [],
            [
              generator.createJsxAttribute(
                generator.createIdentifier("m"),
                generator.createPropertyAccess(
                  generator.createIdentifier("viewModel"),
                  generator.createIdentifier("m")
                )
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

          const getter = generator.createGetAccessor(
            [],
            [],
            generator.createIdentifier("m"),
            [],
            undefined,
            generator.createBlock([], false)
          );

          assert.strictEqual(
            removeSpaces(
              expression.toString({
                members: [templateProperty, getter],
                componentContext: "viewModel",
                newComponentContext: "",
              })
            ),
            removeSpaces(
              `<ng-container*ngTemplateOutlet="template;context:{m:m}"></ng-container>`
            )
          );
        }
      );

      mocha.describe(
        "Template with spread attribute -> template context",
        function () {
          mocha.it("template jsx spread attributes", function () {
            const expression = generator.createJsxSelfClosingElement(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("template")
              ),
              [],
              [
                generator.createJsxAttribute(
                  generator.createIdentifier("a1"),
                  generator.createNumericLiteral("10")
                ),
                generator.createJsxSpreadAttribute(
                  generator.createIdentifier("spreadContext")
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
              removeSpaces(
                expression.toString({
                  members: [templateProperty],
                  componentContext: "viewModel",
                  newComponentContext: "",
                })
              ),
              removeSpaces(
                `<ng-container *ngTemplateOutlet="template; context:{a1: 10}"></ng-container>`
              )
            );
          });

          mocha.it("...getter", function () {
            generator.createClassDeclaration(
              [createDecorator(Decorators.ComponentBindings)],
              [],
              generator.createIdentifier("Props"),
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
              ]
            );
            const expression = generator.createJsxSelfClosingElement(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("template")
              ),
              [],
              [
                generator.createJsxSpreadAttribute(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("spread")
                  )
                ),
              ]
            );

            const templateProperty = generator.createProperty(
              [createDecorator("Template")],
              [],
              generator.createIdentifier("template")
            );

            const spreadGetter = generator.createGetAccessor(
              [],
              [],
              generator.createIdentifier("spread"),
              [],
              generator.createTypeReferenceNode(
                generator.createIdentifier("Props")
              ),
              generator.createBlock([], false)
            );

            assert.strictEqual(
              removeSpaces(
                expression.toString({
                  members: [templateProperty, spreadGetter],
                  componentContext: "viewModel",
                  newComponentContext: "",
                })
              ),
              removeSpaces(
                `<ng-container *ngTemplateOutlet="template; context:{p1:spread.p1,p2:spread.p2}"></ng-container>`
              )
            );
          });

          mocha.it("...getter as type", function () {
            generator.createClassDeclaration(
              [createDecorator(Decorators.ComponentBindings)],
              [],
              generator.createIdentifier("Props"),
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
              ]
            );
            const expression = generator.createJsxSelfClosingElement(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("template")
              ),
              [],
              [
                generator.createJsxSpreadAttribute(
                  generator.createAsExpression(
                    generator.createPropertyAccess(
                      generator.createIdentifier("viewModel"),
                      generator.createIdentifier("spread")
                    ),
                    generator.createTypeReferenceNode(
                      generator.createIdentifier("Props")
                    )
                  )
                ),
              ]
            );

            const templateProperty = generator.createProperty(
              [createDecorator("Template")],
              [],
              generator.createIdentifier("template")
            );

            const spreadGetter = generator.createGetAccessor(
              [],
              [],
              generator.createIdentifier("spread"),
              [],
              undefined,
              generator.createBlock([], false)
            );

            assert.strictEqual(
              removeSpaces(
                expression.toString({
                  members: [templateProperty, spreadGetter],
                  componentContext: "viewModel",
                  newComponentContext: "",
                  disableTemplates: true,
                })
              ),
              removeSpaces(
                `<ng-container *ngTemplateOutlet="template; context:{p1:spread.p1,p2:spread.p2}"></ng-container>`
              )
            );
          });

          mocha.it("...{x, y}", function () {
            const expression = generator.createJsxSelfClosingElement(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("template")
              ),
              [],
              [
                generator.createJsxSpreadAttribute(
                  generator.createObjectLiteral(
                    [
                      generator.createPropertyAssignment(
                        generator.createIdentifier("x"),
                        generator.createIdentifier("_x")
                      ),
                      generator.createShorthandPropertyAssignment(
                        generator.createIdentifier("y")
                      ),
                    ],
                    false
                  )
                ),
              ]
            );

            const templateProperty = generator.createProperty(
              [createDecorator("Template")],
              [],
              generator.createIdentifier("template")
            );

            assert.strictEqual(
              removeSpaces(
                expression.toString({
                  members: [templateProperty],
                  componentContext: "viewModel",
                  newComponentContext: "",
                })
              ),
              removeSpaces(
                `<ng-container *ngTemplateOutlet="template; context:{x:_x,y:y}"></ng-container>`
              )
            );
          });

          mocha.it("...{x, y, ...getter}", function () {
            generator.createClassDeclaration(
              [createDecorator(Decorators.ComponentBindings)],
              [],
              generator.createIdentifier("Props"),
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
              ]
            );

            const expression = generator.createJsxSelfClosingElement(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("template")
              ),
              [],
              [
                generator.createJsxSpreadAttribute(
                  generator.createObjectLiteral(
                    [
                      generator.createShorthandPropertyAssignment(
                        generator.createIdentifier("y")
                      ),
                      generator.createSpreadAssignment(
                        generator.createPropertyAccess(
                          generator.createIdentifier("viewModel"),
                          generator.createIdentifier("spread")
                        )
                      ),
                    ],
                    false
                  )
                ),
              ]
            );

            const templateProperty = generator.createProperty(
              [createDecorator("Template")],
              [],
              generator.createIdentifier("template")
            );

            const spreadGetter = generator.createGetAccessor(
              [],
              [],
              generator.createIdentifier("spread"),
              [],
              generator.createTypeReferenceNode(
                generator.createIdentifier("Props")
              ),
              generator.createBlock([], false)
            );

            assert.strictEqual(
              removeSpaces(
                expression.toString({
                  members: [templateProperty, spreadGetter],
                  componentContext: "viewModel",
                  newComponentContext: "",
                })
              ),
              removeSpaces(
                `<ng-container *ngTemplateOutlet="template; context:{y:y, p1:spread.p1, p2:spread.p2}"></ng-container>`
              )
            );
          });

          mocha.it("...{x, y, ...restAttributes}", function () {
            const expression = generator.createJsxSelfClosingElement(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("template")
              ),
              [],
              [
                generator.createJsxSpreadAttribute(
                  generator.createObjectLiteral(
                    [
                      generator.createShorthandPropertyAssignment(
                        generator.createIdentifier("y")
                      ),
                      generator.createSpreadAssignment(
                        generator.createPropertyAccess(
                          generator.createIdentifier("viewModel"),
                          generator.createIdentifier("restAttributes")
                        )
                      ),
                    ],
                    false
                  )
                ),
              ]
            );

            const templateProperty = generator.createProperty(
              [createDecorator("Template")],
              [],
              generator.createIdentifier("template")
            );

            const restAttributes = generator.createGetAccessor(
              [],
              [],
              generator.createIdentifier("restAttributes"),
              [],
              undefined,
              generator.createBlock([], false)
            );

            assert.strictEqual(
              removeSpaces(
                expression.toString({
                  members: [templateProperty, restAttributes],
                  componentContext: "viewModel",
                  newComponentContext: "",
                })
              ),
              removeSpaces(
                `<ng-container *ngTemplateOutlet="template; context:{y:y}"></ng-container>`
              )
            );
          });
        }
      );

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
            ),
          ]
        );

        expression.addAttribute(
          new AngularDirective(
            new Identifier("*ngIf"),
            generator.createIdentifier("condition")
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
          removeSpaces(
            expression.toString({
              members: [templateProperty],
              componentContext: "viewModel",
              newComponentContext: "",
            })
          ),
          removeSpaces(`<ng-container *ngIf="condition">
                        <ng-container *ngTemplateOutlet="template; context:{a1: 'str',a2: 10}"></ng-container>
                    </ng-container>`)
        );
      });

      mocha.it("render slot if template is not exist", function () {
        const templateProperty = generator.createProperty(
          [createDecorator(Decorators.Template)],
          [],
          generator.createIdentifier("template")
        );

        const slotProperty = generator.createProperty(
          [createDecorator(Decorators.Slot)],
          [],
          generator.createIdentifier("children"),
          generator.SyntaxKind.QuestionToken
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
              generator.createBinary(
                generator.createPrefix(
                  generator.SyntaxKind.ExclamationToken,
                  generator.createIdentifier("template")
                ),
                generator.SyntaxKind.AmpersandAmpersandToken,
                generator.createPropertyAccess(
                  generator.createPropertyAccess(
                    generator.createIdentifier("viewModel"),
                    generator.createIdentifier("props")
                  ),
                  generator.createIdentifier("children")
                )
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(
          removeSpaces(
            expression.toString({
              members: [templateProperty, slotProperty],
              componentContext: "viewModel",
              newComponentContext: "",
            })
          ),
          removeSpaces(`
          <div>
            <ng-container *ngIf="!template">
              <div #slotChildren style="display:contents">
                <ng-container [ngTemplateOutlet]="dxchildren">
                </ng-container>
              </div>
            </ng-container>
          </div>`)
        );
      });

      mocha.describe("function->ng-template", function () {
        this.beforeEach(function () {
          generator.setContext({
            path: __filename,
            dirname: __dirname,
          });

          createComponent([
            generator.createProperty(
              [createDecorator(Decorators.Template)],
              [],
              generator.createIdentifier("template")
            ),
          ]);
        });

        this.afterEach(function () {
          generator.setContext(null);
        });

        const createElement = (parameter?: Parameter) =>
          generator.createJsxSelfClosingElement(
            generator.createIdentifier("BaseWidget"),
            undefined,
            [
              generator.createJsxAttribute(
                generator.createIdentifier("template"),
                generator.createJsxExpression(
                  undefined,
                  generator.createArrowFunction(
                    [],
                    undefined,
                    parameter ? [parameter] : [],
                    undefined,
                    generator.SyntaxKind.EqualsGreaterThanToken,
                    generator.createJsxSelfClosingElement(
                      generator.createIdentifier("div")
                    )
                  )
                )
              ),
            ]
          );

        mocha.it("w/o parameter", function () {
          const element = createElement();
          assert.strictEqual(
            removeSpaces(
              element.toString({
                members: [],
              })
            ),
            removeSpaces(`
              <dx-base-widget [template]="__template__generated" #basewidget1 style="display:contents">
                <ng-template #__template__generated>
                  <div ></div>
                </ng-template>
              </dx-base-widget>
              <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
            `)
          );
        });

        mocha.it("binding pattern parameter", function () {
          const element = createElement(
            generator.createParameter(
              [],
              [],
              undefined,
              generator.createObjectBindingPattern([
                generator.createBindingElement(
                  undefined,
                  undefined,
                  generator.createIdentifier("p1")
                ),
                generator.createBindingElement(
                  undefined,
                  generator.createIdentifier("p2"),
                  generator.createIdentifier("myP2")
                ),
              ]),
              undefined
            )
          );
          assert.strictEqual(
            removeSpaces(
              element.toString({
                members: [],
              })
            ),
            removeSpaces(`
              <dx-base-widget [template]="__template__generated" #basewidget1 style="display:contents">
                <ng-template #__template__generated let-p1="p1" let-myP2="p2">
                  <div ></div>
                </ng-template>
              </dx-base-widget>
              <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
            `)
          );
        });

        mocha.it("parameter with literal type node", function () {
          const element = createElement(
            generator.createParameter(
              [],
              [],
              undefined,
              generator.createIdentifier("props"),
              undefined,
              generator.createTypeLiteralNode([
                generator.createPropertySignature(
                  [],
                  generator.createIdentifier("p1"),
                  undefined,
                  generator.createKeywordTypeNode("string")
                ),
                generator.createPropertySignature(
                  [],
                  generator.createIdentifier("p2"),
                  undefined,
                  generator.createKeywordTypeNode("number")
                ),
              ])
            )
          );
          assert.strictEqual(
            removeSpaces(
              element.toString({
                members: [],
              })
            ),
            removeSpaces(`
              <dx-base-widget [template]="__template__generated" #basewidget1 style="display:contents">
                <ng-template #__template__generated let-p1="p1" let-p2="p2">
                  <div ></div>
                </ng-template>
              </dx-base-widget>
              <ng-content*ngTemplateOutlet="basewidget1?.widgetTemplate"></ng-content>
            `)
          );
        });

        mocha.it("can't parse parameter without type", function () {
          const element = createElement(
            generator.createParameter(
              [],
              [],
              undefined,
              generator.createIdentifier("props")
            )
          );

          try {
            removeSpaces(element.toString());
          } catch (e) {
            assert.strictEqual(
              e,
              "Can't convert function parameter props into template parameter: Use BindingPattern or TypeLiteralNode"
            );
          }
        });
      });
    });

    mocha.describe("Parse Map function", function () {
      mocha.it(".map((item)=><div>) -> *ngFor", function () {
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
          `<ng-container *ngFor="let items of viewModel.items"><div ></div></ng-container>`
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
          `<ng-container *ngFor="let items of viewModel.items">{{items}}</ng-container>`
        );
      });

      mocha.it(".map((item, index)=><div>) -> *ngFor", function () {
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
          `<ng-container *ngFor="let items of viewModel.items;index as i"><div ></div></ng-container>`
        );
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

      mocha.it(
        "map with key attribute should generate trackBy function",
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

          const options: toStringOptions = {
            members: [],
          };

          assert.strictEqual(
            expression.children[0].toString(options),
            `<ng-container *ngFor="let item of viewModel.items;trackBy: _trackBy_viewModel_items_0"><div ></div></ng-container>`
          );
          const trackByAttrs = options.trackBy!;
          assert.strictEqual(trackByAttrs.length, 1);
          assert.strictEqual(trackByAttrs[0].toString(), "");
          assert.strictEqual(
            getResult(trackByAttrs[0].getTrackByDeclaration()),
            getResult(`_trackBy_viewModel_items_0(_index: number, item: any){
                    return item.id;
                }`)
          );
        }
      );

      mocha.it("generate trackByName from complex expression", function () {
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
                  generator.createParen(
                    generator.createBinary(
                      generator.createPropertyAccess(
                        generator.createIdentifier("viewModel"),
                        generator.createIdentifier("items")
                      ),
                      "||",
                      generator.createArrayLiteral([], false)
                    )
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

        const options: toStringOptions = {
          members: [],
        };

        assert.strictEqual(
          expression.children[0].toString(options),
          `<ng-container *ngFor="let item of (viewModel.items || []);trackBy: _trackBy_viewModel_items_0"><div ></div></ng-container>`
        );
        const trackByAttrs = options.trackBy!;
        assert.strictEqual(trackByAttrs.length, 1);
        assert.strictEqual(trackByAttrs[0].toString(), "");
        assert.strictEqual(
          getResult(trackByAttrs[0].getTrackByDeclaration()),
          getResult(`_trackBy_viewModel_items_0(_index: number, item: any){
                    return item.id;
                }`)
        );
      });

      mocha.it("map - can use prop in key", function () {
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
                            generator.createElementAccess(
                              generator.createIdentifier("item"),
                              generator.createPropertyAccess(
                                generator.createPropertyAccess(
                                  generator.createIdentifier("viewModel"),
                                  generator.createIdentifier("props")
                                ),
                                generator.createIdentifier("keyExpr")
                              )
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

        const keyExpr = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          undefined,
          generator.createIdentifier("keyExpr")
        );

        const options: toStringOptions = {
          members: [keyExpr],
          componentContext: "viewModel",
          newComponentContext: "viewModel",
        };

        assert.strictEqual(
          expression.children[0].toString(options),
          `<ng-container *ngFor="let item of viewModel.items;trackBy: _trackBy_viewModel_items_0"><div ></div></ng-container>`
        );
        const trackByAttrs = options.trackBy!;
        assert.strictEqual(trackByAttrs.length, 1);
        assert.strictEqual(trackByAttrs[0].toString(), "");
        assert.strictEqual(
          getResult(trackByAttrs[0].getTrackByDeclaration()),
          getResult(`_trackBy_viewModel_items_0(_index: number, item: any){
                    return item[this.keyExpr];
                }`)
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

        const options: toStringOptions = {
          members: [],
        };

        assert.strictEqual(
          expression.toString(options),
          `<ng-container *ngFor="let item of viewModel.items;trackBy: _trackBy_viewModel_items_1"><div ><ng-container *ngFor="let _ of item;index as i;trackBy: _trackBy_item_0"><div ></div></ng-container></div></ng-container>`
        );
        const trackByAttrs = options.trackBy!;
        assert.strictEqual(trackByAttrs.length, 2);
        assert.strictEqual(
          getResult(trackByAttrs[1].getTrackByDeclaration()),
          getResult(`_trackBy_viewModel_items_1(_index: number, item: any){
                    return item.id;
                }`),
          "external map trackBy function"
        );

        assert.strictEqual(
          getResult(trackByAttrs[0].getTrackByDeclaration()),
          getResult(`_trackBy_item_0(i: number, _: any){
                    return i;
                }`),
          "internal map trackBy function"
        );
      });

      mocha.it("m.map(a=>a.map()=><div>)", function () {
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
                    insideExpression
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        ).children[0] as JsxExpression;

        const options: toStringOptions = {
          members: [],
        };

        assert.strictEqual(
          removeSpaces(expression.toString(options)),
          removeSpaces(`
            <ng-container *ngFor="let item of viewModel.items">
              <ng-container *ngFor="let _ of item;index as i;trackBy: _trackBy_item_0">
                <div ></div>
              </ng-container>
            </ng-container>`)
        );
        const trackByAttrs = options.trackBy!;
        assert.strictEqual(trackByAttrs.length, 1);

        assert.strictEqual(
          getResult(trackByAttrs[0].getTrackByDeclaration()),
          getResult(`_trackBy_item_0(i: number, _: any){
                    return i;
                }`),
          "internal map trackBy function"
        );
      });

      mocha.it("map with conditional rendering", function () {
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
                    generator.createConditional(
                      generator.createIdentifier("condition"),
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
                      ),
                      generator.createStringLiteral("else")
                    )
                  ),
                ]
              )
            ),
          ],
          generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        const options: toStringOptions = {
          members: [],
        };

        assert.strictEqual(
          removeSpaces(expression.children[0].toString(options)),
          removeSpaces(`<ng-container *ngFor="let item of viewModel.items;trackBy: _trackBy_viewModel_items_0">
                        <div *ngIf="condition"></div>
                        <ng-container *ngIf="!(condition)">else</ng-container>
                    </ng-container>`)
        );
        const trackByAttrs = options.trackBy!;
        assert.strictEqual(trackByAttrs.length, 1);
        assert.strictEqual(trackByAttrs[0].toString(), "");
        assert.strictEqual(
          getResult(trackByAttrs[0].getTrackByDeclaration()),
          getResult(`_trackBy_viewModel_items_0(_index: number, item: any){
                    return item.id;
                }`)
        );
      });

      mocha.it("Not function in the map", function () {
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
            [generator.createNull()]
          )
        );

        assert.strictEqual(expression.toString(), `viewModel.items.map(null)`);
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

        assert.strictEqual(
          removeSpaces(expression.children[0].toString()),
          removeSpaces(`<ng-container *ngFor="let item_0 of viewModel.items">
                    <div>
                    {{item_0.p1}}
                    {{item_0.p2}}
                    </div>
                </ng-container>`)
        );
      });
    });

    mocha.describe("View Function", function () {
      this.beforeEach(function () {
        generator.setContext({});

        this.block = generator.createBlock(
          [
            generator.createReturn(
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("div")
              )
            ),
          ],
          false
        );
      });
      this.afterEach(function () {
        generator.setContext(null);
      });

      mocha.it(
        "Function that returns JSX can be converted to template",
        function () {
          const expression = generator.createFunctionDeclaration(
            [],
            [],
            "",
            generator.createIdentifier("View"),
            [],
            [],
            undefined,
            this.block
          );

          assert.strictEqual(expression.toString(), "");
          assert.strictEqual(expression.getTemplate(), "<div ></div>");
        }
      );

      mocha.it("Function without return statement", function () {
        const expression = generator.createFunctionDeclaration(
          [],
          [],
          "",
          generator.createIdentifier("View"),
          [],
          [],
          undefined,
          generator.createBlock([], false)
        );

        assert.strictEqual(expression.getTemplate(), "");
      });

      mocha.it("Rename viewModel identifier", function () {
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
              generator.createIdentifier("passedViewModel"),
              undefined,
              undefined,
              undefined
            ),
          ],
          undefined,
          generator.createBlock(
            [
              generator.createReturn(
                generator.createJsxElement(
                  generator.createJsxOpeningElement(
                    generator.createIdentifier("span"),
                    undefined,
                    generator.createJsxAttributes([
                      generator.createJsxAttribute(
                        generator.createIdentifier("attr"),
                        generator.createPropertyAccess(
                          generator.createIdentifier("passedViewModel"),
                          generator.createIdentifier("value")
                        )
                      ),
                    ])
                  ),
                  [
                    generator.createJsxExpression(
                      undefined,
                      generator.createPropertyAccess(
                        generator.createIdentifier("passedViewModel"),
                        generator.createIdentifier("text")
                      )
                    ),
                  ],
                  generator.createJsxClosingElement(
                    generator.createIdentifier("span")
                  )
                )
              ),
            ],
            false
          )
        );

        assert.strictEqual(
          expression.getTemplate({
            members: [],
            newComponentContext: "_viewModel",
          }),
          `<span [attr]="_viewModel.value">{{_viewModel.text}}</span>`
        );
      });

      mocha.it("Function without JSX is generated", function () {
        const expression = generator.createFunctionDeclaration(
          [],
          [],
          "",
          generator.createIdentifier("View"),
          [],
          [],
          undefined,
          generator.createBlock([], false)
        );

        assert.strictEqual(
          getResult(expression.toString()),
          getResult("function View(){}")
        );
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

      mocha.it(
        "Arrow function without JSX behaves as usual function",
        function () {
          const expression = generator.createArrowFunction(
            [],
            [],
            [],
            undefined,
            generator.SyntaxKind.EqualsGreaterThanToken,
            generator.createTrue()
          );

          assert.strictEqual(expression.isJsx(), false);
          assert.strictEqual(expression.getTemplate(), "{{true}}");
          assert.strictEqual(
            getResult(expression.toString()),
            getResult("()=>true")
          );
        }
      );

      mocha.it("Add arrow function in context", function () {
        const functionDeclaration = generator.createArrowFunction(
          [],
          [],
          [],
          undefined,
          generator.SyntaxKind.EqualsGreaterThanToken,
          this.block
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

        assert.strictEqual(
          generator.getContext().viewFunctions!["viewFunction"],
          functionDeclaration
        );
        assert.strictEqual(expression.toString(), "");
      });

      mocha.it(
        "Declaration list with jsx and noJsx - skip only jsx variables",
        function () {
          const functionDeclaration = generator.createArrowFunction(
            [],
            [],
            [],
            undefined,
            generator.SyntaxKind.EqualsGreaterThanToken,
            this.block
          );

          const expression = generator.createVariableDeclarationList(
            [
              generator.createVariableDeclaration(
                generator.createIdentifier("viewFunction"),
                undefined,
                functionDeclaration
              ),
              generator.createVariableDeclaration(
                generator.createIdentifier("a"),
                undefined,
                generator.createNumericLiteral("10")
              ),
            ],
            generator.SyntaxKind.ConstKeyword
          );

          assert.strictEqual(expression.toString(), "const a=10");
        }
      );

      mocha.it("Can use variables in view function", function () {
        const block = generator.createBlock(
          [
            generator.createVariableStatement(
              [],
              generator.createVariableDeclarationList(
                [
                  generator.createVariableDeclaration(
                    generator.createIdentifier("v"),
                    undefined,
                    generator.createNumericLiteral("10")
                  ),
                ],
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
                  ),
                ]
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
          expression.getTemplate({
            members: [],
          }),
          `<div [v]="10"></div>`
        );
      });

      mocha.it("Skip type casting in view", function () {
        const block = generator.createBlock(
          [
            generator.createReturn(
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("div"),
                undefined,
                [
                  generator.createJsxAttribute(
                    generator.createIdentifier("v"),
                    generator.createAsExpression(
                      generator.createIdentifier("value"),
                      generator.createKeywordTypeNode("number")
                    )
                  ),
                ]
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

        assert.strictEqual(
          expression.getTemplate({
            members: [],
          }),
          `<div [v]="value"></div>`
        );
      });

      mocha.it("Can decomposite component", function () {
        const block = generator.createBlock(
          [
            generator.createReturn(
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("div"),
                undefined,
                [
                  generator.createJsxAttribute(
                    generator.createIdentifier("v"),
                    generator.createIdentifier("height")
                  ),
                ]
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
              generator.createObjectBindingPattern([
                generator.createBindingElement(
                  undefined,
                  undefined,
                  generator.createIdentifier("height"),
                  undefined
                ),
              ]),
              undefined,
              undefined,
              undefined
            ),
          ],
          undefined,
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
        assert.strictEqual(
          expression.getTemplate({
            members: [member],
            newComponentContext: "",
          }),
          `<div [v]="__height"></div>`
        );
      });

      mocha.it("Can decomposite component - props", function () {
        const block = generator.createBlock(
          [
            generator.createReturn(
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("div"),
                undefined,
                [
                  generator.createJsxAttribute(
                    generator.createIdentifier("v"),
                    generator.createPropertyAccess(
                      generator.createIdentifier("props"),
                      generator.createIdentifier("height")
                    )
                  ),
                ]
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
              generator.createObjectBindingPattern([
                generator.createBindingElement(
                  undefined,
                  undefined,
                  generator.createIdentifier("props"),
                  undefined
                ),
              ]),
              undefined,
              undefined,
              undefined
            ),
          ],
          undefined,
          block
        );

        const member = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("height")
        );

        assert.strictEqual(expression.toString(), "");
        assert.strictEqual(
          expression.getTemplate({
            members: [member],
          }),
          `<div [v]="height"></div>`
        );
      });

      mocha.it("Can use jsx variables in view function", function () {
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
                    generator.createIdentifier("v")
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
          expression.getTemplate({
            members: [],
          }),
          `<div ><ng-container *ngTemplateOutlet="v"></ng-container></div>`
        );
      });

      mocha.it("Can use jsx variable twice", function () {
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
                        <span *ngIf="c1"></span>
                        <span *ngIf="c2"></span>
                    </div>`)
        );
      });

      mocha.it("Can use jsx variable with condition", function () {
        const block = generator.createBlock(
          [
            generator.createVariableStatement(
              [],
              generator.createVariableDeclarationList(
                [
                  generator.createVariableDeclaration(
                    generator.createIdentifier("v"),
                    undefined,
                    generator.createBinary(
                      generator.createIdentifier("c1"),
                      generator.SyntaxKind.AmpersandAmpersandToken,
                      generator.createJsxSelfClosingElement(
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
                        <span *ngIf="(c1)&&c2"></span>
                    </div>`)
        );
      });

      mocha.it("Can store map in variable", function () {
        const block = generator.createBlock(
          [
            generator.createVariableStatement(
              [],
              generator.createVariableDeclarationList(
                [
                  generator.createVariableDeclaration(
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
                    generator.createIdentifier("v")
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
          removeSpaces(`<div>
                        <ng-container *ngFor="let items of viewModel.items">
                            <div ></div>
                        </ng-container>
                    </div>`)
        );
      });

      mocha.it(
        "Convert to template function with ternary operator",
        function () {
          this.block.statements = [
            generator.createReturn(
              generator.createConditional(
                generator.createTrue(),
                generator.createJsxSelfClosingElement(
                  generator.createIdentifier("div")
                ),
                generator.createJsxSelfClosingElement(
                  generator.createIdentifier("span")
                )
              )
            ),
          ];

          const expression = generator.createFunctionDeclaration(
            [],
            [],
            "",
            generator.createIdentifier("View"),
            [],
            [],
            undefined,
            this.block
          );

          assert.strictEqual(expression.toString(), "");
          assert.strictEqual(
            removeSpaces(expression.getTemplate()),
            removeSpaces(`
                    <div *ngIf="true"></div>
                    <span *ngIf="!(true)"></span>
                `)
          );
        }
      );
    });
  });

  mocha.describe("Decorators", function () {
    mocha.it("OneWay -> Input", function () {
      const decorator = createDecorator(Decorators.OneWay);

      assert.strictEqual(decorator.name, Decorators.OneWay);
      assert.strictEqual(decorator.toString(), "@Input()");
    });

    mocha.it("TwoWay -> Output", function () {
      const decorator = createDecorator(Decorators.TwoWay);

      assert.strictEqual(decorator.toString(), "@Input()");
    });

    mocha.it("Event -> Output", function () {
      const decorator = createDecorator(Decorators.Event);

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
      const decorator = createDecorator(Decorators.Ref);

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
          undefined,
          generator.createBlock(
            [
              generator.createReturn(
                generator.createJsxSelfClosingElement(
                  generator.createIdentifier("div")
                )
              ),
            ],
            false
          )
        );

        const decorator = generator.createDecorator(
          generator.createCall(
            generator.createIdentifier("Component"),
            [],
            [
              generator.createObjectLiteral(
                [
                  generator.createPropertyAssignment(
                    generator.createIdentifier("view"),
                    generator.createIdentifier("viewFunction")
                  ),
                ],
                false
              ),
            ]
          )
        );

        assert.strictEqual(
          decorator.toString(),
          `@Component({template:\`<ng-template #widgetTemplate><div ></div></ng-template>\`})`
        );
      });

      mocha.it("Add templates for variable with element", function () {
        generator.createFunctionDeclaration(
          [],
          [],
          "",
          generator.createIdentifier("viewFunction"),
          [],
          [],
          undefined,
          generator.createBlock(
            [
              generator.createReturn(
                generator.createJsxSelfClosingElement(
                  generator.createIdentifier("div")
                )
              ),
            ],
            false
          )
        );

        const decorator = generator.createDecorator(
          generator.createCall(
            generator.createIdentifier("Component"),
            [],
            [
              generator.createObjectLiteral(
                [
                  generator.createPropertyAssignment(
                    generator.createIdentifier("view"),
                    generator.createIdentifier("viewFunction")
                  ),
                ],
                false
              ),
            ]
          )
        );

        assert.strictEqual(
          removeSpaces(
            decorator.toString({
              members: [],
              variables: {
                v1: generator.createJsxSelfClosingElement(
                  generator.createIdentifier("span")
                ),
                v2: generator.createIdentifier("id"),
              },
            })
          ),
          removeSpaces(
            "@Component({template:`<ng-template#widgetTemplate><div>"+
            "</div><ng-template#v1><span></span></ng-template>"+
            "</ng-template>" +
              "`})"
          )
        );
      });

      mocha.it("Add templates for variable with element in paren", function () {
        generator.createFunctionDeclaration(
          [],
          [],
          "",
          generator.createIdentifier("viewFunction"),
          [],
          [],
          undefined,
          generator.createBlock(
            [
              generator.createReturn(
                generator.createJsxSelfClosingElement(
                  generator.createIdentifier("div")
                )
              ),
            ],
            false
          )
        );

        const decorator = generator.createDecorator(
          generator.createCall(
            generator.createIdentifier("Component"),
            [],
            [
              generator.createObjectLiteral(
                [
                  generator.createPropertyAssignment(
                    generator.createIdentifier("view"),
                    generator.createIdentifier("viewFunction")
                  ),
                ],
                false
              ),
            ]
          )
        );

        assert.strictEqual(
          removeSpaces(
            decorator.toString({
              members: [],
              variables: {
                v1: generator.createParen(
                  generator.createJsxSelfClosingElement(
                    generator.createIdentifier("span")
                  )
                ),
              },
            })
          ),
          removeSpaces(
            "@Component({template:`<ng-template#widgetTemplate>"+
            "<div></div>"+
            "<ng-template#v1><span></span></ng-template></ng-template>`})"
          )
        );
      });

      mocha.it("should remove all declaration parameters", function () {
        const parameters: Required<
          { [key in keyof ComponentParameters]: boolean }
        > = {
          components: true,
          name: true,
          isSVG: true,
          view: true,
          defaultOptionRules: true,
          jQuery: true,
        };

        const decorator = generator.createDecorator(
          generator.createCall(
            generator.createIdentifier("Component"),
            [],
            [
              generator.createObjectLiteral(
                Object.keys(parameters).map((name) =>
                  generator.createPropertyAssignment(
                    generator.createIdentifier(name),
                    generator.createIdentifier(name)
                  )
                ),
                false
              ),
            ]
          )
        );

        assert.strictEqual(decorator.toString(), `@Component({})`);
      });

      mocha.describe("CompileSpreadAttributes", function () {
        const createView = (spreadExpression: Expression) =>
          generator.createVariableDeclaration(
            generator.createIdentifier("view"),
            undefined,
            generator.createArrowFunction(
              [],
              [],
              [
                generator.createParameter(
                  [],
                  [],
                  undefined,
                  generator.createIdentifier("viewModel"),
                  undefined,
                  generator.createTypeReferenceNode(
                    generator.createIdentifier("BaseWidget")
                  )
                ),
              ],
              undefined,
              generator.SyntaxKind.EqualsGreaterThanToken,
              generator.createJsxSelfClosingElement(
                generator.createIdentifier("div"),
                undefined,
                [
                  generator.createJsxAttribute(
                    generator.createIdentifier("ref"),
                    generator.createIdentifier("ref")
                  ),
                  generator.createJsxSpreadAttribute(spreadExpression),
                ]
              )
            )
          );

        mocha.it("...prop", function () {
          const prop = generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("attr")
          );
          createView(
            generator.createPropertyAccess(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("props")
              ),
              generator.createIdentifier("attr")
            )
          );
          const component = createComponent([prop], {
            view: generator.createIdentifier("view"),
          }) as AngularComponent;

          const ngOnChanges: string[] = [];
          component.compileSpreadAttributes(ngOnChanges, [], [], []);

          assert.strictEqual(
            getResult(ngOnChanges.join(";\n")),
            getResult(`
              if(["attr"].some(d=>changes[d] && !changes[d].firstChange)){
                    this.scheduledApplyAttributes = true;
              }`)
          );
        });

        mocha.it("...getter", function () {
          const prop = generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("prop")
          );
          const getter = generator.createGetAccessor(
            [],
            [],
            generator.createIdentifier("attr"),
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
                    generator.createIdentifier("prop")
                  )
                ),
              ],
              false
            )
          );
          createView(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("attr")
            )
          );
          const component = createComponent([prop, getter], {
            view: generator.createIdentifier("view"),
          }) as AngularComponent;

          const ngOnChanges: string[] = [];
          component.compileSpreadAttributes(ngOnChanges, [], [], []);

          assert.strictEqual(
            getResult(ngOnChanges.join(";\n")),
            getResult(`
              if(["prop"].some(d=>changes[d] && !changes[d].firstChange)){
                    this.scheduledApplyAttributes = true;
              }`)
          );
        });

        mocha.it("...method", function () {
          const prop = generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("prop")
          );
          const method = generator.createMethod(
            [],
            [],
            undefined,
            generator.createIdentifier("attr"),
            undefined,
            undefined,
            [],
            undefined,
            generator.createBlock(
              [
                generator.createVariableDeclaration(
                  generator.createObjectBindingPattern([
                    generator.createBindingElement(
                      undefined,
                      undefined,
                      generator.createIdentifier("prop")
                    ),
                  ]),
                  undefined,
                  generator.createThis()
                ),
              ],
              false
            )
          );
          createView(
            generator.createCall(
              generator.createPropertyAccess(
                generator.createIdentifier("viewModel"),
                generator.createIdentifier("attr")
              ),
              undefined,
              []
            )
          );
          const component = createComponent([prop, method], {
            view: generator.createIdentifier("view"),
          }) as AngularComponent;

          const ngOnChanges: string[] = [];
          component.compileSpreadAttributes(ngOnChanges, [], [], []);

          assert.strictEqual(
            getResult(ngOnChanges.join(";\n")),
            getResult(`
              if(["prop"].some(d=>changes[d] && !changes[d].firstChange)){
                    this.scheduledApplyAttributes = true;
              }`)
          );
        });

        mocha.it("...internalState", function () {
          const state = generator.createProperty(
            [createDecorator(Decorators.InternalState)],
            [],
            generator.createIdentifier("attr")
          );
          createView(
            generator.createPropertyAccess(
              generator.createIdentifier("viewModel"),
              generator.createIdentifier("attr")
            )
          );
          const component = createComponent([state], {
            view: generator.createIdentifier("view"),
          }) as AngularComponent;

          const ngOnChanges: string[] = [];
          component.compileSpreadAttributes(ngOnChanges, [], [], []);

          const internalStateSetter = component.members.find(
            (m) => m.name.toString() === `_${state.name}`
          ) as SetAccessor;

          assert.strictEqual(ngOnChanges.join(";\n"), "");

          assert.strictEqual(
            getResult(internalStateSetter.body?.toString() || ""),
            getResult(`{
              this.attr=attr;
              this._detectChanges();
              this.scheduledApplyAttributes = this;
            }`)
          );
        });
      });
    });
  });

  mocha.describe("ComponentBindings", function () {
    this.beforeEach(function () {
      generator.setContext({});
    });
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
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("number"),
            generator.createNumericLiteral("10")
          ),
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p2"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("number"),
            generator.createNumericLiteral("11")
          ),
        ]
      );

      assert.strictEqual(
        getResult(bindings.toString()),
        getResult(`
                import {Injectable, Input} from "@angular/core"
                @Injectable()
                export default class ComponentInput {
                    @Input()
                    p1?: number = 10;
                    @Input()
                    p2?: number = 11;
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
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("number"),
            generator.createNumericLiteral("10")
          ),
        ]
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

      const child = generator.createClassDeclaration(
        [createDecorator("ComponentBindings")],
        ["export", "default"],
        generator.createIdentifier("Child"),
        [],
        [heritageClause],
        []
      );

      assert.strictEqual(
        getResult(child.toString()),
        getResult(`import {Injectable} from "@angular/core"
                   @Injectable()
                   export default class Child extends Base {}`)
      );
    });

    mocha.it("Ref Prop generates ViewChild", function () {
      const property = generator.createProperty(
        [createDecorator(Decorators.Ref)],
        [],
        generator.createIdentifier("host"),
        generator.SyntaxKind.QuestionToken,
        generator.createKeywordTypeNode("HTMLDivElement"),
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
        property.toString(),
        `@ViewChild("hostLink", {static: false}) host?:ElementRef<HTMLDivElement>`
      );
    });

    mocha.it("Ref Prop getter type is not element", function () {
      const property = generator.createProperty(
        [createDecorator(Decorators.Ref)],
        [],
        generator.createIdentifier("host"),
        generator.SyntaxKind.QuestionToken,
        generator.createKeywordTypeNode("NotElement")
      );

      assert.strictEqual(
        property.getter(generator.SyntaxKind.ThisKeyword),
        "this.host"
      );
    });

    mocha.it(
      "Template property with exclamation token should ignore token",
      function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.Template)],
          [],
          generator.createIdentifier("template"),
          generator.SyntaxKind.ExclamationToken,
          generator.createKeywordTypeNode(generator.SyntaxKind.AnyKeyword)
        );

        assert.strictEqual(
          property.toString(),
          " @Input() template:TemplateRef<any> | null = null"
        );
      }
    );

    mocha.it("Event Prop generates Event EventEmitter", function () {
      const property = generator.createProperty(
        [createDecorator(Decorators.Event)],
        [],
        generator.createIdentifier("onClick"),
        generator.SyntaxKind.QuestionToken,
        undefined,
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
        getResult(property.toString()),
        getResult(`
          @Output() onClick:EventEmitter<any> = new EventEmitter();
        `)
      );
    });

    mocha.it("Event Prop with type FunctionNodeType", function () {
      const property = generator.createProperty(
        [createDecorator(Decorators.Event)],
        [],
        generator.createIdentifier("onClick"),
        generator.SyntaxKind.QuestionToken,
        generator.createFunctionTypeNode(
          undefined,
          [
            generator.createParameter(
              [],
              [],
              undefined,
              generator.createIdentifier("a"),
              generator.SyntaxKind.QuestionToken,
              generator.createKeywordTypeNode("string"),
              undefined
            ),
            generator.createParameter(
              [],
              [],
              undefined,
              generator.createIdentifier("b"),
              undefined,
              generator.createKeywordTypeNode("number"),
              undefined
            ),
          ],
          generator.createKeywordTypeNode("any")
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
        getResult(property.toString()),
        getResult(`
          @Output() onClick:EventEmitter<string|undefined,number> = new EventEmitter();
          `)
      );
    });

    mocha.it(
      "Event Prop with type FunctionNodeType without parameters",
      function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.Event)],
          [],
          generator.createIdentifier("onClick"),
          generator.SyntaxKind.QuestionToken,
          generator.createFunctionTypeNode(
            undefined,
            [],
            generator.createKeywordTypeNode("any")
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
          getResult(property.toString()),
          getResult(`
            @Output() onClick:EventEmitter<void> = new EventEmitter();
          `)
        );
      }
    );

    mocha.it("Generate change for TwoWay prop with type", function () {
      const bindings = generator.createClassDeclaration(
        [createDecorator("ComponentBindings")],
        ["export", "default"],
        generator.createIdentifier("ComponentInput"),
        [],
        [],
        [
          generator.createProperty(
            [createDecorator(Decorators.TwoWay)],
            [],
            generator.createIdentifier("p1"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("number"),
            generator.createNumericLiteral("10")
          ),
        ]
      );

      assert.strictEqual(bindings.members.length, 2);
      assert.strictEqual(
        getResult(bindings.members[1].toString()),
        getResult(`
          @Output() p1Change:EventEmitter<number|undefined> = new EventEmitter();
        `)
      );
    });

    mocha.it("TwoWay without type", function () {
      const property = generator.createProperty(
        [createDecorator(Decorators.TwoWay)],
        [],
        generator.createIdentifier("pressed"),
        generator.SyntaxKind.QuestionToken,
        undefined,
        generator.createFalse()
      );

      assert.strictEqual(
        getResult(property.toString()),
        getResult(`@Input()
                  pressed?:boolean = false;`)
      );
    });

    mocha.it("TwoWay without type and initializer", function () {
      const property = generator.createProperty(
        [createDecorator(Decorators.TwoWay)],
        [],
        generator.createIdentifier("pressed"),
        generator.SyntaxKind.QuestionToken
      );

      assert.strictEqual(
        getResult(property.toString()),
        getResult(`@Input() pressed?:any`)
      );
    });

    mocha.it("@Slot prop should generate getter", function () {
      const property = generator.createProperty(
        [createDecorator("Slot")],
        [],
        generator.createIdentifier("name"),
        generator.SyntaxKind.QuestionToken,
        undefined,
        generator.createFalse()
      );

      assert.strictEqual(
        getResult(property.toString()),
        getResult(`
                __slotName?: ElementRef<HTMLDivElement>;

                get name(){
                  const childNodes =  this.__slotName?.nativeElement?.childNodes;
                  return childNodes && childNodes.length > 2
                }
            `)
      );
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

      assert.strictEqual(
        property.toString(),
        " @Input() name?:TemplateRef<any> | null = null"
      );
    });

    mocha.it("get prop with same name in get accessor", function () {
      const property = generator.createGetAccessor(
        [],
        [],
        generator.createIdentifier("name"),
        [],
        undefined,
        generator.createBlock(
          [
            generator.createPropertyAccess(
              generator.createPropertyAccess(
                generator.createThis(),
                generator.createIdentifier("props")
              ),
              generator.createIdentifier("name")
            ),
          ],
          false
        )
      );
      property.prefix = "_";

      const prop = generator
        .createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("name")
        )
        .inherit();

      assert.strictEqual(
        getResult(
          property.toString({
            members: [property, prop],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          })
        ),
        getResult("get _name(): any{this.name}")
      );
    });
  });

  mocha.describe("Angular Component", function () {
    mocha.it("Calculate Selector", function () {
      const decorator = createComponentDecorator({});
      const component = generator.createComponent(
        decorator,
        [],
        generator.createIdentifier("BaseWidget"),
        [],
        [],
        []
      );

      assert.strictEqual(component.selector, "dx-base-widget");
      assert.strictEqual(
        decorator.toString(),
        `@Component({selector:"dx-base-widget",changeDetection:ChangeDetectionStrategy.OnPush})`
      );
    });

    mocha.describe("Imports", function () {
      mocha.it("Empty component", function () {
        const component = createComponent() as AngularComponent;
        assert.strictEqual(
          getResult(component.compileImports()),
          getResult(
            `import { Component, NgModule } from "@angular/core"; import {CommonModule} from "@angular/common"`
          )
        );
      });

      mocha.it("Has OneWay property - Input", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p")
          ),
        ]) as AngularComponent;
        assert.strictEqual(
          getResult(component.compileImports()),
          getResult(
            `import { Component, NgModule, Input } from "@angular/core"; import {CommonModule} from "@angular/common"`
          )
        );
      });

      mocha.it("Has Template property - Input, TemplateRef", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator("Template")],
            [],
            generator.createIdentifier("p")
          ),
        ]) as AngularComponent;
        assert.strictEqual(
          getResult(component.compileImports()),
          getResult(
            `import { Component, NgModule, Input, TemplateRef } from "@angular/core"; import {CommonModule} from "@angular/common"`
          )
        );
      });

      mocha.it(
        "Has TwoWay property - Input, Output, EventEmitter",
        function () {
          const component = createComponent([
            generator.createProperty(
              [createDecorator(Decorators.TwoWay)],
              [],
              generator.createIdentifier("p")
            ),
          ]) as AngularComponent;
          assert.strictEqual(
            getResult(component.compileImports()),
            getResult(
              `import { Component, NgModule, Input, Output, EventEmitter } from "@angular/core"; import {CommonModule} from "@angular/common"`
            )
          );
        }
      );

      mocha.it("Import should not have duplicates", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p")
          ),
          generator.createProperty(
            [createDecorator(Decorators.TwoWay)],
            [],
            generator.createIdentifier("p")
          ),
        ]) as AngularComponent;
        assert.strictEqual(
          getResult(component.compileImports()),
          getResult(
            `import { Component, NgModule, Input, Output, EventEmitter } from "@angular/core"; import {CommonModule} from "@angular/common"`
          )
        );
      });

      mocha.it("Has Event property - Output, EventEmitter", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.Event)],
            [],
            generator.createIdentifier("p")
          ),
        ]) as AngularComponent;
        assert.strictEqual(
          getResult(component.compileImports()),
          getResult(
            `import { Component, NgModule, Output, EventEmitter } from "@angular/core"; import {CommonModule} from "@angular/common"`
          )
        );
      });

      mocha.it("Has Ref property - ViewChild, ElementRef", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.Ref)],
            [],
            generator.createIdentifier("p")
          ),
        ]) as AngularComponent;
        assert.strictEqual(
          getResult(component.compileImports()),
          getResult(
            `import { Component, NgModule, ViewChild, ElementRef } from "@angular/core"; import {CommonModule} from "@angular/common"`
          )
        );
      });
    });

    mocha.it("generate component skeleton", function () {
      const component = generator.createComponent(
        createComponentDecorator({}),
        [
          generator.SyntaxKind.ExportKeyword,
          generator.SyntaxKind.DefaultKeyword,
        ],
        generator.createIdentifier("BaseWidget"),
        [],
        [],
        []
      );
      assert.strictEqual(
        getResult(component.toString()),
        getResult(`
                import {Component,NgModule,ChangeDetectionStrategy,ChangeDetectorRef,ViewContainerRef,Renderer2,ViewRef,ViewChild,TemplateRef} from "@angular/core";
                import {CommonModule} from "@angular/common";

                ${component.decorator}
                export default class BaseWidget {
                    get __restAttributes(): any{
                        return {}
                    }
                    _detectChanges(): void {
                      setTimeout(() => {
                        if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
                          this.changeDetection.detectChanges();
                      });
                    }
                    @ViewChild('widgetTemplate', { static: true }) widgetTemplate!: TemplateRef<any>;
                    constructor(
                      private changeDetection: ChangeDetectorRef,
                      private renderer: Renderer2,
                      private viewContainerRef: ViewContainerRef) {}
                }

                @NgModule({
                    declarations: [BaseWidget],
                    imports: [
                        CommonModule
                    ],
                    exports: [BaseWidget]
                })
                export class DxBaseWidgetModule {}
                export { BaseWidget as DxBaseWidgetComponent }
            `)
      );
    });

    mocha.it(
      "generate component skeleton with extends of Component Bindings",
      function () {
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
          [],
          generator.createIdentifier("Input"),
          [],
          [],
          [
            generator.createProperty(
              [createDecorator(Decorators.OneWay)],
              [],
              generator.createIdentifier("p"),
              "",
              undefined,
              generator.createNumericLiteral("10")
            ),
          ]
        );

        const heritageClause = generator.createHeritageClause(
          generator.SyntaxKind.ExtendsKeyword,
          [
            generator.createExpressionWithTypeArguments(
              [
                generator.createTypeReferenceNode(
                  generator.createIdentifier("Input"),
                  undefined
                ),
              ],
              generator.createIdentifier("JSXComponent")
            ),
          ]
        );

        const component = generator.createComponent(
          createComponentDecorator({}),
          [
            generator.SyntaxKind.ExportKeyword,
            generator.SyntaxKind.DefaultKeyword,
          ],
          generator.createIdentifier("BaseWidget"),
          [],
          [heritageClause],
          []
        );

        assert.strictEqual(
          getResult(component.toString()),
          getResult(`
                import {Component,NgModule,ChangeDetectionStrategy,ChangeDetectorRef,ViewContainerRef,Renderer2,ViewRef,ViewChild,TemplateRef} from "@angular/core";
                import {CommonModule} from "@angular/common";

                ${component.decorator}
                export default class BaseWidget extends Input {
                    get __restAttributes(): any{
                        return {}
                    }
                    _detectChanges(): void {
                      setTimeout(() => {
                        if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
                          this.changeDetection.detectChanges();
                      });
                    }
                    @ViewChild('widgetTemplate', { static: true }) widgetTemplate!: TemplateRef<any>;
                    constructor(
                      private changeDetection: ChangeDetectorRef,
                      private renderer: Renderer2,
                      private viewContainerRef: ViewContainerRef) {
                      super();
                    }
                }

                @NgModule({
                    declarations: [BaseWidget],
                    imports: [
                        CommonModule
                    ],
                    exports: [BaseWidget]
                })
                export class DxBaseWidgetModule {}
                export { BaseWidget as DxBaseWidgetComponent }
            `)
        );
      }
    );

    mocha.describe("Add setAccessor for InternalState", function () {
      mocha.it("InternalState without token and type", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.InternalState)],
            [],
            generator.createIdentifier("p")
          ),
        ]);

        const setter = component.members.filter(
          (m) => m instanceof SetAccessor
        );
        assert.strictEqual(setter.length, 1);
        assert.strictEqual(
          getResult(setter[0].toString()),
          getResult(`set _p(p:any){
          this.p=p;
          this._detectChanges();
        }`)
        );
      });

      mocha.it("InternalState with question token and type", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.InternalState)],
            [],
            generator.createIdentifier("p"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("string")
          ),
        ]);

        const setter = component.members.filter(
          (m) => m instanceof SetAccessor
        );
        assert.strictEqual(setter.length, 1);
        assert.strictEqual(
          getResult(setter[0].toString()),
          getResult(`set _p(p:string){
          this.p=p;
          this._detectChanges();
        }`)
        );
      });

      mocha.it("InternalState without question token and type", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.InternalState)],
            [],
            generator.createIdentifier("p"),
            undefined,
            generator.createKeywordTypeNode("string")
          ),
        ]);

        const setter = component.members.filter(
          (m) => m instanceof SetAccessor
        );
        assert.strictEqual(setter.length, 1);
        assert.strictEqual(
          getResult(setter[0].toString()),
          getResult(`set _p(p:string){
          this.p=p;
          this._detectChanges();
        }`)
        );
      });
      mocha.it("InternalState with question token and any type", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.InternalState)],
            [],
            generator.createIdentifier("p"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("any")
          ),
        ]);

        const setter = component.members.filter(
          (m) => m instanceof SetAccessor
        );
        assert.strictEqual(setter.length, 1);
        assert.strictEqual(
          getResult(setter[0].toString()),
          getResult(`set _p(p:any){
          this.p=p;
          this._detectChanges();
        }`)
        );
      });

      mocha.it("InternalState with exclamation token", function () {
        const component = createComponent([
          generator.createProperty(
            [createDecorator(Decorators.InternalState)],
            [],
            generator.createIdentifier("p"),
            generator.SyntaxKind.QuestionToken,
            generator.createKeywordTypeNode("any")
          ),
        ]);

        const setter = component.members.filter(
          (m) => m instanceof SetAccessor
        );
        assert.strictEqual(setter.length, 1);
        assert.strictEqual(
          getResult(setter[0].toString()),
          getResult(`set _p(p:any){
          this.p=p;
          this._detectChanges();
        }`)
        );
      });
    });

    mocha.describe("Default options", function () {
      function setupGenerator(context: GeneratorContext) {
        generator.setContext(context);
      }
      this.beforeEach(function () {
        setupGenerator({
          dirname: path.join(__dirname, "test-cases"),
          defaultOptionsModule: `${__dirname}/default_options`,
        });
      });

      this.afterEach(function () {
        generator.options = {};
        generator.setContext(null);
      });

      mocha.it("Add import convertRulesToOptions, DefaultOptionsRule", function () {
        const component = createComponent([]) as AngularComponent;
        assert.ok(
          component
            .compileImports()
            .indexOf(
              `import {convertRulesToOptions, DefaultOptionsRule} from "../default_options"`
            ) > -1
        );
      });

      mocha.it(
        "Compile defaultOptions expression if defaultOptionRules expression is set",
        function () {
          const component = createComponent([], {
            defaultOptionRules: generator.createIdentifier("rules"),
          }) as AngularComponent;
          assert.strictEqual(
            getResult(component.compileDefaultOptions([])),
            getResult(`
                    type BaseWidgetOptionRule = DefaultOptionsRule<Partial<BaseWidget>>;
                    const __defaultOptionRules:BaseWidgetOptionRule[] = rules;
                    export function defaultOptions(rule: BaseWidgetOptionRule) {
                        __defaultOptionRules.push(rule);

                    }`)
          );
        }
      );

      mocha.it(
        "Compile defaultOptions expression if defaultOptionRules expression is not set",
        function () {
          const component = createComponent([], {}) as AngularComponent;
          assert.strictEqual(
            getResult(component.compileDefaultOptions([])),
            getResult(`
                    type BaseWidgetOptionRule = DefaultOptionsRule<Partial<BaseWidget>>;
                    const __defaultOptionRules:BaseWidgetOptionRule[] = [];
                    export function defaultOptions(rule: BaseWidgetOptionRule) {
                        __defaultOptionRules.push(rule);

                    }`)
          );
        }
      );
    });

    mocha.describe("Members generation", function () {
      mocha.it("Access props - this.prop", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
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

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.width"
        );
      });

      mocha.it("Access TwoWay prop - this.prop", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.TwoWay)],
          [],
          generator.createIdentifier("width")
        );

        const expression = generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("width")
        );

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.width"
        );
      });

      mocha.it("Access props - this.props.prop", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
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

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.width"
        );
      });

      mocha.it(
        "Access props - viewModel.props.prop -> newViewModel.prop",
        function () {
          const property = generator.createProperty(
            [createDecorator(Decorators.OneWay)],
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

          assert.strictEqual(
            expression.toString({
              members: [property],
              componentContext: "viewModel",
              newComponentContext: "newViewModel",
            }),
            "newViewModel.width"
          );
        }
      );

      mocha.it("Access props - viewModel.props.prop", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("width")
        );

        const expression = generator.createPropertyAccess(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier("props")
          ),
          generator.createIdentifier("width")
        );

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: "viewModel",
            newComponentContext: "newViewModel",
          }),
          "newViewModel.width"
        );
      });

      mocha.it("Access props - viewModel.props.prop - prop", function () {
        const property = generator
          .createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("width")
          )
          .inherit();

        const expression = generator.createPropertyAccess(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier("props")
          ),
          generator.createIdentifier("width")
        );

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          "width"
        );
      });

      mocha.it("Access props - this.props without members", function () {
        const expression = generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("props")
        );

        const stringValue = expression.toString({
          members: [],
          componentContext: generator.SyntaxKind.ThisKeyword,
          newComponentContext: generator.SyntaxKind.ThisKeyword,
        });

        assert.strictEqual(stringValue, "{}");
      });

      mocha.it(
        "Access props - this.props in bindingPattern statement",
        function () {
          const variableDeclaration = generator.createVariableDeclaration(
            generator.createObjectBindingPattern([
              generator.createBindingElement(
                undefined,
                undefined,
                generator.createIdentifier("p")
              ),
            ]),
            undefined,
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("props")
            )
          );

          const stringValue = variableDeclaration.toString({
            members: [
              generator.createProperty(
                [createDecorator(Decorators.OneWay)],
                [],
                generator.createIdentifier("p")
              ),
            ],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          });

          assert.strictEqual(stringValue, "{p}=this");
        }
      );

      mocha.it("Access props - this.props with members", function () {
        const expression = generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("props")
        );

        const members = [
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          ),
          generator.createProperty(
            [createDecorator(Decorators.TwoWay)],
            [],
            generator.createIdentifier("p2")
          ),
          generator.createProperty(
            [createDecorator(Decorators.Event)],
            [],
            generator.createIdentifier("p3")
          ),
          generator.createProperty(
            [createDecorator("Slot")],
            [],
            generator.createIdentifier("p4")
          ),
          generator.createProperty(
            [createDecorator("Template")],
            [],
            generator.createIdentifier("p5")
          ),
          generator.createProperty(
            [createDecorator("InternalState")],
            [],
            generator.createIdentifier("p6")
          ),
          generator.createMethod(
            [],
            [],
            "",
            generator.createIdentifier("p7"),
            "",
            undefined,
            [],
            undefined,
            generator.createBlock([], false)
          ),
          generator.createGetAccessor(
            [],
            [],
            generator.createIdentifier("p8"),
            []
          ),
        ];

        const stringValue = expression.toString({
          members,
          componentContext: generator.SyntaxKind.ThisKeyword,
          newComponentContext: generator.SyntaxKind.ThisKeyword,
        });

        assert.strictEqual(
          getResult(stringValue),
          getResult(`{
                    p1:this.p1,
                    p2:this.p2,
                    p3:this._p3,
                    p4:this.p4,
                    p5:this.p5
                }`)
        );
      });

      mocha.it("Access props - const {p} = this.props", function () {
        const expression = generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("props")
        );

        const members = [
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          ),
          generator.createProperty(
            [createDecorator(Decorators.TwoWay)],
            [],
            generator.createIdentifier("p2")
          ),
          generator.createProperty(
            [createDecorator(Decorators.Event)],
            [],
            generator.createIdentifier("p3")
          ),
        ];

        const stringValue = generator
          .createVariableDeclaration(
            generator.createObjectBindingPattern([
              generator.createBindingElement(
                undefined,
                undefined,
                generator.createIdentifier("p1")
              ),
              generator.createBindingElement(
                undefined,
                generator.createIdentifier("p3"),
                generator.createIdentifier("_p3")
              ),
            ]),
            undefined,
            expression
          )
          .toString({
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
            members: members,
          });

        assert.strictEqual(
          getResult(stringValue),
          getResult(`{p1, p3:_p3}={p1:this.p1, p3:this._p3}`)
        );
      });

      mocha.it("Access props - const {p} = (this.props as any)", function () {
        const expression = generator.createParen(
          generator.createAsExpression(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("props")
            ),
            generator.createKeywordTypeNode("any")
          )
        );

        const members = [
          generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p1")
          ),
          generator.createProperty(
            [createDecorator(Decorators.TwoWay)],
            [],
            generator.createIdentifier("p2")
          ),
          generator.createProperty(
            [createDecorator(Decorators.Event)],
            [],
            generator.createIdentifier("p3")
          ),
        ];

        const stringValue = generator
          .createVariableDeclaration(
            generator.createObjectBindingPattern([
              generator.createBindingElement(
                undefined,
                undefined,
                generator.createIdentifier("p1")
              ),
              generator.createBindingElement(
                undefined,
                generator.createIdentifier("p3"),
                generator.createIdentifier("_p3")
              ),
            ]),
            undefined,
            expression
          )
          .toString({
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
            members: members,
          });

        assert.strictEqual(
          getResult(stringValue),
          getResult(`{p1, p3:_p3}=({p1:this.p1, p3:this._p3} as any)`)
        );
      });

      mocha.it("Access TwoWay props - this.props.prop", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.TwoWay)],
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

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.width"
        );
      });

      mocha.it("Call Event", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.Event)],
          [],
          generator.createIdentifier("onClick"),
          undefined,
          undefined,
          undefined
        );

        const expression = generator.createCall(
          generator.createPropertyAccess(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("props")
            ),
            generator.createIdentifier("onClick")
          ),
          [],
          [generator.createNumericLiteral("10")]
        );

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this._onClick(10)"
        );
      });

      mocha.it("Set TwoWay Prop", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.TwoWay)],
          [],
          generator.createIdentifier("width"),
          undefined,
          undefined,
          undefined
        );

        const expression = generator.createBinary(
          generator.createPropertyAccess(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("props")
            ),
            generator.createIdentifier("width")
          ),
          generator.SyntaxKind.EqualsToken,
          generator.createNumericLiteral("10")
        );

        assert.strictEqual(
          getResult(
            expression.toString({
              members: [property],
              componentContext: generator.SyntaxKind.ThisKeyword,
              newComponentContext: generator.SyntaxKind.ThisKeyword,
            })
          ),
          getResult("this._widthChange(this.width=10)")
        );
      });

      mocha.it("Can't set OneWay Prop", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("width"),
          undefined,
          undefined,
          undefined
        );

        const expression = generator.createBinary(
          generator.createPropertyAccess(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("props")
            ),
            generator.createIdentifier("width")
          ),
          generator.SyntaxKind.EqualsToken,
          generator.createNumericLiteral("10")
        );
        let error = null;
        try {
          expression.toString({
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
            members: [property],
          });
        } catch (e) {
          error = e;
        }
        assert.strictEqual(
          error,
          "Error: Can't assign property use TwoWay, Internal State, Ref, ForwardRef prop - this.props.width = 10"
        );
      });

      mocha.it("Can't set OneWay Prop (using unary)", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("width")
        );

        const expression = generator.createPostfix(
          generator.createPropertyAccess(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("props")
            ),
            generator.createIdentifier("width")
          ),
          generator.SyntaxKind.PlusPlusToken
        );
        let error = null;
        try {
          expression.toString({
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
            members: [property],
          });
        } catch (e) {
          error = e;
        }
        assert.strictEqual(
          error,
          "Error: Can't assign property use TwoWay() or Internal State - this.props.width++"
        );
      });

      mocha.it("Access elementRef", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("div"),
          undefined,
          generator.createUnionTypeNode([
            generator.createKeywordTypeNode("HTMLDivElement"),
            generator.createKeywordTypeNode("undefined"),
          ])
        );

        const propertyWithExclamation = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("div"),
          generator.SyntaxKind.ExclamationToken,
          generator.createKeywordTypeNode("HTMLSpanElement")
        );

        const propertyWithQuestion = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("div"),
          generator.SyntaxKind.QuestionToken,
          generator.createKeywordTypeNode("HTMLDivElement")
        );

        const expression = generator.createPropertyAccess(
          generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("div")
          ),
          generator.createIdentifier("current")
        );

        const svgElement = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("div"),
          undefined,
          generator.createKeywordTypeNode("SVGGraphicsElement")
        );

        const element = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("div"),
          undefined,
          generator.createKeywordTypeNode("Element")
        );

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.div.nativeElement"
        );

        assert.strictEqual(
          expression.toString({
            members: [propertyWithExclamation],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.div.nativeElement"
        );

        assert.strictEqual(
          expression.toString({
            members: [propertyWithQuestion],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.div.nativeElement"
        );

        assert.strictEqual(
          expression.toString({
            members: [svgElement],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.div.nativeElement"
        );

        assert.strictEqual(
          expression.toString({
            members: [element],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.div.nativeElement"
        );
      });

      mocha.it("Access ref object", function () {
        const property = generator.createProperty(
          [createDecorator(Decorators.Ref)],
          [],
          generator.createIdentifier("div"),
          undefined,
          generator.createUnionTypeNode([
            generator.createKeywordTypeNode("HTMLDivElement"),
            generator.createKeywordTypeNode("undefined"),
          ])
        );

        const expression = generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("div")
        );

        assert.strictEqual(
          expression.toString({
            members: [property],
            componentContext: generator.SyntaxKind.ThisKeyword,
            newComponentContext: generator.SyntaxKind.ThisKeyword,
          }),
          "this.div"
        );
      });
    });

    mocha.describe("Compile useEffect", function () {
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

      mocha.it(
        "should generate schedule effect method and fill ngOnChanges if there is prop in dependency",
        function () {
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
                  [createDecorator(Decorators.OneWay)],
                  undefined,
                  generator.createIdentifier(name),
                  undefined,
                  undefined,
                  undefined
                )
              )
              .concat(this.effect)
          ) as AngularComponent;

          const ngOnChanges: string[] = [];
          assert.strictEqual(
            getResult(component.compileEffects([], [], ngOnChanges, [], [])),
            getResult(`
                __destroyEffects: any[] = [];
                __viewCheckedSubscribeEvent: Array<(()=>void)|null> = [];
                _effectTimeout: any;
                __schedule_e(){
                    this.__destroyEffects[0]?.();
                    this.__viewCheckedSubscribeEvent[0] = ()=>{
                        this.__destroyEffects[0] = this.__e()
                    }
                }

                _updateEffects(){
                  if(this.__viewCheckedSubscribeEvent.length){
                    clearTimeout(this._effectTimeout);
                    this._effectTimeout = setTimeout(()=>{
                        this.__viewCheckedSubscribeEvent.forEach((s, i)=>{
                          s?.();
                          if(this.__viewCheckedSubscribeEvent[i]===s){
                            this.__viewCheckedSubscribeEvent[i]=null;
                          }
                        });
                      });
                  }
                }
                `)
          );

          assert.strictEqual(
            removeSpaces(ngOnChanges.join("\n")),
            removeSpaces(`
                        if (this.__destroyEffects.length && ["p", "p2"].some(d=>changes[d])) {
                            this.__schedule_e();
                        }
                `)
          );
        }
      );

      mocha.it(
        "should generate schedule effect method and fill ngOnChanges all props in dependency",
        function () {
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
                  [createDecorator(Decorators.OneWay)],
                  undefined,
                  generator.createIdentifier(name),
                  undefined,
                  undefined,
                  undefined
                )
              )
              .concat(this.effect)
          ) as AngularComponent;

          const ngOnChanges: string[] = [];
          assert.strictEqual(
            getResult(component.compileEffects([], [], ngOnChanges, [], [])),
            getResult(`
                        __destroyEffects: any[] = [];
                        __viewCheckedSubscribeEvent: Array<(()=>void) | null> = [];
                        _effectTimeout: any;
                        __schedule_e(){
                            this.__destroyEffects[0]?.();
                            this.__viewCheckedSubscribeEvent[0] = ()=>{
                                this.__destroyEffects[0] = this.__e()
                            }
                        }
                        _updateEffects(){
                          if(this.__viewCheckedSubscribeEvent.length){
                            clearTimeout(this._effectTimeout);
                            this._effectTimeout = setTimeout(()=>{
                                this.__viewCheckedSubscribeEvent.forEach((s, i)=>{
                                  s?.();
                                  if(this.__viewCheckedSubscribeEvent[i]===s){
                                    this.__viewCheckedSubscribeEvent[i]=null;
                                  }
                                });
                              });
                          }
                        }
                `)
          );

          assert.strictEqual(
            getResult(ngOnChanges.join("\n")),
            getResult(`
                        if (this.__destroyEffects.length) {
                            this.__schedule_e();
                        }
                `)
          );
        }
      );

      mocha.it(
        "should generate schedule effect method if there is internal state in dependency",
        function () {
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
            ["p", "p1"]
              .map((name) =>
                generator.createProperty(
                  [createDecorator("InternalState")],
                  undefined,
                  generator.createIdentifier(name),
                  undefined,
                  undefined,
                  undefined
                )
              )
              .concat([
                generator.createProperty(
                  [],
                  undefined,
                  generator.createIdentifier("p2"),
                  undefined,
                  undefined,
                  undefined
                ),
              ])
              .concat(this.effect)
          ) as AngularComponent;

          const ngOnChanges: string[] = [];
          assert.strictEqual(
            getResult(component.compileEffects([], [], ngOnChanges, [], [])),
            getResult(`
                        __destroyEffects: any[] = [];
                        __viewCheckedSubscribeEvent: Array<(()=>void) | null> = [];
                        _effectTimeout: any;
                        __schedule_e(){
                            this.__destroyEffects[0]?.();
                            this.__viewCheckedSubscribeEvent[0] = ()=>{
                                this.__destroyEffects[0] = this.__e()
                            }
                        }
                        _updateEffects(){
                          if(this.__viewCheckedSubscribeEvent.length){
                            clearTimeout(this._effectTimeout);
                            this._effectTimeout = setTimeout(()=>{
                                this.__viewCheckedSubscribeEvent.forEach((s, i)=>{
                                  s?.();
                                  if(this.__viewCheckedSubscribeEvent[i]===s){
                                    this.__viewCheckedSubscribeEvent[i]=null;
                                  }
                                });
                              });
                          }
                        }
                `)
          );

          assert.deepEqual(ngOnChanges, []);

          const p1Setter = component.members.find((p) => p.name === "_p1");
          assert.strictEqual(
            getResult(p1Setter?.toString() || ""),
            getResult(`set _p1(p1:any){
              this.p1=p1
              this._detectChanges();
            }`)
          );

          const p2Setter = component.members.find((p) => p.name === "_p2");
          assert.strictEqual(
            getResult(p2Setter?.toString() || ""),
            getResult(`
                    set _p2(p2:any){
                        this.p2=p2;
                        this._detectChanges();
                        if (this.__destroyEffects.length) {
                            this.__schedule_e();
                        }
                        this._updateEffects();
                    }
                `)
          );
        }
      );

      mocha.it(
        "should not generate schedule effect method if there is not props in dependency",
        function () {
          const component = createComponent(
            ["p", "p1"]
              .map((name) =>
                generator.createProperty(
                  [createDecorator(Decorators.OneWay)],
                  undefined,
                  generator.createIdentifier(name),
                  undefined,
                  undefined,
                  undefined
                )
              )
              .concat(this.effect)
          ) as AngularComponent;

          const ngOnChanges: string[] = [];
          assert.strictEqual(
            getResult(component.compileEffects([], [], ngOnChanges, [], [])),
            getResult(`
                        __destroyEffects: any[] = [];
                        __viewCheckedSubscribeEvent: Array<(()=>void) | null> = [];
                        _effectTimeout: any;
                `)
          );

          assert.deepEqual(ngOnChanges, []);
        }
      );
    });

    mocha.describe("GetAccessor", function () {
      mocha.it("add modifiers", function () {
        const getter = generator.createGetAccessor(
          [],
          [
            generator.SyntaxKind.PrivateKeyword,
            generator.SyntaxKind.StaticKeyword,
          ],
          generator.createIdentifier("g"),
          [],
          undefined,
          generator.createBlock([], false)
        );

        assert.strictEqual(
          getResult(
            getter.toString({
              members: [getter],
            })
          ),
          getResult(`private static get g(): any{}`)
        );
      });

      mocha.describe("Memorize GetAccessor with complexType", function () {
        function createGetAccessor(
          type?: TypeExpression,
          block?: Block,
          name?: string
        ) {
          return generator.createGetAccessor(
            [],
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

        mocha.it("Memorize Array type", function () {
          const getter = createGetAccessor(
            generator.createArrayTypeNode(
              generator.createKeywordTypeNode("string")
            )
          );

          assert.strictEqual(
            getResult(getter.toString({members: [], isComponent: true})),
            getResult(`get name():string[]{
                            if(this.__getterCache["name"]!==undefined){
                                return this.__getterCache["name"]
                            }

                            return this.__getterCache["name"]=( ():string[] => {
                                return result;
                            })();
                        }`)
          );

          assert.strictEqual(getter.isMemorized({members: [], isComponent: true}), true);
        });

        mocha.it("Memorize createTypeLiteralNode with simple type", function () {
          const getter = createGetAccessor(
            generator.createTypeLiteralNode([
              generator.createPropertySignature(
                undefined,
                generator.createIdentifier("field"),
                undefined,
                generator.createKeywordTypeNode(
                  generator.SyntaxKind.StringKeyword
                ),
                undefined
              ),
            ])
          );

          assert.strictEqual(getter.isMemorized({members: [], isComponent: true}), true);
        });

        mocha.it("Memorize createTypeLiteralNode with complex type", function () {
          const getter = createGetAccessor(
            generator.createTypeLiteralNode([
              generator.createPropertySignature(
                undefined,
                generator.createIdentifier("field"),
                undefined,
                generator.createArrayTypeNode(generator.createKeywordTypeNode(generator.SyntaxKind.StringKeyword)),
                generator.createArrayLiteral(
                  [],
                  false
                ),
              ),
            ])
          );

          assert.strictEqual(getter.isMemorized({members: [], isComponent: true}), true);
        });

        mocha.it("Memorize object", function () {
          const getter = createGetAccessor(
            generator.createKeywordTypeNode(generator.SyntaxKind.ObjectKeyword)
          );

          assert.strictEqual(getter.isMemorized({members: [], isComponent: true}), true);
        });

        mocha.it("Do not memorize primitive type", function () {
          const getter = createGetAccessor(
            generator.createKeywordTypeNode("string")
          );

          assert.strictEqual(
            getResult(getter.toString({members: [], isComponent:true})),
            getResult(`get name():string{
                            return result;
                        }`)
          );

          assert.strictEqual(getter.isMemorized({members: [], isComponent:true}), false);
        });

        mocha.it("Do not memorize union with primitive type", function () {
          const getter = createGetAccessor(
            generator.createUnionTypeNode([
              generator.createLiteralTypeNode(
                generator.createStringLiteral("1")
              ),
              generator.createLiteralTypeNode(
                generator.createStringLiteral("2")
              ),
            ])
          );

          assert.strictEqual(
            getResult(getter.toString({members: [], isComponent:true})),
            getResult(`get name():'1'|'2'{
                            return result;
                        }`)
          );
        });

        mocha.it("Memorize union with complex type", function () {
          const getter = createGetAccessor(
            generator.createUnionTypeNode([
              generator.createLiteralTypeNode(
                generator.createStringLiteral("1")
              ),
              generator.createLiteralTypeNode(
                generator.createObjectLiteral([], false)
              ),
            ])
          );

          assert.strictEqual(
            getResult(getter.toString({members: [], isComponent:true})),
            getResult(`get name():'1'|{}{
                            if(this.__getterCache["name"]!==undefined){
                                return this.__getterCache["name"];
                            }

                            return this.__getterCache["name"]=( ():'1'|{} => {
                                return result;
                            })();
                        }`)
          );
        });

        mocha.it("Memorize object literal type", function () {
          const getter = createGetAccessor(
            generator.createLiteralTypeNode(
              generator.createObjectLiteral([], false)
            )
          );

          assert.strictEqual(getter.isMemorized({members: [], isComponent:true}), true);
          assert.strictEqual(
            getResult(getter.toString({members: [], isComponent:true})),
            getResult(`get name():{}{
                            if(this.__getterCache["name"]!==undefined){
                                return this.__getterCache["name"]
                            }

                            return this.__getterCache["name"]=( ():{} => {
                                return result;
                            })();
                        }`)
          );
        });

        mocha.describe("GetAccessor cache", function () {
          mocha.it("Do not generate if simple type", function () {
            const getter = createGetAccessor(
              generator.createKeywordTypeNode("string")
            );

            const component = createComponent([getter]) as AngularComponent;

            const ngOnChanges: string[] = [];
            assert.strictEqual(component.compileGetterCache(ngOnChanges), "");
            assert.deepStrictEqual(ngOnChanges, []);
          });
          mocha.it("Do not generate if has mutable dependency", function () {
            const getter = createGetAccessor(
              generator.createKeywordTypeNode("string"),
              new Block([generator.createReturn(generator.createPropertyAccess(generator.createThis(),generator.createIdentifier("someMutable")))], false)
            );

            const component = createComponent([getter]) as AngularComponent;

            const ngOnChanges: string[] = [];
            assert.strictEqual(component.compileGetterCache(ngOnChanges, {
              members: [
                generator.createProperty(
                  [createDecorator(Decorators.Mutable)],
                  [],
                  new Identifier("someMutable")
                )],
              isComponent:true
            }), "");
            assert.deepStrictEqual(ngOnChanges, []);
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
              ]) as AngularComponent;

              const ngOnChanges: string[] = [];
              assert.strictEqual(
                getResult(component.compileGetterCache(ngOnChanges, {members: [], isComponent: true})),
                getResult(`__getterCache: {
                            g1?:string[];
                            g2?:number[];
                        } = {}`)
              );
              assert.deepStrictEqual(ngOnChanges, []);
            }
          );

          mocha.it(
            "Fill ngOnChanges if getter has prop dependency",
            function () {
              const getter = createGetAccessor(
                generator.createArrayTypeNode(
                  generator.createKeywordTypeNode("string")
                ),
                generator.createBlock(
                  [
                    generator.createPropertyAccess(
                      generator.createPropertyAccess(
                        generator.createThis(),
                        generator.createIdentifier("props")
                      ),
                      generator.createIdentifier("p")
                    ),
                  ],
                  false
                )
              );

              const component = createComponent([
                getter,
                generator.createProperty(
                  [createDecorator(Decorators.OneWay)],
                  [],
                  generator.createIdentifier("p")
                ),
              ]) as AngularComponent;

              const ngOnChanges: string[] = [];
              assert.strictEqual(
                getResult(component.compileGetterCache(ngOnChanges, {members: [], isComponent: true})),
                getResult(`__getterCache: {
                            name?:string[];
                        } = {}`)
              );

              assert.strictEqual(
                getResult(ngOnChanges.join("\n")),
                getResult(`if(["p"].some(d=>changes[d])){
                                this.__getterCache[\"name\"] = undefined;
                            }`)
              );
            }
          );

          mocha.it("Reset cache on internal state setting", function () {
            const getter = createGetAccessor(
              generator.createArrayTypeNode(
                generator.createKeywordTypeNode("string")
              ),
              generator.createBlock(
                [
                  generator.createPropertyAccess(
                    generator.createThis(),
                    generator.createIdentifier("p")
                  ),
                ],
                false
              )
            );

            const p = generator.createProperty(
              [createDecorator(Decorators.InternalState)],
              [],
              generator.createIdentifier("p")
            );

            const p1 = generator.createProperty(
              [createDecorator(Decorators.InternalState)],
              [],
              generator.createIdentifier("p1")
            );

            const component = createComponent([
              getter,
              p,
              p1,
            ]) as AngularComponent;

            const ngOnChanges: string[] = [];
            assert.strictEqual(
              getResult(component.compileGetterCache(ngOnChanges, {members: [], isComponent: true})),
              getResult(`__getterCache: {
                            name?:string[];
                        } = {}`)
            );
            assert.deepEqual(ngOnChanges, []);

            assert.strictEqual(
              getResult(
                component.members.find((m) => m.name === "_p")!.toString()
              ),
              getResult(`
                            set _p(p:any){
                                this.p=p;
                                this._detectChanges();
                                this.__getterCache["name"] = undefined;
                            }`)
            );

            assert.strictEqual(
              getResult(
                component.members.find((m) => m.name === "_p1")!.toString()
              ),
              getResult(`
                                set _p1(p1:any){
                                    this.p1=p1;
                                    this._detectChanges();
                                }`)
            );
          });

          mocha.it(
            "Reset cache on ngChange if props in dependency",
            function () {
              const getter = createGetAccessor(
                generator.createArrayTypeNode(
                  generator.createKeywordTypeNode("string")
                ),
                generator.createBlock(
                  [
                    generator.createPropertyAccess(
                      generator.createThis(),
                      generator.createIdentifier("props")
                    ),
                  ],
                  false
                )
              );

              const component = createComponent([getter]) as AngularComponent;

              const ngOnChanges: string[] = [];

              component.compileGetterCache(ngOnChanges, {members: [], isComponent: true});

              assert.deepEqual(
                ngOnChanges.join("\n"),
                `this.__getterCache["name"] = undefined;`
              );
            }
          );
        });
      });
    });
  });

  mocha.describe("Expressions", function () {
    mocha.it("Variable declaration", function () {
      assert.strictEqual(
        generator
          .createVariableDeclaration(
            generator.createIdentifier("a"),
            undefined,
            undefined
          )
          .toString(),
        "a"
      );

      assert.strictEqual(
        generator
          .createVariableDeclaration(
            generator.createIdentifier("a"),
            generator.createKeywordTypeNode("any"),
            generator.createNumericLiteral("10")
          )
          .toString(),
        "a:any=10"
      );
    });

    mocha.it("createVariableStatement without initializer", function () {
      assert.strictEqual(
        generator
          .createVariableStatement(
            [],
            generator.createVariableDeclarationList(
              [
                generator.createVariableDeclaration(
                  generator.createIdentifier("a")
                ),
              ],
              generator.SyntaxKind.LetKeyword
            )
          )
          .toString(),
        " let a"
      );
    });

    mocha.it("AsExpression", function () {
      const prop = generator.createProperty(
        [createDecorator(Decorators.OneWay)],
        [],
        generator.createIdentifier("p")
      );
      const expression = generator.createAsExpression(
        generator.createPropertyAccess(
          generator.createThis(),
          generator.createIdentifier("p")
        ),
        generator.createKeywordTypeNode("number")
      );

      assert.strictEqual(expression.toString(), "this.p as number");
      assert.strictEqual(
        expression.toString({
          members: [prop],
          componentContext: "this",
          newComponentContext: "",
        }),
        "p as number"
      );

      assert.strictEqual(
        expression.toString({
          members: [],
          componentContext: "this",
          newComponentContext: "",
          disableTemplates: true,
        }),
        "p"
      );
    });

    mocha.describe("NonNullExpression", function () {
      mocha.it(
        "NonNullExpression with this context - expression!",
        function () {
          const prop = generator.createProperty(
            [createDecorator(Decorators.OneWay)],
            [],
            generator.createIdentifier("p")
          );
          const expression = generator.createNonNullExpression(
            generator.createPropertyAccess(
              generator.createThis(),
              generator.createIdentifier("p")
            )
          );

          assert.strictEqual(
            expression.toString({
              members: [prop],
              componentContext: "this",
              newComponentContext: "",
            }),
            "p!"
          );
        }
      );

      mocha.it("without options - expression!", function () {
        const expression = generator.createNonNullExpression(
          generator.createPropertyAccess(
            generator.createThis(),
            generator.createIdentifier("p")
          )
        );

        assert.strictEqual(expression.toString(), "this.p!");
      });

      mocha.it("with non-this context - expression", function () {
        const prop = generator.createProperty(
          [createDecorator(Decorators.OneWay)],
          [],
          generator.createIdentifier("p")
        );
        const expression = generator.createNonNullExpression(
          generator.createPropertyAccess(
            generator.createIdentifier("viewModel"),
            generator.createIdentifier("p")
          )
        );

        assert.strictEqual(
          expression.toString({
            members: [prop],
            componentContext: "viewModel",
            newComponentContext: "",
          }),
          "p"
        );
      });
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

    mocha.it("empty jsx expression", function () {
      const expression = generator.createJsxElement(
        generator.createJsxOpeningElement(generator.createIdentifier("div")),
        [generator.createJsxExpression(undefined, undefined)],
        generator.createJsxClosingElement(generator.createIdentifier("div"))
      );

      assert.strictEqual(expression.toString(), "<div ></div>");
    });

    mocha.describe("Abstract method", function () {
      mocha.it("abstract method with modifier and without body", function () {
        const expression = generator.createMethod(
          [],
          ["abstract"],
          undefined,
          generator.createIdentifier("m"),
          undefined,
          undefined,
          [],
          undefined,
          undefined
        );

        assert.strictEqual(
          expression.toString(),
          "abstract m():any;"
        );
      });

      mocha.it("abstract method without modifier and without body", function () {
        const expression = generator.createMethod(
          [],
          [],
          undefined,
          generator.createIdentifier("m"),
          undefined,
          undefined,
          [],
          undefined,
          undefined
        );

        try {
          expression.toString();
        } catch (e) {
          assert.strictEqual(
            e.toString().split("\n")[0],
            "Error: Function implementation is missing or not immediately following the declaration.");
        }
      });

      mocha.it("abstract method with modifier and body", function () {
        const expression = generator.createMethod(
          [],
          ["abstract"],
          undefined,
          generator.createIdentifier("m"),
          undefined,
          undefined,
          [],
          undefined,
          new Block([], false)
        );

        try {
          expression.toString();
        } catch (e) {
          assert.strictEqual(
            e.toString().split("\n")[0],
            "Error: Method 'm' cannot have an implementation because it is marked abstract.");
        }
      });
    });
  });
});
