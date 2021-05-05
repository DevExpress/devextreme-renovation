function view(model: Widget): any | null {
  return <div></div>;
}
function subscribe(p: string, s: number, i: number) {
  return 1;
}
function unsubscribe(id: number) {
  return undefined;
}

export declare type WidgetInputType = {
  p: string;
  r: string;
  s: number;
  defaultS?: number;
  sChange?: (s: number) => void;
};
export const WidgetInput: WidgetInputType = ({
  p: "10",
  r: "20",
  defaultS: 10,
  sChange: () => {},
} as any) as WidgetInputType;
import * as React from "react";
import { useState, useCallback, useEffect, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  i: number;
  j: number;
  getP: () => any;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
  const [__state_s, __state_setS] = useState<number>(() =>
    props.s !== undefined ? props.s : props.defaultS!
  );
  const [__state_i, __state_setI] = useState<number>(10);
  const [__state_j, __state_setJ] = useState<number>(20);

  const __getP = useCallback(
    function __getP(): any {
      return props.p;
    },
    [props.p]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { defaultS, p, r, s, sChange, ...restProps } = {
        ...props,
        s: props.s !== undefined ? props.s : __state_s,
      };
      return restProps;
    },
    [props, __state_s]
  );
  useEffect(() => {
    const id = subscribe(
      __getP(),
      props.s !== undefined ? props.s : __state_s,
      __state_i
    );
    __state_setI((__state_i) => 15);
    return () => unsubscribe(id);
  }, [props.p, props.s, __state_s, __state_i]);
  useEffect(() => {
    const id = subscribe(
      __getP(),
      props.s !== undefined ? props.s : __state_s,
      __state_i
    );
    __state_setI((__state_i) => 15);
    return () => unsubscribe(id);
  }, []);
  useEffect(() => {
    const id = subscribe(__getP(), 1, 2);
    return () => unsubscribe(id);
  }, [
    __state_i,
    __state_j,
    props.p,
    props.r,
    props.s,
    __state_s,
    props.defaultS,
    props.sChange,
  ]);

  return view({
    props: { ...props, s: props.s !== undefined ? props.s : __state_s },
    i: __state_i,
    j: __state_j,
    getP: __getP,
    restAttributes: __restAttributes(),
  });
};

export default Widget;

Widget.defaultProps = {
  ...WidgetInput,
};
