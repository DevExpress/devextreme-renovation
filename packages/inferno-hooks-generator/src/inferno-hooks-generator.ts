import {
  ReactGenerator, Method, Property, JsxAttribute,
} from '@devextreme-generator/react';
import {
  Decorator, Identifier, HeritageClause, ImportClause, StringLiteral, JsxSpreadAttribute,
} from '@devextreme-generator/core';
import { InfernoComponent } from './inferno-component';
import { ImportDeclaration } from './import-declaration';
import { JsxOpeningElement, JsxClosingElement } from './jsx-elements';

export class InfernoGenerator extends ReactGenerator {
  getPlatform(): string {
    return 'inferno-hooks';
  }

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new InfernoComponent(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext(),
    );
  }

  createImportDeclarationCore(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    importClause: ImportClause,
    moduleSpecifier: StringLiteral,
  ) {
    return new ImportDeclaration(
      decorators,
      modifiers,
      importClause,
      moduleSpecifier,
      this.getContext(),
    );
  }

  createJsxOpeningElement(
    tagName: Identifier,
    typeArguments: any[],
    attributes?: Array<JsxAttribute | JsxSpreadAttribute>,
  ) {
    return new JsxOpeningElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext(),
    );
  }

  createJsxClosingElement(tagName: Identifier) {
    return new JsxClosingElement(tagName);
  }
}
