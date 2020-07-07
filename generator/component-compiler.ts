import ts from "typescript";
import fs from "fs";
import { generateFactoryCode } from "./factoryCodeGenerator";
import Stream from "stream";
import File from "vinyl";
import { GeneratorAPI, GeneratorResult } from "./base-generator/generator-api";
import { compileCode } from "./code-compiler";
import path from "path";

export function deleteFolderRecursive(path: string) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((fileName) => {
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

export function generateComponents(generator: GeneratorAPI) {
  const stream = new Stream.Transform({
    objectMode: true,
    transform(originalFile: File, _, callback) {
      if (originalFile.contents instanceof Buffer) {
        const code = originalFile.contents.toString();
        const components: GeneratorResult[] = compileCode(
          generator,
          code,
          originalFile,
          true
        ) as GeneratorResult[];

        components
          .filter((c) => c.path && c.code)
          .forEach((c) => {
            const generatedFile = originalFile.clone();
            generatedFile.contents = Buffer.from(c.code);
            generatedFile.path = c.path!;
            this.push(generatedFile);
          });

        callback();
      }
    },
  });

  return stream;
}

export default function compile(dir: string, outDir: string) {
  if (fs.existsSync(outDir)) {
    deleteFolderRecursive(outDir);
  }
  fs.mkdirSync(outDir);
  fs.readdirSync(dir, { withFileTypes: true })
    .filter(({ name }) => name.search(/.ts(x?)$/) >= -1)
    .forEach(({ name }) => {
      const source = ts.createSourceFile(
        name,
        fs.readFileSync(`${dir}/${name}`).toString(),
        ts.ScriptTarget.ES2016,
        true
      );
      const factoryCode = generateFactoryCode(ts, source);
      fs.writeFileSync(
        `${outDir}/${name.replace(path.extname(name), ".js")}`,
        factoryCode
      );
    });
}

export { compileCode };
