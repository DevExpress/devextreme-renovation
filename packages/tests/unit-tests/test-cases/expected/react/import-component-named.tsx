import { Widget } from "./export-named";
function view(model: Child) {
  return <Widget prop={true} />;
}

export declare type ChildInputType = {
  height: number;
};
const ChildInput: ChildInputType = { height: 10 };
import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Child {
  props: typeof ChildInput & RestProps;
  restAttributes: RestProps;
}

export default function Child(props: typeof ChildInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

Child.defaultProps = ChildInput;
