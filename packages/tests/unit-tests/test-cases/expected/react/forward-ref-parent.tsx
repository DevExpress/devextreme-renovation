import { MutableRefObject } from 'react';
import Child from './forward-ref-child';
function view({
  child,
  innerState,
  props: { nullableRef },
}: RefOnChildrenParent) {
  return (
    <Child childRef={child} nullableRef={nullableRef} state={innerState} />
  );
}

export type PropsType = {
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
};
const Props: PropsType = {};
import { useState, useCallback, useEffect, useRef } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface RefOnChildrenParent {
  props: typeof Props & RestProps;
  child: any;
  innerState: number;
  restAttributes: RestProps;
}

export default function RefOnChildrenParent(props: typeof Props & RestProps) {
  const __child: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
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
      __child.current.innerHTML = 'Ref from child';
    }
    const html = props.nullableRef?.current?.innerHTML;
  }, [props.nullableRef]);

  return view({
    props: { ...props },
    innerState: __state_innerState,
    child: __child,
    restAttributes: __restAttributes(),
  });
}

RefOnChildrenParent.defaultProps = Props;
