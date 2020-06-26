import mocha from "./helpers/mocha";
import generator, { PreactComponent } from "../preact-generator";
import compile from "../component-compiler";
import path from "path";
import assert from "assert";

import { printSourceCodeAst as getResult, createTestGenerator, getModulePath } from "./helpers/common";

mocha.describe("preact-generator", function () {
    const testGenerator = createTestGenerator("preact");
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations/src`, `${__dirname}/test-cases/componentFactory`);
        this.testGenerator = function (componentName: string) {
            generator.setContext({ 
                dirname: path.resolve(__dirname, "./test-cases/declarations/src"),
                path: `${componentName}.tsx`,
                jqueryComponentRegistratorModule: getModulePath("component_declaration/jquery_component_registrator"),
                jqueryBaseComponentModule: getModulePath("component_declaration/jquery_base_component")
            
            });
            testGenerator.call(this, componentName, generator);
        };
    });

    this.beforeEach(function () {
        generator.jqueryComponentRegistratorModule = getModulePath("component_declaration/jquery_component_registrator");
        generator.jqueryBaseComponentModule = getModulePath("component_declaration/jquery_base_component");
    });

    this.afterEach(function () {
        generator.setContext(null);
        generator.jqueryComponentRegistratorModule = "";
        generator.jqueryBaseComponentModule = "";
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

    mocha.it("method-use-apiref", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("export-default", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("export-named", function () {
        this.testGenerator(this.test!.title);
    });
});

mocha.describe("preact-generator: expressions", function () {
    mocha.describe("Import statement with context", function () { 
        this.beforeEach(function () { 
            generator.setContext({ dirname: path.resolve(__dirname) });
        });

        this.afterEach(function () { 
            generator.setContext(null);
        });
        mocha.it("Rename import if it is component declaration", function () {
            assert.equal(generator.createImportDeclaration(
                undefined,
                undefined,
                undefined,
                generator.createStringLiteral("./test-cases/declarations/src/empty-component")
            ), 'import "./test-cases/declarations/src/empty-component.p"');
    
            generator.setContext(null);
        });
    
        mocha.it("Do not rename module without declaration", function () {
            assert.equal(generator.createImportDeclaration(
                undefined,
                undefined,
                undefined,
                generator.createStringLiteral("typescript")
            ), 'import "typescript"');
    
            generator.setContext({ dirname: path.resolve(__dirname) });
        });
    });

    mocha.it("import module without components, generator with empty context", function () { 
        assert.strictEqual(generator.createImportDeclaration(
            undefined,
            undefined,
            undefined,
            generator.createStringLiteral("module")
        ).toString(), `import "module"`);
    });

    mocha.describe("Fragment", function () { 
        mocha.it("React.Fragment -> Preact.Fragment", function () {
            const expression = generator.createJsxElement(
                generator.createJsxOpeningElement(generator.createIdentifier("Fragment"), []),
                [],
                generator.createJsxClosingElement(generator.createIdentifier("Fragment"))
            );

            assert.strictEqual(expression.toString(), "<Preact.Fragment ></Preact.Fragment>");
        });
    });

    mocha.it("empty expression", function () {
        const expression = generator.createJsxElement(
            generator.createJsxOpeningElement(generator.createIdentifier("div"), []),
            [generator.createJsxExpression(undefined, undefined)],
            generator.createJsxClosingElement(generator.createIdentifier("div"))
        );

        assert.strictEqual(expression.toString(), "<div ></div>");
    });

    mocha.describe("Property: type declaration", function () {
        mocha.it("Slot by default - any", function () { 
            const property = generator.createProperty(
                [generator.createDecorator(generator.createCall(
                    generator.createIdentifier("Slot"),
                    undefined,
                    []
                ))],
                undefined,
                generator.createIdentifier("p")
            );
            
            assert.strictEqual(property.typeDeclaration(), "p:any");
        });

        mocha.it("Slot with type - any", function () { 
            const property = generator.createProperty(
                [generator.createDecorator(generator.createCall(
                    generator.createIdentifier("Slot"),
                    undefined,
                    []
                ))],
                undefined,
                generator.createIdentifier("p"),
                generator.SyntaxKind.ExclamationToken,
                generator.createKeywordTypeNode("string")
            );
            
            assert.strictEqual(property.typeDeclaration(), "p!:any");
        });

        mocha.it("Not Slot Property - use base type declaration", function () { 
            const property = generator.createProperty(
                [generator.createDecorator(generator.createCall(
                    generator.createIdentifier("OneWay"),
                    undefined,
                    []
                ))],
                undefined,
                generator.createIdentifier("p"),
                generator.SyntaxKind.ExclamationToken,
                generator.createKeywordTypeNode("string")
            );
            
            assert.strictEqual(property.typeDeclaration(), "p:string");
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
            generator.createStringLiteral("./test-cases/declarations/src/props")
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

mocha.describe("preact-generator: jQuery generation", function () {
    const testGenerator = createTestGenerator("preact");
    this.beforeAll(function () {
        compile(`${__dirname}/test-cases/declarations/src`, `${__dirname}/test-cases/componentFactory`);

        this.testGenerator = function (componentName: string) {
            generator.setContext({ 
                dirname: path.resolve(__dirname, "./test-cases/declarations/src"), 
                path: getModulePath(`${componentName}.tsx`),
                jqueryComponentRegistratorModule: generator.jqueryComponentRegistratorModule && path.resolve(generator.jqueryComponentRegistratorModule),
                jqueryBaseComponentModule: generator.jqueryBaseComponentModule && path.resolve(generator.jqueryBaseComponentModule)
            });
            testGenerator.call(this, componentName, generator, 1);
        };
    });

    this.beforeEach(function () {
        generator.jqueryComponentRegistratorModule = getModulePath("component_declaration/jquery_component_registrator");
        generator.jqueryBaseComponentModule = getModulePath("component_declaration/jquery_base_component");
    });
    
    this.afterEach(function () {
        generator.setContext(null);
        generator.jqueryComponentRegistratorModule = "";
        generator.jqueryBaseComponentModule = "";
        if (this.currentTest!.state !== "passed") {
            console.log(this.code); // TODO: diff with expected
        }
        this.code = null;
        this.expectedCode = null;
    });

    mocha.it("jquery-empty", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-events", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-without-modules", function () {
        generator.jqueryComponentRegistratorModule = undefined;
        generator.jqueryBaseComponentModule = undefined;
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-register-false", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-api", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-template", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-state", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-custom-base", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-custom-named-base", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-custom-base-with-module-import", function () {
        this.testGenerator(this.test!.title);
    });

    mocha.it("jquery-export-named", function () {
        this.testGenerator(this.test!.title);
    });
});
