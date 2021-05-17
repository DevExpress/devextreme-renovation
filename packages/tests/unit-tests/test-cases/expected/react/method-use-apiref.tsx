import BaseWidget from "./method";
function view(viewModel: WidgetWithApiRef) {
  return (
    <BaseWidget
      ref={viewModel.baseRef}
      prop1={viewModel.props.prop1}
    ></BaseWidget>
  );
}

export declare type WidgetWithApiRefInputType = {
  prop1?: number;
};
const WidgetWithApiRefInput: WidgetWithApiRefInputType = {};
import { WidgetRef as BaseWidgetRef } from "./method";
import * as React from "react";
import {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  MutableRefObject,
} from "react";

export type WidgetWithApiRefRef = { getSomething: () => string };
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface WidgetWithApiRef {
  props: typeof WidgetWithApiRefInput & RestProps;
  baseRef?: any;
  restAttributes: RestProps;
}

const WidgetWithApiRef = forwardRef<
  WidgetWithApiRefRef,
  typeof WidgetWithApiRefInput & RestProps
>(function widgetWithApiRef(
  props: typeof WidgetWithApiRefInput & RestProps,
  ref
) {
  const __baseRef: MutableRefObject<BaseWidgetRef | null> =
    useRef<BaseWidgetRef>(null);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { prop1, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __getSomething = useCallback(
    function __getSomething(): string {
      return `${props.prop1} + ${__baseRef?.current?.getHeight(1, undefined)}`;
    },
    [props.prop1, __baseRef]
  );

  useImperativeHandle(ref, () => ({ getSomething: __getSomething }), [
    __getSomething,
  ]);
  return view({
    props: { ...props },
    baseRef: __baseRef,
    restAttributes: __restAttributes(),
  });
}) as React.FC<
  typeof WidgetWithApiRefInput &
    RestProps & { ref?: React.Ref<WidgetWithApiRefRef> }
> & { defaultProps: typeof WidgetWithApiRefInput };
export default WidgetWithApiRef;

WidgetWithApiRef.defaultProps = {
  ...WidgetWithApiRefInput,
};
