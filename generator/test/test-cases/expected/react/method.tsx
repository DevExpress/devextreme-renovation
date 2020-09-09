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
  (props: typeof WidgetInput & RestProps, ref) => {
    const divRef = useRef<HTMLDivElement>();

    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { prop1, prop2, ...restProps } = props;
        return restProps;
      },
      [props]
    );
    const getHeight = useCallback(
      function getHeight(p: number = 10, p1: any): string {
        return `${props.prop1} + ${props.prop2} + ${
          divRef.current!.innerHTML
        } + ${p}`;
      },
      [props.prop1, props.prop2]
    );
    const getSize = useCallback(
      function getSize(): string {
        return `${props.prop1} + ${divRef.current!.innerHTML}`;
      },
      [props.prop1]
    );

    useImperativeHandle(ref, () => ({ getHeight, getSize }), [
      getHeight,
      getSize,
    ]);
    return view({
      props: { ...props },
      divRef,
      restAttributes: __restAttributes(),
    });
  }
);
export default Widget;

Widget.defaultProps = {
  ...WidgetInput,
};
