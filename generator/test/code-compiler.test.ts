import assert from "assert";
import mocha from "./helpers/mocha";
import generator from "../preact-generator";
import gulp from "gulp";
import fs from "fs";
import path from "path";
import { printSourceCodeAst } from "./helpers/common";
import sinon from "sinon";

import { generateComponents, deleteFolderRecursive } from "../component-compiler";
import File from "vinyl";

async function readData(stream:NodeJS.ReadableStream):Promise<File[]> {
    return new Promise((resolve, _error) => {
        const bodyChunks:File[] = [];
        stream.on('data', function (chunk: File) {
            if (chunk.contents) { 
                bodyChunks.push(chunk);
            }
        }).on('end', function () {
            resolve(bodyChunks);
        });
    });
}

mocha.describe("code-compiler: gulp integration", function() { 
    mocha.it("createCodeGenerator stream", async function () { 
        const setContextSpy = sinon.spy(generator, "setContext");
        const result = await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/src/props-in-listener.tsx`))
            .pipe(generateComponents(generator))
        );
        
        assert.strictEqual(printSourceCodeAst(result[0].contents!.toString()), printSourceCodeAst(fs.readFileSync(`${__dirname}/test-cases/expected/preact/props-in-listener.tsx`).toString()));
        assert.ok(result[0].path.endsWith("props-in-listener.p.tsx"));

        const dirname = setContextSpy.firstCall.args[0]!.dirname!;
        assert.ok(dirname.endsWith("declarations/src") || dirname.endsWith("declarations\\src"));
        assert.deepEqual(generator.getContext(), { components: {} });
        setContextSpy.restore();
    });

    mocha.describe("Default options", function () {
        const defaultOptionsModule = "../component_declaration/default_options";
        this.beforeEach(function () {
            generator.defaultOptionsModule = defaultOptionsModule
        });
        this.afterEach(function () { 
            generator.defaultOptionsModule = undefined;
        });
        mocha.it("copy default_options", async function () { 
            const setContextSpy = sinon.spy(generator, "setContext");
            await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/src/props-in-listener.tsx`))
                .pipe(generateComponents(generator))
            );

            assert.strictEqual(setContextSpy.firstCall.args[0]!.defaultOptionsModule, path.resolve(defaultOptionsModule));

            setContextSpy.restore();
        });
    });
});

mocha.describe("jQuery", function () {
    const jqueryComponentRegistratorModule = "../component_declaration/jquery_component_registrator";
    const jqueryBaseComponentModule = "../component_declaration/jquery_base_component";

     this.beforeEach(function () {
        generator.jqueryComponentRegistratorModule = jqueryComponentRegistratorModule
        generator.jqueryBaseComponentModule = jqueryBaseComponentModule
    });
    this.afterEach(function () { 
        generator.jqueryComponentRegistratorModule = undefined
        generator.jqueryBaseComponentModule = undefined
    });
    mocha.it("copy utils modules", async function () { 
        const setContextSpy = sinon.spy(generator, "setContext");
        await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/src/props-in-listener.tsx`))
            .pipe(generateComponents(generator))
        );

        assert.strictEqual(setContextSpy.firstCall.args[0]!.jqueryComponentRegistratorModule, path.resolve(jqueryComponentRegistratorModule));
        assert.strictEqual(setContextSpy.firstCall.args[0]!.jqueryBaseComponentModule, path.resolve(jqueryBaseComponentModule));

        setContextSpy.restore();
    });

     mocha.it("createCodeGenerator returns correct filename", async function () {
        const result = await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/src/jquery-empty.tsx`))
            .pipe(generateComponents(generator))
        );

        assert.ok(result[1].path.endsWith("jquery-empty.j.tsx"));
    });
});

mocha.describe("utils", function () { 
    const BASE_PATH = "test-utils-tmp";
    this.beforeEach(function () { 
        deleteFolderRecursive(BASE_PATH);
    });
    
    mocha.it("delete folders", function () {
        const INTERNAL_PATH = path.join(BASE_PATH, "internal");
        fs.mkdirSync(BASE_PATH);
        fs.mkdirSync(INTERNAL_PATH);
        fs.writeFileSync(path.join(BASE_PATH, "f1.txt"), "test");
        fs.writeFileSync(path.join(INTERNAL_PATH, "f1.txt"), "test");

        deleteFolderRecursive(BASE_PATH);

        assert.ok(!fs.existsSync(BASE_PATH))
    });
});