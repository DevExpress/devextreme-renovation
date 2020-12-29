import { ImportDeclaration as BaseImportDeclaration } from "../../base-generator/expressions/import";

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    const inferno: string[] = [];
    const result: string[] = [];
    if (this.has("Fragment")) {
      inferno.push("Fragment");
    }
    if (this.has("Portal")) {
      result.push(`import {Portal} from ${this.resolveCommonModule("portal")}`);
    }

    if (inferno.length) {
      result.push(`import {${inferno}} from "inferno"`);
    }

    if (this.has("Effect")) {
      result.push(
        `import {InfernoEffect} from ${this.resolveCommonModule("effect")}`
      );
    }

    if (this.has("Component")) {
      result.push(
        `import {InfernoComponent} from ${this.resolveCommonModule(
          "base_component"
        )}`
      );
    }

    if (this.has("createContext")) {
      result.push(
        `import {createContext} from ${this.resolveCommonModule(
          "create_context"
        )}`
      );
    }

    if (result.length) {
      return result.join(";\n");
    }
    return super.compileComponentDeclarationImport();
  }
}
