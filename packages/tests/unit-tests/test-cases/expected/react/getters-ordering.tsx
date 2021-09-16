export declare type WidgetPropsType = {
  someProp: string;
  type?: string;
};
const WidgetProps: WidgetPropsType = {
  someProp: "",
  type: "",
};
const view = () => <div></div>;

import * as React from "react";
import { useCallback, useEffect, useImperativeHandle, forwardRef } from "react";

export type WidgetRef = { g3: () => (string | undefined)[] };
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  g7: any;
  g5: (string | undefined)[];
  g1: any;
  g2: any;
  g4: (string | undefined)[];
  g6: (string | undefined)[];
  restAttributes: RestProps;
}

const Widget = forwardRef<WidgetRef, typeof WidgetProps & RestProps>(
  function widget(props: typeof WidgetProps & RestProps, ref) {
    const __g1 = useCallback(
      function __g1(): any {
        return props.someProp;
      },
      [props.someProp]
    );
    const __g2 = useCallback(
      function __g2(): any {
        return props.type;
      },
      [props.type]
    );
    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { someProp, type, ...restProps } = props;
        return restProps;
      },
      [props]
    );
    const __g5 = useCallback(
      function __g5(): (string | undefined)[] {
        return [...__g3(), __g2()];
      },
      [__g1(), __g2()]
    );
    const __g4 = useCallback(
      function __g4(): (string | undefined)[] {
        return [...__g3(), __g1()];
      },
      [__g1(), __g2()]
    );
    const __g3 = useCallback(
      function __g3(): (string | undefined)[] {
        return [__g1(), __g2()];
      },
      [__g1(), __g2()]
    );
    const __g6 = useCallback(
      function __g6(): (string | undefined)[] {
        return [...__g5(), ...__g4()];
      },
      [__g5(), __g4()]
    );
    const __g7 = useCallback(
      function __g7(): any {
        return __g6();
      },
      [__g6()]
    );
    useEffect(() => {
      return () => __g7();
    }, [__g7()]);
    useImperativeHandle(ref, () => ({ g3: __g3 }), [__g3]);
    return view();
  }
) as React.FC<
  typeof WidgetProps & RestProps & { ref?: React.Ref<WidgetRef> }
> & { defaultProps: typeof WidgetProps };
Widget;

Widget.defaultProps = WidgetProps;
