import { ImportDeclaration as BaseImportDeclaration } from "../../base-generator/expressions/import";
import path from "path";

export class ImportDeclaration extends BaseImportDeclaration {
  toString() {
    if (path.extname(this.moduleSpecifier.expression.toString()) === ".d") {
      return "";
    }
    return super.toString();
  }
}
