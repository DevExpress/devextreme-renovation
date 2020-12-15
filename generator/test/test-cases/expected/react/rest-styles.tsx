const modifyStyles = (styles: any) => {
  return { height: "100px", ...styles };
};
function view({ styles }: Widget) {
  return <span style={styles}></span>;
}

export declare type WidgetInputType = {
  height: number;
  onClick: (a: number) => null;
  p?: string;
  defaultP?: string;
  pChange?: (p: string) => void;
};
const WidgetInput: WidgetInputType = {
  height: 10,
  onClick: () => null,
  defaultP: "",
  pChange: () => {},
};
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  styles: any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const [__state_p, __state_setP] = useState<string | undefined>(() =>
    props.p !== undefined ? props.p : props.defaultP
  );

  const __styles = useCallback(function __styles(): any {
    const { style } = __restAttributes();
    return modifyStyles(style);
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { defaultP, height, onClick, p, pChange, ...restProps } = {
        ...props,
        p: props.p !== undefined ? props.p : __state_p,
      };
      return restProps;
    },
    [props, __state_p]
  );

  return view({
    props: { ...props, p: props.p !== undefined ? props.p : __state_p },
    styles: __styles(),
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
