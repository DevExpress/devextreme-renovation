import { ReactGenerator, Method, Property } from '@devextreme-generator/react';
import { Decorator, Identifier, HeritageClause } from '@devextreme-generator/core';
import { InfernoComponent } from './inferno-component';

export class InfernoGenerator extends ReactGenerator {
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
}
