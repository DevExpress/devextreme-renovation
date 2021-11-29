function view({ props: { optionalValue, value } }: WidgetWithProps) {
  return <div>{optionalValue || value}</div>;
}

export declare type WidgetWithPropsInputType = {
  value: string;
  optionalValue?: string;
  number?: number;
  onClick?: (e: any) => void;
};
export const WidgetWithPropsInput: WidgetWithPropsInputType = {
  value: "default text",
  number: 42,
};
import * as React from "react";
import { useCallback, useImperativeHandle, forwardRef } from "react";

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
      const { number, onClick, optionalValue, value, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __doSomething = useCallback(function __doSomething(): any {}, []);

  useImperativeHandle(ref, () => ({ doSomething: __doSomething }), [
    __doSomething,
  ]);
  return view({ props: { ...props }, restAttributes: __restAttributes() });
}) as React.FC<
  typeof WidgetWithPropsInput &
    RestProps & { ref?: React.Ref<WidgetWithPropsRef> }
> & { defaultProps: typeof WidgetWithPropsInput };
export { WidgetWithProps };

export default WidgetWithProps;

WidgetWithProps.defaultProps = WidgetWithPropsInput;

import * as React from "react";
import { useCallback, useImperativeHandle, forwardRef } from "react";

export type PublicWidgetWithPropsRef = { doSomething: () => any };
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface PublicWidgetWithProps {
  props: typeof WidgetWithPropsInput & RestProps;
  restAttributes: RestProps;
}

const PublicWidgetWithProps = forwardRef<
  PublicWidgetWithPropsRef,
  typeof WidgetWithPropsInput & RestProps
>(function publicWidgetWithProps(
  props: typeof WidgetWithPropsInput & RestProps,
  ref
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { number, onClick, optionalValue, value, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __doSomething = useCallback(function __doSomething(): any {}, []);

  useImperativeHandle(ref, () => ({ doSomething: __doSomething }), [
    __doSomething,
  ]);
  return view({ props: { ...props }, restAttributes: __restAttributes() });
}) as React.FC<
  typeof WidgetWithPropsInput &
    RestProps & { ref?: React.Ref<PublicWidgetWithPropsRef> }
> & { defaultProps: typeof WidgetWithPropsInput };
export { PublicWidgetWithProps };

export default PublicWidgetWithProps;

PublicWidgetWithProps.defaultProps = WidgetWithPropsInput;
