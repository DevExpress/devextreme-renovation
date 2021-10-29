export declare type WidgetPropsType = {
  someProp: string;
  type?: string;
  gridCompatibility?: boolean;
  pageIndex: number;
  defaultPageIndex: number;
  pageIndexChange?: (pageIndex: number) => void;
};
const WidgetProps: WidgetPropsType = {
  someProp: "",
  type: "",
  gridCompatibility: true,
  defaultPageIndex: 1,
  pageIndexChange: () => {},
} as any as WidgetPropsType;
const view = (model: Widget) => <div></div>;

import * as React from "react";
import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

export type WidgetRef = { g3: () => (string | undefined)[] };
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  someState: number;
  g7: any;
  g5: (string | undefined)[];
  g1: any;
  g2: any;
  factorial: (n: number) => number;
  g4: (string | undefined)[];
  g6: (string | undefined)[];
  type: any;
  pageIndexChange: (newPageIndex: number) => void;
  someMethod: () => any;
  recursive1: () => void;
  recursive2: () => number;
  restAttributes: RestProps;
}

const Widget = forwardRef<WidgetRef, typeof WidgetProps & RestProps>(
  function widget(props: typeof WidgetProps & RestProps, ref) {
    const [__state_pageIndex, __state_setPageIndex] = useState<number>(() =>
      props.pageIndex !== undefined ? props.pageIndex : props.defaultPageIndex!
    );
    const [__state_someState, __state_setSomeState] = useState<number>(0);

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
    const __type = useCallback(
      function __type(): any {
        return props.type;
      },
      [props.type]
    );
    const __pageIndexChange = useCallback(
      function __pageIndexChange(newPageIndex: number): void {
        if (props.gridCompatibility) {
          __state_setPageIndex((__state_pageIndex) => newPageIndex + 1),
            props.pageIndexChange!(newPageIndex + 1);
        } else {
          __state_setPageIndex((__state_pageIndex) => newPageIndex),
            props.pageIndexChange!(newPageIndex);
        }
      },
      [props.gridCompatibility, props.pageIndexChange]
    );
    const __someMethod = useCallback(function __someMethod(): any {
      return undefined;
    }, []);
    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const {
          defaultPageIndex,
          gridCompatibility,
          pageIndex,
          pageIndexChange,
          someProp,
          type,
          ...restProps
        } = {
          ...props,
          pageIndex:
            props.pageIndex !== undefined ? props.pageIndex : __state_pageIndex,
        };
        return restProps;
      },
      [props, __state_pageIndex]
    );
    const __g3 = useCallback(
      function __g3(): (string | undefined)[] {
        return [__g1(), __g2()];
      },
      [__g1, __g2]
    );
    const __g5 = useMemo(
      function __g5(): (string | undefined)[] {
        return [...__g3(), __g2()];
      },
      [__g3, __g2]
    );
    const __g4 = useMemo(
      function __g4(): (string | undefined)[] {
        return [...__g3(), __g1()];
      },
      [__g3, __g1]
    );
    const __g6 = useMemo(
      function __g6(): (string | undefined)[] {
        return [...__g5, ...__g4];
      },
      [__g5, __g4]
    );
    const __g7 = useCallback(
      function __g7(): any {
        return __g6;
      },
      [__g6]
    );
    function __factorial(n: number): number {
      return n > 1 ? __factorial(n - 1) : 1;
    }
    function __recursive1(): void {
      __state_setSomeState((__state_someState) => __recursive2());
    }
    function __recursive2(): number {
      return requestAnimationFrame(__recursive1);
    }
    useEffect(() => {
      return () => __g7();
    }, [__g7]);
    useImperativeHandle(ref, () => ({ g3: __g3 }), [__g3]);
    return view({
      props: {
        ...props,
        pageIndex:
          props.pageIndex !== undefined ? props.pageIndex : __state_pageIndex,
      },
      someState: __state_someState,
      g7: __g7(),
      g5: __g5,
      g1: __g1(),
      g2: __g2(),
      factorial: __factorial,
      g4: __g4,
      g6: __g6,
      type: __type(),
      pageIndexChange: __pageIndexChange,
      someMethod: __someMethod,
      recursive1: __recursive1,
      recursive2: __recursive2,
      restAttributes: __restAttributes(),
    });
  }
) as React.FC<
  typeof WidgetProps & RestProps & { ref?: React.Ref<WidgetRef> }
> & { defaultProps: typeof WidgetProps };
Widget;

Widget.defaultProps = WidgetProps;
