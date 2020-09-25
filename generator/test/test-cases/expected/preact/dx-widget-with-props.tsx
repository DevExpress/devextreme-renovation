export declare type WidgetWithPropsInputType = {
  value: string;
  optionalValue?: string;
};
export const WidgetWithPropsInput: WidgetWithPropsInputType = {
  value: "default text",
};
import * as Preact from "preact";
import { useCallback, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";

export type WidgetWithPropsRef = { doSomething: () => any };
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface WidgetWithProps {
  props: typeof WidgetWithPropsInput & RestProps;
  restAttributes: RestProps;
}

const WidgetWithProps = forwardRef<
  WidgetWithPropsRef,
  typeof WidgetWithPropsInput & RestProps
>(function widgetWithProps(
  props: typeof WidgetWithPropsInput & RestProps,
  ref
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { optionalValue, value, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __doSomething = useCallback(function __doSomething(): any {}, []);

  useImperativeHandle(ref, () => ({ doSomething: __doSomething }), [
    __doSomething,
  ]);
  return view({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}) as Preact.FunctionalComponent<typeof WidgetWithPropsInput & RestProps> & {
  defaultProps: typeof WidgetWithPropsInput;
};
export { WidgetWithProps };

WidgetWithProps.defaultProps = {
  ...WidgetWithPropsInput,
};
function view({ props: { optionalValue, value } }: WidgetWithProps) {
  return <div>{optionalValue || value}</div>;
}
