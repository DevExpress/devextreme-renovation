export const INFERNO_HOOKS_MODULE = '@devextreme/runtime/inferno-hooks';

export function buildHooksImportDeclaration() {
  return {
    toString() {
      return `import { HookContainer, InfernoWrapperComponent } from '${INFERNO_HOOKS_MODULE}'`;
    } 
  }
}
