import {
  Identifier, ImportClause, ImportSpecifier, NamedImports, NamespaceImport, StringLiteral,
} from '@devextreme-generator/core';
import { ImportDeclaration } from '../import';

describe('ImportDeclaration', () => {
  it('remove - import * as react from "react"', () => {
    const importExpression = new ImportDeclaration(
      undefined,
      undefined,
      new ImportClause(
        undefined,
        new NamespaceImport(new Identifier('React')),
        false,
      ),
      new StringLiteral('react'),
      {},
    );
    expect(importExpression.toString()).toBe('');
  });
  it('add additional components import from infernohooks', () => {
    const importExpression = new ImportDeclaration(
      undefined,
      undefined,
      new ImportClause(
        undefined,
        new NamedImports([new ImportSpecifier(
          undefined,
          new Identifier('useCallback'),
        )]),
        false,
      ),
      new StringLiteral('react'),
      {},
    );
    expect(importExpression.toString()).toBe('import {useCallback,HookContainer,InfernoWrapperComponent} from \"@devextreme/runtime/inferno-hooks\"');
  });
});
