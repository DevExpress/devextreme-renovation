import ts from "typescript";
import fs from "fs";
import { generateFactoryCode } from "./factoryCodeGenerator";

function deleteFolderRecursive(path: string) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

import Stream from "stream";
import File from "vinyl";

export function generateComponents(generator:any) { 
    const stream = new Stream.Transform({
        objectMode: true,
        transform(originalFile: File, _, callback) {
            const factoryCodeFile = originalFile.clone();
            if (originalFile.contents instanceof Buffer) {
                const code = originalFile.contents.toString();
                const source = ts.createSourceFile(originalFile.path, code, ts.ScriptTarget.ES2016, true);
                generator.setContext({ path: originalFile.dirname });
                const codeFactory = generateFactoryCode(ts, source);
                const componentCode = eval(codeFactory)(generator).join("\n");
                generator.setContext(null);
                factoryCodeFile.contents = Buffer.from(componentCode);
                factoryCodeFile.path = generator.processSourceFileName(factoryCodeFile.path)
                callback(null, factoryCodeFile);
            }
        }
    });

    return stream;
}

export default function compile(dir: string, outDir: string) {
    if (fs.existsSync(outDir)) {
        deleteFolderRecursive(outDir);
    }
    fs.mkdirSync(outDir);
    fs.readdirSync(dir, { withFileTypes: true }).filter(({ name }) => name.endsWith(".tsx")).forEach(({ name }) => {
        const source = ts.createSourceFile(name, fs.readFileSync(`${dir}/${name}`).toString(), ts.ScriptTarget.ES2016, true);
        const factoryCode = generateFactoryCode(ts, source);
        fs.writeFileSync(`${outDir}/${name.replace(".tsx", ".js")}`, factoryCode);
    });
}
