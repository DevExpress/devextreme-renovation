import { toStringOptions, VariableDeclaration as BaseVariableDeclaration } from '@devextreme-generator/core';
import { PropertyAccess } from '@devextreme-generator/react';

export class VariableDeclaration extends BaseVariableDeclaration {
  processPropInitializer(initializerExpression: PropertyAccess, options: toStringOptions) {
    const initializer = super.processPropInitializer(initializerExpression, options);
    return `${initializer} as any`
  }
}
