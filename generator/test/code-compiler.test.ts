import assert from "assert";
import mocha from "mocha";
import generator from "../preact-generator";
import gulp from "gulp";
import fs from "fs";
import path from "path";
import { printSourceCodeAst } from "./helpers/common";
import sinon from "sinon";

import { generateComponents, deleteFolderRecursive } from "../component-compiler";
import File from "vinyl";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

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
        const result = await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/props-in-listener.tsx`))
            .pipe(generateComponents(generator))
        );
        
        assert.strictEqual(printSourceCodeAst(result[0].contents!.toString()), printSourceCodeAst(fs.readFileSync(`${__dirname}/test-cases/expected/preact/props-in-listener.tsx`).toString()));
        assert.ok(result[0].path.endsWith("props-in-listener.p.tsx"));
        assert.ok(setContextSpy.firstCall.args[0]!.path!.endsWith("declarations"));
        assert.deepEqual(generator.getContext(), { components: {} });
        setContextSpy.restore();
    });

    mocha.describe("Default options", function () { 
        const TEST_FOLDER = path.resolve(`${__dirname}/test-cases/dist`);
        this.beforeEach(function () {
            generator.destination = TEST_FOLDER;
            fs.mkdirSync(TEST_FOLDER)
        });
        this.afterEach(function () { 
            generator.destination = "";
            deleteFolderRecursive(TEST_FOLDER);
        });
        mocha.it("copy default_options", async function () { 
            const setContextSpy = sinon.spy(generator, "setContext");
            await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/props-in-listener.tsx`))
                .pipe(generateComponents(generator))
            );

            assert.ok(fs.readdirSync(TEST_FOLDER).map(f => f).filter(f => f.startsWith("default_options")).length > 0);
            assert.strictEqual(setContextSpy.firstCall.args[0]!.destination, generator.destination);

            setContextSpy.restore();
        });
    });

});