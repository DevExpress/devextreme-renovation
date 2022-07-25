import { createContext } from '@devextreme/runtime/inferno-hooks';
const SimpleContext = createContext<number>(5);
function view(viewModel: Widget) {
  return <div></div>;
}
type UserType = 'user' | 'not';

export type PropsType = {
  p: number;
};
export const Props: PropsType = {
  p: 10,
};
import {
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof Props & RestProps;
  i: number;
  provide: any;
  cons: number;
  g1: number[];
  g2: number;
  g3: number;
  g4: number[];
  g5: number[];
  userGet: UserType;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof Props & RestProps) {
  const [__state_i, __state_setI] = useState<number>(10);
  const mutableVar = useRef<number>(10);
  const cons = useContext(SimpleContext);
  const __provide = useCallback(
    function __provide(): any {
      return __state_i;
    },
    [__state_i]
  );
  const __g1 = useMemo(
    function __g1(): number[] {
      return [props.p, __state_i];
    },
    [props.p, __state_i]
  );
  const __g2 = useCallback(
    function __g2(): number {
      return props.p;
    },
    [props.p]
  );
  const __g3 = useCallback(
    function __g3(): number {
      return __state_i;
    },
    [__state_i]
  );
  const __g4 = useMemo(
    function __g4(): number[] {
      return [cons];
    },
    [cons]
  );
  const __g5 = useCallback(
    function __g5(): number[] {
      return [__state_i, mutableVar.current!];
    },
    [__state_i, mutableVar]
  );
  const __userGet = useCallback(function __userGet(): UserType {
    return 'user';
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { p, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return (
    <SimpleContext.Provider value={__provide()}>
      {view({
        props: { ...props },
        i: __state_i,
        cons,
        provide: __provide(),
        g1: __g1,
        g2: __g2(),
        g3: __g3(),
        g4: __g4,
        g5: __g5(),
        userGet: __userGet(),
        restAttributes: __restAttributes(),
      })}
    </SimpleContext.Provider>
  );
}

HooksWidget.defaultProps = Props;

function HooksWidget(props: typeof Props & RestProps) {
  return <InfernoWrapperComponent renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
class SomeClass {
  i: number = 2;
  get numberGetter(): number[] {
    return [this.i, this.i];
  }
}
