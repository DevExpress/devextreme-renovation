function view(model: DomComponentWrapper): any {
  return <span></span>;
}

export declare type DomComponentWrapperPropsType = {};
export const DomComponentWrapperProps: DomComponentWrapperPropsType = {};
import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface DomComponentWrapper {
  props: typeof DomComponentWrapperProps & RestProps;
  restAttributes: RestProps;
}

export default function DomComponentWrapper(
  props: typeof DomComponentWrapperProps & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

DomComponentWrapper.defaultProps = DomComponentWrapperProps;