export const viewFunction = ({ props: { a, ...rest } }: Widget) => {
  return <div {...rest}></div>;
};

export declare type WidgetPropsType = {
  a: Array<Number>;
  id: string;
  onClick?: (e: any) => void;
};
export const WidgetProps: WidgetPropsType = {
  a: [1, 2, 3],
  id: "1",
};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetProps
>;
interface Widget {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetProps & RestProps> = (props) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { a, id, onClick, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
};

export default Widget;

Widget.defaultProps = {
  ...WidgetProps,
};
