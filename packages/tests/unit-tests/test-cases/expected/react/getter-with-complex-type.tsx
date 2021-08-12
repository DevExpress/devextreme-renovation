import { createContext } from "react";

interface SlidingWindowState {
  indexesForReuse: number[];
  slidingWindowIndexes: number[];
}
const SimpleContext = createContext<number>(5);
function view(viewModel: Widget) {
  return <div></div>;
}

export declare type PropsType = {
  p: number;
};
export const Props: PropsType = {
  p: 10,
};
import * as React from "react";
import { useState, useContext, useCallback, useRef } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof Props & RestProps;
  internalField: number;
  i: number;
  provide: any;
  cons: number;
  g1: number[];
  g2: number;
  g3: number;
  g4: number[];
  someFunc: () => any;
  g5: number[];
  restAttributes: RestProps;
}

export default function Widget(props: typeof Props & RestProps) {
  const [__state_internalField, __state_setInternalField] = useState<number>(3);
  const [__state_i, __state_setI] = useState<number>(10);
  const mutableField = useRef<number>(3);
  const slidingWindowStateHolder = useRef<SlidingWindowState>();
  const cons = useContext(SimpleContext);
  const __provide = useCallback(
    function __provide(): any {
      return __state_i;
    },
    [__state_i]
  );
  const __g1 = useCallback(
    function __g1(): number[] {
      return [props.p, __state_i];
    },
    [props.p, __state_i]
  );
  const __g2 = useCallback(
    function __g2(): number {
      return props.p;
    },
    [props.p]
  );
  const __g3 = useCallback(
    function __g3(): number {
      return __state_i;
    },
    [__state_i]
  );
  const __g4 = useCallback(
    function __g4(): number[] {
      return [cons];
    },
    [cons]
  );
  const __someFunc = useCallback(
    function __someFunc(): any {
      return props.p;
    },
    [props.p]
  );
  const __g5 = function __g5(): number[] {
    return [__someFunc(), __g3(), __state_internalField, mutableField.current!];
  };
  const __slidingWindowState =
    function __slidingWindowState(): SlidingWindowState {
      const slidingWindowState = slidingWindowStateHolder.current!;
      if (!slidingWindowState) {
        return { indexesForReuse: [], slidingWindowIndexes: [] };
      }
      return slidingWindowState;
    };
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { p, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return (
    <SimpleContext.Provider value={__provide()}>
      {view({
        props: { ...props },
        internalField: __state_internalField,
        i: __state_i,
        cons,
        provide: __provide(),
        g1: __g1(),
        g2: __g2(),
        g3: __g3(),
        g4: __g4(),
        someFunc: __someFunc,
        g5: __g5(),
        restAttributes: __restAttributes(),
      })}
    </SimpleContext.Provider>
  );
}

Widget.defaultProps = Props;

class SomeClass {
  i: number = 2;
  get numberGetter(): number[] {
    return [this.i, this.i];
  }
}
