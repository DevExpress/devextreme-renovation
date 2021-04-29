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
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
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
  child: any;
  innerState: number;
  restAttributes: RestProps;
}

const RefOnChildrenParent: React.FC<typeof Props & RestProps> = (props) => {
  const __child: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(
    null
  );
  const [__state_innerState, __state_setInnerState] = useState<number>(10);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    if (__child.current) {
      __child.current.innerHTML = "Ref from child";
    }
    const html = props.nullableRef?.current?.innerHTML;
  }, [props.nullableRef]);

  return view({
    props: { ...props },
    innerState: __state_innerState,
    child: __child,
    restAttributes: __restAttributes(),
  });
};
export default RefOnChildrenParent;

RefOnChildrenParent.defaultProps = {
  ...Props,
};
