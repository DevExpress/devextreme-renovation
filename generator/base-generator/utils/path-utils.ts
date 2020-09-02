import path from "path";
import fs from "fs";
import { GeneratorCache } from "../types";

export function getRelativePath(
  src: string,
  dst: string,
  moduleName: string = ""
) {
  const relativePath = `${path.relative(src, dst)}${
    moduleName ? `/${moduleName}` : ""
  }`.replace(/\\/gi, "/");
  if (relativePath.startsWith("/")) {
    return `.${relativePath}`;
  }
  if (!relativePath.startsWith(".")) {
    return `./${relativePath}`;
  }
  return relativePath;
}

export function getModuleRelativePath(src: string, moduleSpecifier: string) {
  const normalizedPath = path.normalize(moduleSpecifier);
  const moduleParts = normalizedPath.split(/(\/|\\)/);

  const folderPath = path.resolve(
    moduleParts.slice(0, moduleParts.length - 2).join("/")
  );

  return getRelativePath(src, folderPath, moduleParts[moduleParts.length - 1]);
}

export function readModule(
  module: string,
  cache: GeneratorCache
): string | null {
  if (cache[module]) {
    return module;
  }
  if (fs.existsSync(module)) {
    return module;
  }

  return null;
}

export function resolveModule(
  module: string,
  cache: GeneratorCache
): string | null {
  const ext = path.extname(module);
  if (ext === ".tsx" || ext === ".ts") {
    return readModule(module, cache);
  }
  return (
    readModule(`${module}.tsx`, cache) || readModule(`${module}.ts`, cache)
  );
}
