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
