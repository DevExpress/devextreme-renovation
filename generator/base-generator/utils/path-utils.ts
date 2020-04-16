import path from "path";

export function getRelativePath(src: string, dst: string, moduleName: string = "") { 
    const relativePath = `${path.relative(src, dst)}${moduleName ? `/${moduleName}` : ""}`.replace(/\\/gi, "/");
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

    const folderPath = path.resolve(moduleParts.slice(0, moduleParts.length - 2).join("/"));

    return getRelativePath(src, folderPath, moduleParts[moduleParts.length - 1]);
}
