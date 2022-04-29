import { createContext } from '@devextreme/runtime/inferno-hooks';
import { Context } from './context';
import { PluginContext } from './context';
function view(model: GridComponent) {
  return <div>{model.props.children}</div>;
}
const context = createContext({});

export type PropsType = {
  children: React.ReactNode;
};
const Props: PropsType = {} as any as PropsType;
import {
  useState,
  useCallback,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface GridComponent {
  props: typeof Props & RestProps;
  contextProvider: PluginContext;
  restAttributes: RestProps;
}

function ReactGridComponent(props: typeof Props & RestProps) {
  const [contextProvider] = useState(new PluginContext());
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return (
    <Context.Provider value={contextProvider}>
      {view({
        props: { ...props },
        contextProvider,
        restAttributes: __restAttributes(),
      })}
    </Context.Provider>
  );
}

HooksGridComponent.defaultProps = Props;

function HooksGridComponent(props: typeof Props & RestProps) {
  return (
    <InfernoWrapperComponent
      renderFn={ReactGridComponent}
      renderProps={props}
    />
  );
}
export { HooksGridComponent as GridComponent };
export default HooksGridComponent;
