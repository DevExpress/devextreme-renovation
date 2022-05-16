import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
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

interface PropsType {
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
}

const Props = {} as Partial<PropsType>;
import { useState, useCallback, useEffect, useRef } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type PropsModel = Required<Omit<GetPropsType<typeof Props>, 'nullableRef'>> &
  Partial<Pick<GetPropsType<typeof Props>, 'nullableRef'>>;
interface RefOnChildrenParent {
  props: PropsModel & RestProps;
  child: any;
  innerState: number;
  restAttributes: RestProps;
}
export default function RefOnChildrenParent(inProps: typeof Props & RestProps) {
  const props = combineWithDefaultProps<PropsModel>(Props, inProps);
  const __child: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const [__state_innerState, __state_setInnerState] = useState<number>(10);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = props;
      return restProps as RestProps;
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
