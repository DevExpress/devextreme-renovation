import { ReactComponent, GetAccessor } from '@devextreme-generator/react';
import { ObjectLiteral, isComponentWrapper } from '@devextreme-generator/core';

export class InfernoComponent extends ReactComponent {
  compileImportStatements(hooks: string[], compats: string[], core: string[]): string[] {
    const componentImports = this.jQueryRegistered
      ? ['InfernoWrapperComponent', 'useReRenderEffect']
      : ['HookComponent'];

    const imports = [];
    const namedImports = hooks
      .concat(core)
      .concat(componentImports)
      .concat(compats);
    if (namedImports.length) {
      if (compats.includes('forwardRef')) {
        namedImports.push('RefObject');
      }
      imports.push(`import {${namedImports.join(',')}} from '@devextreme/runtime/inferno-hooks'`);
    }
    imports.push('import { normalizeStyles } from \'@devextreme/runtime/common\'');
    if (this.props.some((p) => p.isTemplate) && !isComponentWrapper(this.context.imports)) {
      const runTimeImports = isComponentWrapper(this.context.imports) ? 'getWrapperTemplate' : 'getTemplate';
      imports.push(`import { ${runTimeImports} } from '@devextreme/runtime/react'`);
    }
    return imports;
  }

  get jQueryRegistered(): boolean {
    const jqueryProp = this.decorators[0].getParameter('jQuery') as
      | ObjectLiteral
      | undefined;
    return jqueryProp?.getProperty('register')?.toString() === 'true';
  }

  get apiRefType(): string {
    return this.members.find((m) => m.isApiMethod)
      ? `${this.name}Ref`
      : 'any';
  }

  defaultPropsDest(): string {
    return `Hooks${this.name.toString()}.defaultProps`;
  }
  // if have forwardRef -> forwardref((props, ref)=>{})
  // if jqueryRegistered -> createRerenderEffect

  compileHooksWrapper(): string {
    const name = this.name;
    if (this.hasApiMethod) {
      return `
      function Hooks${name}(props: ${this.compilePropsType()}, ref: RefObject<${this.apiRefType}>) {
      return <${this.jQueryRegistered ? 'InfernoWrapperComponent' : 'HookComponent'} renderFn={
          React${name}
        } renderProps={props} renderRef={ref}/>
      }
      const ${name} = forwardRef(Hooks${name});


      export { ${name} };

      export default ${name};
    `;
    }
    // check default props with forwardRef
    return `
    function Hooks${name}(props: ${this.compilePropsType()}) {
    return <${this.jQueryRegistered ? 'InfernoWrapperComponent' : 'HookComponent'} renderFn={
      React${name}
      } renderProps={props}/>
    }
    export {Hooks${name} as ${name}}
    export default Hooks${name};`;
  }

  get hasApiMethod(): boolean {
    return this.members.some((m) => m.isApiMethod);
  }

  toString(): string {
    const getTemplateFunc = this.compileTemplateGetter();
    // const modifiers = this.modifiers.filter((m) => m !== 'default');
    return `
              ${this.compileImports()}
              ${this.compilePortalComponent()}
              ${this.compileNestedComponents()}
              ${this.compileComponentRef()}
              ${this.compileRestProps()}
              ${this.compileComponentInterface()}
              ${getTemplateFunc}
              ${!this.hasApiMethod
        ? `function React${this.name}(props: ${this.compilePropsType()}){`
        : `const React${this.name} = (props: ${this.compilePropsType()}, ref: RefObject<${this.apiRefType}>) => {`
      }
                  ${this.compileUseRef()}
                  ${this.stateDeclaration()}
                  ${this.members
        .filter(
          (m) => (m.isConsumer || m.isProvider)
            && !(m instanceof GetAccessor),
        )
        .map((m) => m.toString(this.getToStringOptions()))
        .join(';\n')}
                  ${this.compileGettersAndMethods()}
                  ${this.compileUseEffect()}
                  ${this.compileUseImperativeHandle()}
                  return ${this.compileViewCall()}
    }

              ${this.compileDefaultProps()}
              ${this.compileDefaultOptionsMethod()}
              ${this.compileHooksWrapper()}
    `;
  }
}
