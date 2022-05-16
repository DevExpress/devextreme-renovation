import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { MutableRefObject } from 'react';
function view({ props: { childRef, nullableRef } }: RefOnChildrenChild) {
  return (
    <div ref={childRef}>
      <div ref={nullableRef}></div>
    </div>
  );
}

interface PropsType {
  childRef?: MutableRefObject<HTMLDivElement | null>;
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
  state?: number;
}

const Props = {} as Partial<PropsType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type PropsModel = Required<
  Omit<GetPropsType<typeof Props>, 'nullableRef' | 'state'>
> &
  Partial<Pick<GetPropsType<typeof Props>, 'nullableRef' | 'state'>>;
interface RefOnChildrenChild {
  props: PropsModel & RestProps;
  method: () => any;
  restAttributes: RestProps;
}
export default function RefOnChildrenChild(inProps: typeof Props & RestProps) {
  const props = combineWithDefaultProps<PropsModel>(Props, inProps);

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
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    method: __method,
    restAttributes: __restAttributes(),
  });
}
