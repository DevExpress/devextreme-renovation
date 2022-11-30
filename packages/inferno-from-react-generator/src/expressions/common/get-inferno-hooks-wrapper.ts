import { ComponentInfo } from '../../component-info';

export function getInfernoHooksWrapper(
  { name, jQueryRegistered, hasApiMethod }: ComponentInfo,
  addExport = false,
  isPureComponent = false,
): string {
  if (hasApiMethod) {
    return `
    function Hooks${name}(props, ref) {
    return <${jQueryRegistered ? 'InfernoWrapperComponent' : 'HookContainer'} renderFn={
        React${name}
      } renderProps={props} renderRef={ref} ${isPureComponent ? 'pure' : ''}/>
    }
    const ${name} = forwardRef(Hooks${name});
    ${addExport ? `export { ${name} }` : ''}
  `;
  }
  return `
  function Hooks${name}(props) {
  return <${jQueryRegistered ? 'InfernoWrapperComponent' : 'HookContainer'} renderFn={
    ${name}
    } renderProps={props} ${isPureComponent ? 'pure' : ''}/>
  }
  export {Hooks${name} as ${name}}
  `;
}
