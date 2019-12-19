import assert from "assert";
import mocha from "mocha";
import generator from "../preact-generator";
import gulp from "gulp";
import fs from "fs";
import path from "path";
import { printSourceCodeAst } from "./helpers/common";

import { generateComponents } from "../component-compiler";
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
        const result = await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/props-in-listener.tsx`))
            .pipe(generateComponents(generator))
            .pipe(gulp.dest("."))
        );
        
        assert.strictEqual(printSourceCodeAst(result[0].contents!.toString()), printSourceCodeAst(fs.readFileSync(`${__dirname}/test-cases/expected/preact/props-in-listener.tsx`).toString()));
        assert.ok(result[0].path.endsWith("props-in-listener.p.tsx"));
    });
});