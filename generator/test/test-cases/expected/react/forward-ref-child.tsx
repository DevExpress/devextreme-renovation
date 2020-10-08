function view({ props: { childRef, nullableRef } }: RefOnChildrenChild) {
  return (
    <div ref={childRef as any}>
      <div ref={nullableRef as any}></div>
    </div>
  );
}

export declare type PropsType = {
  childRef: MutableRefObject<HTMLDivElement>;
  nullableRef?: MutableRefObject<HTMLDivElement>;
  state?: number;
};
const Props: PropsType = ({} as any) as PropsType;
import * as React from "react";
import { useCallback, MutableRefObject, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface RefOnChildrenChild {
  props: typeof Props & RestProps;
  method: () => any;
  restAttributes: RestProps;
}

export default function RefOnChildrenChild(props: typeof Props & RestProps) {
  const __method = useCallback(
    function __method(): any {
      const nullableRefHtml = props.nullableRef?.current?.innerHTML;
      if (props.nullableRef) {
        props.nullableRef.current = props.childRef!.current!;
      }
      return nullableRefHtml;
    },
    [props.nullableRef?.current]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { childRef, nullableRef, state, ...restProps } = {
        ...props,
        childRef: props.childRef!.current!,
        nullableRef: props.nullableRef?.current!,
      };
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
