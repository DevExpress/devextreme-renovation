export const COMPONENT_INPUT_CLASS = "c3";
function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetPropsType = {
  height?: number;
  width?: number;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = {
  height: 10,
  width: 10,
};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetProps
>;
interface Widget {
  props: typeof WidgetProps & RestProps;
  onClick: () => any;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetProps & RestProps> = (props) => {
  const __onClick = useCallback(
    function __onClick(): any {
      const v = props.height;
    },
    [props.height]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, height, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    onClick: __onClick,
    restAttributes: __restAttributes(),
  });
};
export default Widget;

Widget.defaultProps = {
  ...WidgetProps,
};
