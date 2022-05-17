import {
  Decorators,
  SyntaxKind,
  isComponentWrapper,
} from '@devextreme-generator/core';

import {
  compileGettersCompatibleExtend,
  ComponentInput as BaseComponentInput,
  Property,
} from '@devextreme-generator/react';

export class ComponentInput extends BaseComponentInput {
  toString(): string {
    const types = this.heritageClauses.reduce(
      (t: string[], h) => t.concat(h.typeNodes.map((t) => `typeof ${t}`)),
      [],
    );
    const typeName = `${this.name}Type`;

    const properties = this.members.filter(
      (m) => !(m as Property).inherited,
    ) as Property[];

    const typeDeclaration = `export type ${typeName} = ${types
      .concat([
        `{
                ${properties.map((p) => p.typeDeclaration()).join(';\n')}
                ${isComponentWrapper(this.context.imports) ? 'isReactComponentWrapper?: boolean' : ''}
            }`,
      ])
      .join('&')}`;

    const typeCasting = properties.some(
      (p) => (p.questionOrExclamationToken === SyntaxKind.ExclamationToken
                && !p.initializer)
                || (p.type.toString() === 'any'
                    && !p.questionOrExclamationToken
                    && !p.initializer)
                || (p.isState && p.questionOrExclamationToken === ''),
    )
      ? ` as any as ${typeName}`
      : '';

    const declarationModifiers = this.modifiers.indexOf('default') !== -1 ? [] : this.modifiers;

    const propertiesWithInitializer = this.members
      .filter(
        (m) => !(m as Property).inherited
                    && (m as Property).initializer
                    && m.decorators.find((d) => d.name !== Decorators.TwoWay),
      )
      .filter((m) => !m.isNested) as Property[];

    const options = {
      members: [],
      componentInputs: Object.keys(this.context.components || {}).reduce(
        (componentInputArr, key) => {
          const component = this.context.components?.[key];
          if (component instanceof ComponentInput) {
            componentInputArr.push(component);
          }
          return componentInputArr;
        },
        [] as ComponentInput[],
      ),
      fromType: this.fromType,
    };

    const defaultObject = `{
        ${propertiesWithInitializer
    .map((p) => p.defaultProps(options))
    .join(',\n')}
      ${isComponentWrapper(this.context.imports) ? ',isReactComponentWrapper: true' : ''}
     }`;

    let defaultProps = defaultObject;
    const inheritedBaseType = this.baseTypes[0];

    if (inheritedBaseType) {
      defaultProps = propertiesWithInitializer.length
        ? compileGettersCompatibleExtend(inheritedBaseType, defaultObject)
        : inheritedBaseType;
    }
    return `${this.compileImports()}
            ${typeDeclaration}
            ${declarationModifiers.join(' ')} const ${this.name}:${typeName}=${defaultProps}${typeCasting};
            ${declarationModifiers !== this.modifiers
    ? `${this.modifiers.join(' ')} ${this.name}`
    : ''
}`;
  }
}
