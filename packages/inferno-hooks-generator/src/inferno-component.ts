import { ReactComponent, GetAccessor } from '@devextreme-generator/react';
import { ObjectLiteral, isComponentWrapper, lowerizeFirstLetter } from '@devextreme-generator/core';

export class InfernoComponent extends ReactComponent {
  compileImportStatements(hooks: string[], compats: string[], core: string[]): string[] {
    const componentImports = this.jQueryRegistered
      ? ['InfernoWrapperComponent', 'useReRenderEffect']
      : ['HookComponent'];

    const imports = [];
    const namedImports = hooks
      .concat(core)
      .concat(componentImports);
    if (namedImports.length) {
      imports.push(`import {${namedImports.join(',')}} from '@devextreme/runtime/inferno-hooks'`);
    }
    imports.push('import { normalizeStyles } from \'@devextreme/runtime/common\'');
    if (this.props.some((p) => p.isTemplate) && !isComponentWrapper(this.context.imports)) {
      const runTimeImports = isComponentWrapper(this.context.imports) ? 'getWrapperTemplate' : 'getTemplate';
      imports.push(`import { ${runTimeImports} } from '@devextreme/runtime/react'`);
    }
    if (compats.length > 0) {
      imports.push(`import {${compats.join(', ')}} from 'inferno'`);
    }
    return imports;
  }

  get jQueryRegistered(): boolean {
    const jqueryProp = this.decorators[0].getParameter('jQuery') as
      | ObjectLiteral
      | undefined;
    return jqueryProp?.getProperty('register')?.toString() === 'true';
  }

  get forwardRefApiType(): string {
    return this.members.find((m) => m.inherited && m.isApiRef)
      ?.typeDeclaration() || 'any';
  }
  // if have apiMethod -> (ref)=>(props)=>{}
  // if have forwardRef -> forwardref((props, ref)=>{})
  // if jqueryRegistered -> createRerenderEffect

  compileHooksWrapper(): string {
    const name = this.name;

    const createRerender = `function createRerenderEffect(ref: ${this.forwardRefApiType}){
        useReRenderEffect()
        ${name}Fn(ref);
      }`;

    if (this.hasApiMethod) {
      return `let refs = new WeakMap();
      const ${name}Fn = (ref: ${this.forwardRefApiType})=>{
        if(!refs.has(ref)){
            refs.set(ref, ${name}(ref));
        }
        return refs.get(ref)
      }
      ${this.jQueryRegistered ? createRerender : ''}
      function Hooks${name}(props: ${this.compilePropsType()}, ref: ${this.forwardRefApiType}) {
      return <${this.jQueryRegistered ? 'InfernoWrapperComponent' : 'HookComponent'} renderFn={
          ${this.jQueryRegistered ? 'createRerenderEffect(ref)' : `${name}Fn(ref)`}
        } renderProps={props} />
      }
      const Hooks${name}FR = forwardRef(Hooks${name})


      export { Hooks${name}FR };

      export default Hooks${name}FR;
    `;
    }
    return `
    function Hooks${this.name}(props: ${this.compilePropsType()}) {
    return <HookComponent renderFn={
        ${this.name}
      } renderProps={props} ></HookComponent>
    }
    export default Hooks${this.name};`;
  }

  compileComponentFunctionDefinition(): string {
    const propsNormalization = this.compileInPropsNormalization();
    const propsName = propsNormalization ? `inProps: ${this.compilePropsType()}` : `props: ${this.compilePropsType()}`;
    const modifiers = this.modifiers.filter((m) => m !== 'default');
    return `${!this.hasApiMethod
      ? `${modifiers.join(' ')} function ${this.name
      }(${propsName}){`
      : `const ${this.name} = (ref: ${this.forwardRefApiType})=>function ${lowerizeFirstLetter(
        this.name,
      )}(${propsName}){`
    }
    ${propsNormalization}`;
  }

  get hasApiMethod(): boolean {
    return this.members.some((m) => m.isApiMethod);
  }

  toString(): string {
    const getTemplateFunc = this.compileTemplateGetter();
    return `
              ${this.compileImports()}
              ${this.compilePortalComponent()}
              ${this.compileNestedComponents()}
              ${this.compileComponentRef()}
              ${this.compileRestProps()}
              ${this.compileModelPropsType()}
              ${this.compileComponentInterface()}
              ${getTemplateFunc}
              ${this.compileComponentFunctionDefinition()}
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
              ${!this.hasApiMethod
    ? '}'
    : `} as ${this.compileFunctionalComponentType()};`
}

              ${this.compileDefaultProps()}
              ${this.compileDefaultOptionsMethod()}
              ${this.compileHooksWrapper()}
    `;
  }
}
