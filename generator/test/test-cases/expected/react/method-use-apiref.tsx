import BaseWidget from "./method";
function view(viewModel: WidgetWithApiRef) {
  return (
    <BaseWidget
      ref={viewModel.baseRef as any}
      prop1={viewModel.props.prop1}
    ></BaseWidget>
  );
}

export declare type WidgetWithApiRefInputType = {
  prop1?: number;
};
const WidgetWithApiRefInput: WidgetWithApiRefInputType = {};
import { WidgetRef as BaseWidgetRef } from "./method";
import React, {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  HTMLAttributes,
} from "react";

export type WidgetWithApiRefRef = { getSomething: () => string };
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetWithApiRefInput
>;
interface WidgetWithApiRef {
  props: typeof WidgetWithApiRefInput & RestProps;
  baseRef: any;
  restAttributes: RestProps;
}

const WidgetWithApiRef = forwardRef<
  WidgetWithApiRefRef,
  typeof WidgetWithApiRefInput & RestProps
>((props: typeof WidgetWithApiRefInput & RestProps, ref) => {
  const baseRef = useRef<BaseWidgetRef>();

  useImperativeHandle(
    ref,
    () => ({
      getSomething: () => {
        return `${props.prop1} + ${baseRef.current?.getHeight(1, undefined)}`;
      },
    }),
    [props.prop1, baseRef.current]
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { prop1, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    baseRef,
    restAttributes: __restAttributes(),
  });
}) as React.FC<
  typeof WidgetWithApiRefInput &
    RestProps & { ref: React.Ref<WidgetWithApiRefRef> }
> & { defaultProps: typeof WidgetWithApiRefInput };
export default WidgetWithApiRef;

WidgetWithApiRef.defaultProps = {
  ...WidgetWithApiRefInput,
};
