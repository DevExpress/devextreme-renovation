function view(model: Widget) {
  return <div></div>;
}
export declare type PropsType = {
  type?: string;
  onClick?: (e: any) => void;
};
export const Props: PropsType = {};
import React, { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface Widget {
  props: typeof Props & RestProps;
  clickHandler: () => any;
  restAttributes: RestProps;
}

export function Widget(props: typeof Props & RestProps) {
  const clickHandler = useCallback(
    function clickHandler(): any {
      props.onClick!({ type: props.type });
    },
    [props.onClick, props.type]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { onClick, type, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    clickHandler,
    restAttributes: __restAttributes(),
  });
}

export default Widget;

Widget.defaultProps = {
  ...Props,
};
