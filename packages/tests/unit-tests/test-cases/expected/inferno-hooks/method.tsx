import { MutableRefObject } from 'react';
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
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';
import { forwardRef } from 'inferno';

export type WidgetRef = {
  getHeight: (p: number, p1: any) => string;
  getSize: () => string;
};
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  divRef: any;
  restAttributes: RestProps;
}

const Widget = (ref: any) =>
  function widget(props: typeof WidgetInput & RestProps) {
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
  } as React.FC<
    typeof WidgetInput & RestProps & { ref?: React.Ref<WidgetRef> }
  > & { defaultProps: typeof WidgetInput };

Widget.defaultProps = WidgetInput;

let refs = new WeakMap();
const WidgetFn = (ref: any) => {
  if (!refs.has(ref)) {
    refs.set(ref, Widget(ref));
  }
  return refs.get(ref);
};

function HooksWidget(props: typeof WidgetInput & RestProps, ref: any) {
  return <HookComponent renderFn={WidgetFn(ref)} renderProps={props} />;
}
const HooksWidgetFR = forwardRef(HooksWidget);

export { HooksWidgetFR };

export default HooksWidgetFR;
