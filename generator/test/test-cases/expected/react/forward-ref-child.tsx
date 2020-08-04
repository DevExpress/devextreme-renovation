function view({ props: { childRef, nullableRef } }: RefOnChildrenChild) {
  return (
    <div ref={childRef as any}>
      <div ref={nullableRef as any}></div>
    </div>
  );
}
export declare type PropsType = {
  childRef: RefObject<HTMLDivElement>;
  nullableRef?: RefObject<HTMLDivElement>;
  state?: number;
};
const Props: PropsType = {} as PropsType;
import React, { useCallback, RefObject, HtmlHTMLAttributes } from "react";

declare type RestProps = Omit<
  HtmlHTMLAttributes<HTMLDivElement>,
  keyof typeof Props
>;
interface RefOnChildrenChild {
  props: typeof Props & RestProps;
  restAttributes: RestProps;
}

export default function RefOnChildrenChild(props: typeof Props & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { childRef, nullableRef, state, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

RefOnChildrenChild.defaultProps = {
  ...Props,
};
