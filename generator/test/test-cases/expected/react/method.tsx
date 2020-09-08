function view(viewModel: Widget) {
  return <div ref={viewModel.divRef as any}></div>;
}

export declare type WidgetInputType = {
  prop1?: number;
  prop2?: number;
};
const WidgetInput: WidgetInputType = {};
import React, {
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
  (props: typeof WidgetInput & RestProps, ref) => {
    const divRef = useRef<HTMLDivElement>();

    useImperativeHandle(
      ref,
      () => ({
        getHeight: (p: number = 10, p1: any) => {
          return `${props.prop1} + ${props.prop2} + ${
            divRef.current!.innerHTML
          } + ${p}`;
        },
        getSize: () => {
          return `${props.prop1} + ${divRef.current!.innerHTML}`;
        },
      }),
      [props.prop1, props.prop2]
    );

    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { prop1, prop2, ...restProps } = props;
        return restProps;
      },
      [props]
    );

    return view({
      props: { ...props },
      divRef,
      restAttributes: __restAttributes(),
    });
  }
) as React.FC<
  typeof WidgetInput & RestProps & { ref: React.Ref<WidgetRef> }
> & { defaultProps: typeof WidgetInput };
export default Widget;

Widget.defaultProps = {
  ...WidgetInput,
};
