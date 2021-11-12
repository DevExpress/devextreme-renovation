function view(model: DomCompoentWrapper): any {
  return <span></span>;
}

export declare type DomCompoentWrapperPropsType = {};
export const DomCompoentWrapperProps: DomCompoentWrapperPropsType = {};
import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface DomCompoentWrapper {
  props: typeof DomCompoentWrapperProps & RestProps;
  restAttributes: RestProps;
}

export default function DomCompoentWrapper(
  props: typeof DomCompoentWrapperProps & RestProps
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

DomCompoentWrapper.defaultProps = DomCompoentWrapperProps;
