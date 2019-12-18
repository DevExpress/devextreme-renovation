import assert from "assert";
import mocha from "mocha";
import generator from "../react-generator";
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

async function readData(stream:NodeJS.ReadableStream):Promise<string> {
    return new Promise((resolve, _error) => {
        const bodyChunks:string[] = [];
        stream.on('data', function (chunk: File) {
            if (chunk.contents) { 
                bodyChunks.push(chunk.contents.toString());
            }
        }).on('end', function () {
            resolve(bodyChunks.join());
        });
    });
}

mocha.describe("gulp generator", function() { 
    mocha.it("createCodeGenerator stream", async function () { 
        const result = await readData(gulp.src(path.resolve(`${__dirname}/test-cases/declarations/empty-component.tsx`))
            .pipe(generateComponents(generator)));
        
        assert.strictEqual(printSourceCodeAst(result), printSourceCodeAst(fs.readFileSync(`${__dirname}/test-cases/expected/react/empty-component.tsx`).toString()));
    });
});