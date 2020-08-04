export declare type WidgetWithRefPropInputType = {
  parentRef?: RefObject<any>;
  nullableRef?: RefObject<any>;
};
export const WidgetWithRefPropInput: WidgetWithRefPropInputType = {};
import React, { useCallback, RefObject, HtmlHTMLAttributes } from "react";

declare type RestProps = Omit<
  HtmlHTMLAttributes<HTMLDivElement>,
  keyof typeof WidgetWithRefPropInput
>;
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

  return view({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

WidgetWithRefProp.defaultProps = {
  ...WidgetWithRefPropInput,
};
function view(viewModel: WidgetWithRefProp) {
  return <div></div>;
}
