export declare type WidgetWithRefPropInputType = {
  parentRef?: MutableRefObject<any>;
  nullableRef?: MutableRefObject<any>;
};
export const WidgetWithRefPropInput: WidgetWithRefPropInputType = {};
import * as React from "react";
import { useCallback, MutableRefObject, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
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
      const { nullableRef, parentRef, ...restProps } = {
        ...props,
        parentRef: props.parentRef?.current!,
        nullableRef: props.nullableRef?.current!,
      };
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
