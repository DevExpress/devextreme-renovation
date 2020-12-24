function view(model: Widget): any {
  return <span style={model.styles}></span>;
}
type EventCallBack<Type> = (e: Type) => void;

export declare type WidgetInputType = {};
export const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  styles: { [name: string]: string | number | undefined };
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __styles = useCallback(function __styles(): {
    [name: string]: string | number | undefined;
  } {
    return { background: "green" };
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    styles: __styles(),
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
