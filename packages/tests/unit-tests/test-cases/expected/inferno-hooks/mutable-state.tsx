function view(viewModel: Widget) {
  return <div></div>;
}

export type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import {
  useCallback,
  useEffect,
  useRef,
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
  setObj: () => any;
  getValue: () => any;
  getObj: () => any;
  destruct: () => any;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof WidgetInput & RestProps) {
  const obj = useRef<{ value?: number }>();
  const notDefinedObj = useRef<{ value?: number } | undefined>();
  const definedObj = useRef<{ value?: number }>({ value: 0 });

  const __setObj = useCallback(
    function __setObj(): any {
      obj.current!.value = 0;
      definedObj.current!.value = 0;
      notDefinedObj.current! = notDefinedObj.current! || {};
      notDefinedObj.current!.value = 0;
    },
    [notDefinedObj]
  );
  const __getValue = useCallback(
    function __getValue(): any {
      const a: number = obj.current!.value ?? 0;
      const b: number = notDefinedObj.current?.value ?? 0;
      const c: number = definedObj.current!.value ?? 0;
      return a + b + c;
    },
    [obj, notDefinedObj, definedObj]
  );
  const __getObj = useCallback(
    function __getObj(): any {
      return obj.current!;
    },
    [obj]
  );
  const __destruct = useCallback(
    function __destruct(): any {
      const a = obj.current!.value;
      const b = definedObj.current!.value;
      const c = notDefinedObj.current?.value;
    },
    [obj, notDefinedObj, definedObj]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    __setObj();
  }, [__setObj]);

  return view({
    props: { ...props },
    setObj: __setObj,
    getValue: __getValue,
    getObj: __getObj,
    destruct: __destruct,
    restAttributes: __restAttributes(),
  });
}

HooksWidget.defaultProps = WidgetInput;

function HooksWidget(props: typeof WidgetInput & RestProps) {
  return <HookComponent renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
