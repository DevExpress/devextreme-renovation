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
}) as Preact.FunctionalComponent<typeof WidgetWithPropsInput & RestProps> & {
  defaultProps: typeof WidgetWithPropsInput;
};
export { WidgetWithProps };

WidgetWithProps.defaultProps = WidgetWithPropsInput;

import * as Preact from "preact";
import { useCallback, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";

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
}) as Preact.FunctionalComponent<typeof WidgetWithPropsInput & RestProps> & {
  defaultProps: typeof WidgetWithPropsInput;
};
export { PublicWidgetWithProps };

PublicWidgetWithProps.defaultProps = WidgetWithPropsInput;
