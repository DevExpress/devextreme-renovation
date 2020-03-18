import ts from "typescript";
import fs from "fs";
import { generateFactoryCode } from "./factoryCodeGenerator";
import { Generator } from "./react-generator";
import path from "path";

export function deleteFolderRecursive(path: string) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(fileName => {
            const filePath = `${path}/${fileName}`;
            if (fs.lstatSync(filePath).isDirectory()) {
                deleteFolderRecursive(filePath);
            } else {
                fs.unlinkSync(filePath);
            }
        });
        fs.rmdirSync(path);
    }
}

import Stream from "stream";
import File from "vinyl";

export function compileCode(generator: Generator, code: string, file: { dirname: string, path: string }): string {
    const source = ts.createSourceFile(file.path, code, ts.ScriptTarget.ES2016, true);
    generator.setContext({ path: file.path, dirname: file.dirname, defaultOptionsModule: generator.defaultOptionsModule && path.resolve(generator.defaultOptionsModule) });
    const codeFactory = generateFactoryCode(ts, source);
    const codeFactoryResult = eval(codeFactory)(generator);
    
    generator.cache[file.path] = codeFactoryResult;
    generator.setContext(null);

    return codeFactoryResult.join("\n");
}

export function generateComponents(generator: Generator) {
    const stream = new Stream.Transform({
        objectMode: true,
        transform(originalFile: File, _, callback) {
            const factoryCodeFile = originalFile.clone();
            if (originalFile.contents instanceof Buffer) {
                const code = originalFile.contents.toString();
                const componentCode = compileCode(generator, code, originalFile);
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
