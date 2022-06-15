import { ComponentInfo } from '../../component-info';

export function getInfernoHooksWrapper(
  { name, jQueryRegistered, hasApiMethod }: ComponentInfo,
  addExport = false,
): string {
  if (hasApiMethod) {
    return `
    function Hooks${name}(props, ref) {
    return <${jQueryRegistered ? 'InfernoWrapperComponent' : 'HookContainer'} renderFn={
        React${name}
      } renderProps={props} renderRef={ref}/>
    }
    const ${name} = forwardRef(Hooks${name});
    ${addExport ? `export { ${name} }` : ''}
  `;
  }
  return `
  function Hooks${name}(props) {
  return <${jQueryRegistered ? 'InfernoWrapperComponent' : 'HookContainer'} renderFn={
    ${name}
    } renderProps={props}/>
  }
  export {Hooks${name} as ${name}}
  `;
}
