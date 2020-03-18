import mocha from "mocha";
import generator, { PreactComponent } from "../preact-generator";
import compile from "../component-compiler";
import path from "path";
import assert from "assert";

import { printSourceCodeAst as getResult, createTestGenerator } from "./helpers/common";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

mocha.describe("preact-generator", function () {
    const testGenerator = createTestGenerator("preact");
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            testGenerator.call(this, componentName, generator);
        };
    });

    this.beforeEach(function () {
        generator.setContext({ dirname: path.resolve(__dirname, "./test-cases/declarations") });
    });

    this.afterEach(function () {
        generator.setContext(null);
        if (this.currentTest!.state !== "passed") {
            console.log(this.code); // TODO: diff with expected
        }
        this.code = null;
        this.expectedCode = null;
    });

    mocha.it("props-in-listener", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("slots", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("extend-props", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.describe("react-generator: expressions", function () {
        mocha.it("Rename import if it is component declaration", function () {
            generator.setContext({ dirname: path.resolve(__dirname) });
            
            assert.equal(generator.createImportDeclaration(
                undefined,
                undefined,
                undefined,
                generator.createStringLiteral("./test-cases/declarations/empty-component")
            ), 'import "./test-cases/declarations/empty-component.p"');
        });

        mocha.it("Do not rename module without declaration", function () {
            generator.setContext({ dirname: path.resolve(__dirname) });
            
            assert.equal(generator.createImportDeclaration(
                undefined,
                undefined,
                undefined,
                generator.createStringLiteral("typescript")
            ), 'import "typescript"');
        });

        mocha.describe("Fragment", function () { 
            mocha.it("React.Fragment -> Preact.Fragment", function () {
                const expression = generator.createJsxElement(
                    generator.createJsxOpeningElement(generator.createIdentifier("Fragment"), [], []),
                    [],
                    generator.createJsxClosingElement(generator.createIdentifier("Fragment"))
                );

                assert.strictEqual(expression.toString(), "<Preact.Fragment ></Preact.Fragment>");
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
        
        const component = new PreactComponent(decorator, [], generator.createIdentifier("Component"), [], [heritageClause], [childProperty], {});

        assert.equal(getResult(component.compileDefaultProps()), getResult("(Component as any).defaultProps = {...(Base as any).defaultProps, childProp:10}"));
    });
});
