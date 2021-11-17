export const viewFunction = (): any => <div />;

export declare type Child2ComponentPropsType = {
  someProps: number;
};
export const Child2ComponentProps: Child2ComponentPropsType = {
  someProps: 0,
};
import * as React from "react";
import { useCallback, useImperativeHandle, forwardRef } from "react";

export type Child2ComponentRef = { twoPlusTwo: () => number };
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Child2Component {
  props: typeof Child2ComponentProps & RestProps;
  restAttributes: RestProps;
}

const Child2Component = forwardRef<
  Child2ComponentRef,
  typeof Child2ComponentProps & RestProps
>(function child2Component(
  props: typeof Child2ComponentProps & RestProps,
  ref
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someProps, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __twoPlusTwo = useCallback(function __twoPlusTwo(): number {
    return 2 + 2;
  }, []);

  useImperativeHandle(ref, () => ({ twoPlusTwo: __twoPlusTwo }), [
    __twoPlusTwo,
  ]);
  return viewFunction();
}) as React.FC<
  typeof Child2ComponentProps &
    RestProps & { ref?: React.Ref<Child2ComponentRef> }
> & { defaultProps: typeof Child2ComponentProps };
export { Child2Component };

export default Child2Component;

Child2Component.defaultProps = Child2ComponentProps;
