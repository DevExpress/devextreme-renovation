import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: Widget) {
  return <div></div>;
}
function subscribe(p: string, s: number, i: number) {
  return 1;
}
function unsubscribe(id: number) {
  return undefined;
}

interface WidgetInputType {
  p?: string;
  r?: string;
  s?: number;
  defaultS?: number;
  sChange?: (s: number) => void;
}
export const WidgetInput = {
  p: '10',
  r: '20',
  defaultS: 10,
  sChange: () => {},
} as Partial<WidgetInputType>;
import { useState, useCallback, useEffect } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  i: number;
  j: number;
  getP: () => any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetInput>>
  >(WidgetInput, inProps);

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
      return restProps as RestProps;
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
  }, [__getP, props.s, __state_s, __state_i]);
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
  });

  return view({
    props: { ...props, s: props.s !== undefined ? props.s : __state_s },
    i: __state_i,
    j: __state_j,
    getP: __getP,
    restAttributes: __restAttributes(),
  });
}
