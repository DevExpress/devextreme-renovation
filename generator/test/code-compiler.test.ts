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
});

mocha.describe("Gathering meta information about components", function() {
    this.beforeEach(function() {
        generator.meta = {};
    });
    mocha.it("Can not get meta withot preliminary generation phase", function() {
        assert.equal(generator.getComponentsMeta().length, 0);
    });

    mocha.it("Meta only contains generated components info", async function() {
        await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/src/meta.tsx`))
            .pipe(generateComponents(generator))
        );

        assert.deepEqual(generator.getComponentsMeta(), [
            {
                name: "MetaWidget",
                decorator: { 
                    view: "view",
                    jQuery: {
                        register: "true"
                    }
                },
                props: {
                    allProps: ["oneWayProp1","oneWayProp2","twoWayProp1","twoWayProp2","slotProp1","slotProp2","templateProp1","templateProp2","eventProp1","eventProp2","refProp1","refProp2","defaultTwoWayProp1","twoWayProp1Change","defaultTwoWayProp2","twoWayProp2Change","renderProp1","componentProp1","renderProp2","componentProp2"],
                    oneway: ["oneWayProp1","oneWayProp2","defaultTwoWayProp1","defaultTwoWayProp2","renderProp1","componentProp1","renderProp2","componentProp2"],
                    twoway: ["twoWayProp1","twoWayProp2"],
                    template: ["templateProp1","templateProp2"],
                    event: ["eventProp1","eventProp2", "twoWayProp1Change", "twoWayProp2Change"],
                    ref: ["refProp1","refProp2"],
                    slot: ["slotProp1","slotProp2"]
                },
                api: ["apiMethod1", "apiMethod2"],
                path: path.resolve(`${__dirname}/test-cases/declarations/src/meta.tsx`)
            }
        ]);
    });
});

mocha.describe("jQuery", function () {
    const jqueryComponentRegistratorModule = "../component_declaration/jquery_component_registrator";
    const jqueryBaseComponentModule = "../component_declaration/jquery_base_component";

    this.beforeEach(function () {
        generator.options = {
            jqueryComponentRegistratorModule,
            jqueryBaseComponentModule
        }
    });
    this.afterEach(function () { 
        generator.options = {};
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