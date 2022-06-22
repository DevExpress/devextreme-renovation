import {
  compileCode, generateFactoryCode, GeneratorAPI, GeneratorResult,
} from '@devextreme-generator/core';
import fs from 'fs';
import path from 'path';
import Stream from 'stream';
import ts from 'typescript';
import File from 'vinyl';

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
          true,
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

  stream.on('end', () => generator.resetCache());

  return stream;
}
export function compile(dir: string, outDir: string,
  platform: 'vue' | 'react' | 'inferno', extention = /.ts(x?)$/): void {
  if (fs.existsSync(outDir)) {
    deleteFolderRecursive(outDir);
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.readdirSync(dir, { withFileTypes: true })
    .filter(({ name }) => name.search(extention) >= 0)
    .forEach(({ name }) => {
      const code = fs.readFileSync(`${dir}/${name}`).toString();
      const source = ts.createSourceFile(
        name.replace(path.extname(name), '.tsx'),
        code,
        ts.ScriptTarget.ES2016,
        true,
      );
      const factoryCode = generateFactoryCode(ts, source, platform);
      fs.writeFileSync(
        `${outDir}/${name.replace(path.extname(name), '.js')}`,
        factoryCode,
      );
    });
}
