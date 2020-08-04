import Child from "./forward-ref-child";
function view({ child, props: { nullableRef }, state }: RefOnChildrenParent) {
  return <Child childRef={child} nullableRef={nullableRef} state={state} />;
}
export declare type PropsType = {
  nullableRef?: RefObject<HTMLDivElement>;
};
const Props: PropsType = {};
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  RefObject,
  HtmlHTMLAttributes,
} from "react";

declare type RestProps = Omit<
  HtmlHTMLAttributes<HTMLDivElement>,
  keyof typeof Props
>;
interface RefOnChildrenParent {
  props: typeof Props & RestProps;
  state: number;
  child: any;
  restAttributes: RestProps;
}

export default function RefOnChildrenParent(props: typeof Props & RestProps) {
  const child = useRef<HTMLDivElement>();
  const [__state_state, __state_setState] = useState<number>(10);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    child.current!.innerHTML = "Ref from child";
    const html = props.nullableRef?.current?.innerHTML;
  }, [props.nullableRef?.current]);

  return view({
    props: { ...props },
    state: __state_state,
    child,
    restAttributes: __restAttributes(),
  });
}

RefOnChildrenParent.defaultProps = {
  ...Props,
};
