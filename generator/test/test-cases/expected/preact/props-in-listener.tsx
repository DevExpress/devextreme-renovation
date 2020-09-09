function view(model: Widget) {
  return <div></div>;
}

export declare type PropsType = {
  type?: string;
  onClick?: (e: any) => void;
};
export const Props: PropsType = {};
import * as Preact from "preact";
import { useCallback } from "preact/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
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

Widget.defaultProps = {
  ...Props,
};
