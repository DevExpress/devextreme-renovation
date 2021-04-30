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

const WidgetWithRefProp: React.FC<typeof WidgetWithRefPropInput & RestProps> = (
  props
) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, parentRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
};

export default WidgetWithRefProp;

WidgetWithRefProp.defaultProps = {
  ...WidgetWithRefPropInput,
};
function view(viewModel: WidgetWithRefProp) {
  return <div></div>;
}
