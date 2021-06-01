import { MutableRefObject } from "react";
function view({ props: { childRef, nullableRef } }: RefOnChildrenChild) {
  return (
    <div ref={childRef}>
      <div ref={nullableRef}></div>
    </div>
  );
}

export declare type PropsType = {
  childRef: MutableRefObject<HTMLDivElement | null>;
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
  state?: number;
};
const Props: PropsType = {} as any as PropsType;
import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface RefOnChildrenChild {
  props: typeof Props & RestProps;
  method: () => any;
  restAttributes: RestProps;
}

export default function RefOnChildrenChild(props: typeof Props & RestProps) {
  const __method = useCallback(
    function __method(): any {
      const { nullableRef } = props;
      const nullableRefHtml = nullableRef?.current?.innerHTML;
      if (nullableRef) {
        nullableRef.current = props.childRef.current;
      }
      return nullableRefHtml;
    },
    [props.nullableRef]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { childRef, nullableRef, state, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    method: __method,
    restAttributes: __restAttributes(),
  });
}

RefOnChildrenChild.defaultProps = {
  ...Props,
};
