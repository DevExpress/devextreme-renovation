import { MutableRefObject } from "react";
import { Child2Component } from "./child2";
export const viewFunction = ({
  props: { forwardedRef },
}: Child1Component): any => <Child2Component ref={forwardedRef} />;

export declare type Child1ComponentPropsType = {
  forwardedRef: any;
};
export const Child1ComponentProps: Child1ComponentPropsType =
  {} as any as Child1ComponentPropsType;
import { Child2ComponentRef as Child2ComponentRef } from "./child2";
import * as React from "react";
import { useCallback, useEffect, useRef } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Child1Component {
  props: typeof Child1ComponentProps & RestProps;
  someGetter: Partial<typeof Child1ComponentProps>;
  restAttributes: RestProps;
  forwardedRef: any;
}

export function Child1Component(
  props: typeof Child1ComponentProps & RestProps
) {
  const forwardedRef: MutableRefObject<Child2ComponentRef | null> =
    useRef<Child2ComponentRef>(null);

  const __someGetter = useCallback(function __someGetter(): Partial<
    typeof Child1ComponentProps
  > {
    return {};
  },
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { forwardedRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    console.log(props.forwardedRef.current!.twoPlusTwo());
  }, []);

  return viewFunction({
    props: { ...props },
    forwardedRef: forwardedRef,
    someGetter: __someGetter(),
    restAttributes: __restAttributes(),
  });
}

export default Child1Component;

Child1Component.defaultProps = Child1ComponentProps;
