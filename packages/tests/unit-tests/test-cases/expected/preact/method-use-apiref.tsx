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
import * as Preact from "preact";
import { RefObject } from "preact";
import { useCallback, useRef, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";

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
  const __baseRef: RefObject<any> = useRef<any>(null);

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
}) as Preact.FunctionalComponent<typeof WidgetWithApiRefInput & RestProps> & {
  defaultProps: typeof WidgetWithApiRefInput;
};
export default WidgetWithApiRef;

WidgetWithApiRef.defaultProps = {
  ...WidgetWithApiRefInput,
};

export default WidgetWithApiRef;
