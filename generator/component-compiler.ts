import ts from "typescript";
import fs from "fs";
import { generateFactoryCode } from "./factoryCodeGenerator";
import Generator  from "./base-generator";

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

export function compileCode(generator: Generator, code: string, file: { dirname: string, path: string, importedModules?: string[] }, includeExtraComponents: boolean = false): {path?: string, code: string }[] | string {
    const source = ts.createSourceFile(file.path, code, ts.ScriptTarget.ES2016, true);
    generator.setContext({ 
        path: file.path, 
        dirname: file.dirname,
        importedModules: file.importedModules,
        ...generator.getInitialContext()
    });
    const codeFactory = generateFactoryCode(ts, source);

    const codeFactoryResult = generator.generate(eval(codeFactory));
    generator.setContext(null);

    if(includeExtraComponents) {
        return codeFactoryResult;
    }
    return codeFactoryResult[0].code;
}

export function generateComponents(generator: Generator) {
    const stream = new Stream.Transform({
        objectMode: true,
        transform(originalFile: File, _, callback) {
            if (originalFile.contents instanceof Buffer) {
                const code = originalFile.contents.toString();
                const components: {} = compileCode(generator, code, originalFile, true);

                (components as { path?: string, code: string }[]).filter(c => c.path && c.code).forEach(c => {
                    const generatedFile = originalFile.clone();
                    generatedFile.contents = Buffer.from(c.code);
                    generatedFile.path = c.path!;
                    this.push(generatedFile)
                });
                
                callback()
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
