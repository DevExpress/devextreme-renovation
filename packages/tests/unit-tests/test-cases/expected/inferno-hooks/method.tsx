import { MutableRefObject } from '@devextreme/runtime/inferno-hooks';
function view(viewModel: Widget) {
  return <div ref={viewModel.divRef}></div>;
}

export type WidgetInputType = {
  prop1?: number;
  prop2?: number;
};
const WidgetInput: WidgetInputType = {};
import {
  useCallback,
  useRef,
  useImperativeHandle,
  HookContainer,
  forwardRef,
  RefObject,
} from '@devextreme/runtime/inferno-hooks';

export type WidgetRef = {
  getHeight: (p: number, p1: any) => string;
  getSize: () => string;
};
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  divRef: any;
  restAttributes: RestProps;
}

const ReactWidget = (
  props: typeof WidgetInput & RestProps,
  ref: RefObject<WidgetRef>
) => {
  const __divRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { prop1, prop2, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __getHeight = useCallback(
    function __getHeight(p: number = 10, p1: any): string {
      return `${props.prop1} + ${props.prop2} + ${__divRef.current?.innerHTML} + ${p}`;
    },
    [props.prop1, props.prop2]
  );
  const __getSize = useCallback(
    function __getSize(): string {
      return `${props.prop1} + ${__divRef.current?.innerHTML} + ${__getHeight(
        0,
        0
      )}`;
    },
    [props.prop1, __getHeight]
  );

  useImperativeHandle(
    ref,
    () => ({ getHeight: __getHeight, getSize: __getSize }),
    [__getHeight, __getSize]
  );
  return view({
    props: { ...props },
    divRef: __divRef,
    restAttributes: __restAttributes(),
  });
};

HooksWidget.defaultProps = WidgetInput;

function HooksWidget(
  props: typeof WidgetInput & RestProps,
  ref: RefObject<WidgetRef>
) {
  return (
    <HookContainer renderFn={ReactWidget} renderProps={props} renderRef={ref} />
  );
}
const Widget = forwardRef(HooksWidget);

export { Widget };

export default Widget;
