function view(viewModel: Widget) {
  return <div ref={viewModel.divRef as any}></div>;
}

export declare type WidgetInputType = {
  prop1?: number;
  prop2?: number;
};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  HTMLAttributes,
} from "react";

export type WidgetRef = {
  getHeight: (p: number, p1: any) => string;
  getSize: () => string;
};
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  divRef: any;
  restAttributes: RestProps;
}

const Widget = forwardRef<WidgetRef, typeof WidgetInput & RestProps>(
  function widget(props: typeof WidgetInput & RestProps, ref) {
    const divRef = useRef<HTMLDivElement>();

    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { prop1, prop2, ...restProps } = props;
        return restProps;
      },
      [props]
    );
    const __getHeight = useCallback(
      function __getHeight(p: number = 10, p1: any): string {
        return `${props.prop1} + ${props.prop2} + ${
          divRef.current!.innerHTML
        } + ${p}`;
      },
      [props.prop1, props.prop2]
    );
    const __getSize = useCallback(
      function __getSize(): string {
        return `${props.prop1} + ${divRef.current!.innerHTML} + ${__getHeight(
          0,
          0
        )}`;
      },
      [props.prop1, props.prop2]
    );

    useImperativeHandle(
      ref,
      () => ({ getHeight: __getHeight, getSize: __getSize }),
      [__getHeight, __getSize]
    );
    return view({
      props: { ...props },
      divRef,
      restAttributes: __restAttributes(),
    });
  }
) as React.FC<
  typeof WidgetInput & RestProps & { ref?: React.Ref<WidgetRef> }
> & { defaultProps: typeof WidgetInput };
export default Widget;

Widget.defaultProps = {
  ...WidgetInput,
};
