import Child from "./forward-ref-child";
function view({
  child,
  innerState,
  props: { nullableRef },
}: RefOnChildrenParent) {
  return (
    <Child childRef={child} nullableRef={nullableRef} state={innerState} />
  );
}

export declare type PropsType = {
  nullableRef?: MutableRefObject<HTMLDivElement>;
};
const Props: PropsType = {};
import * as React from "react";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
  HTMLAttributes,
} from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface RefOnChildrenParent {
  props: typeof Props & RestProps;
  __child: any;
  innerState: number;
  restAttributes: RestProps;
}

export default function RefOnChildrenParent(props: typeof Props & RestProps) {
  const __child = useRef<HTMLDivElement>();
  const [__state_innerState, __state_setInnerState] = useState<number>(10);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = {
        ...props,
        nullableRef: props.nullableRef?.current!,
      };
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    __child.current!.innerHTML = "Ref from child";
    const html = props.nullableRef?.current?.innerHTML;
  }, [props.nullableRef?.current]);

  return view({
    props: { ...props },
    innerState: __state_innerState,
    __child,
    restAttributes: __restAttributes(),
  });
}

RefOnChildrenParent.defaultProps = {
  ...Props,
};
