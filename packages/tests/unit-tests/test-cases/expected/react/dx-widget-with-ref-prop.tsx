import { MutableRefObject } from "react";

export declare type WidgetWithRefPropInputType = {
  parentRef?: MutableRefObject<any>;
  nullableRef?: MutableRefObject<any>;
};
export const WidgetWithRefPropInput: WidgetWithRefPropInputType = {};
import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface WidgetWithRefProp {
  props: typeof WidgetWithRefPropInput & RestProps;
  restAttributes: RestProps;
}

export default function WidgetWithRefProp(
  props: typeof WidgetWithRefPropInput & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, parentRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

WidgetWithRefProp.defaultProps = WidgetWithRefPropInput;
function view(viewModel: WidgetWithRefProp) {
  return <div></div>;
}
