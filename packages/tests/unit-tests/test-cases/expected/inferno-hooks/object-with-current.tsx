function view(model: Widget): any {
  return <span></span>;
}
type EventCallBack<Type> = (e: Type) => void;

export type WidgetInputType = {
  someProp?: { current: string };
};
export const WidgetInput: WidgetInputType = {};
import {
  useState,
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
  props: typeof WidgetInput & RestProps;
  someState?: { current: string };
  existsState: { current: string };
  concatStrings: () => any;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof WidgetInput & RestProps) {
  const [__state_someState, __state_setSomeState] = useState<
    { current: string } | undefined
  >(undefined);
  const [__state_existsState, __state_setExistsState] = useState<{
    current: string;
  }>({ current: 'value' });

  const __concatStrings = useCallback(
    function __concatStrings(): any {
      const fromProps = props.someProp?.current || '';
      const fromState = __state_someState?.current || '';
      return `${fromProps}${fromState}${__state_existsState.current}`;
    },
    [props.someProp, __state_someState, __state_existsState]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someProp, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    someState: __state_someState,
    existsState: __state_existsState,
    concatStrings: __concatStrings,
    restAttributes: __restAttributes(),
  });
}

HooksWidget.defaultProps = WidgetInput;

function HooksWidget(props: typeof WidgetInput & RestProps) {
  return <HookComponent renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
