export declare type WidgetWithPropsInputType = {
  value: string;
  optionalValue?: string;
};
export const WidgetWithPropsInput: WidgetWithPropsInputType = {
  value: "default text",
};
import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  HTMLAttributes,
} from "react";

export type WidgetWithPropsRef = { doSomething: () => any };
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetWithPropsInput
>;
interface WidgetWithProps {
  props: typeof WidgetWithPropsInput & RestProps;
  restAttributes: RestProps;
}

const WidgetWithProps = forwardRef<
  WidgetWithPropsRef,
  typeof WidgetWithPropsInput & RestProps
>((props: typeof WidgetWithPropsInput & RestProps, ref) => {
  useImperativeHandle(ref, () => ({ doSomething: () => {} }), []);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { optionalValue, value, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}) as React.FC<
  typeof WidgetWithPropsInput &
    RestProps & { ref: React.Ref<WidgetWithPropsRef> }
> & { defaultProps: typeof WidgetWithPropsInput };
export { WidgetWithProps };

export default WidgetWithProps;

WidgetWithProps.defaultProps = {
  ...WidgetWithPropsInput,
};
function view({ props: { optionalValue, value } }: WidgetWithProps) {
  return <div>{optionalValue || value}</div>;
}
