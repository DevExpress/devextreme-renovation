import { MutableRefObject } from "react";
import { Child1Component } from "./child1";
import { Child2Component } from "./child2";
export const viewFunction = ({ forwardedRef }: ParentComponent): any => (
  <Child1Component forwardedRef={forwardedRef} />
);

export declare type ParentComponentPropsType = {
  someProp: number;
};
export const ParentComponentProps: ParentComponentPropsType = {
  someProp: 0,
};
import { Child2ComponentRef as Child2ComponentRef } from "./child2";
import * as React from "react";
import { useCallback, useEffect, useRef } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface ParentComponent {
  props: typeof ParentComponentProps & RestProps;
  forwardedRef: any;
  restAttributes: RestProps;
}

export function ParentComponent(
  props: typeof ParentComponentProps & RestProps
) {
  const __forwardedRef: MutableRefObject<Child2ComponentRef | null> =
    useRef<Child2ComponentRef>(null);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someProp, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    console.log(__forwardedRef.current!.twoPlusTwo());
  }, []);

  return viewFunction({
    props: { ...props },
    forwardedRef: __forwardedRef,
    restAttributes: __restAttributes(),
  });
}

export default ParentComponent;

ParentComponent.defaultProps = ParentComponentProps;
