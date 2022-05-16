import { GetPropsType } from '@devextreme/runtime/react';
import { createContext } from 'react';
function view(model: Widget): any {
  return <span></span>;
}
const P1Context = createContext(5);
const ContextForConsumer = createContext(null);
const GetterContext = createContext('default');

interface PropsType {
  p1?: number;
}

const Props = {
  p1: 10,
} as Partial<PropsType>;
import {
  useState,
  useContext,
  useCallback,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: Required<GetPropsType<typeof Props>> & RestProps;
  contextConsumer: number;
  provider: number;
  consumer: any;
  sum: any;
  contextProvider: any;
  restAttributes: RestProps;
}

export function Widget(props: typeof Props & RestProps) {
  const contextConsumer = useContext(P1Context);
  const [provider] = useState(10);
  const consumer = useContext(ContextForConsumer);
  const __sum = useCallback(
    function __sum(): any {
      return provider + contextConsumer;
    },
    [provider, contextConsumer]
  );
  const __contextProvider = useCallback(function __contextProvider(): any {
    return 'provide';
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { p1, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return (
    <GetterContext.Provider value={__contextProvider()}>
      <P1Context.Provider value={provider}>
        {view({
          props: { ...props },
          contextConsumer,
          provider,
          consumer,
          sum: __sum(),
          contextProvider: __contextProvider(),
          restAttributes: __restAttributes(),
        })}
      </P1Context.Provider>
    </GetterContext.Provider>
  );
}

function HooksWidget(props: typeof Props & RestProps) {
  return <HookComponent renderFn={Widget} renderProps={props}></HookComponent>;
}
export default HooksWidget;
