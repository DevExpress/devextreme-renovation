import { MutableRefObject } from 'react';
import BaseWidget from './method';
export const viewFunction = ({
  props: { forwardedRef },
}: Child1Component): any => <BaseWidget ref={forwardedRef} />;

export type Child1ComponentPropsType = {
  forwardedRef: any;
};
export const Child1ComponentProps: Child1ComponentPropsType =
  {} as any as Child1ComponentPropsType;
import { WidgetRef as BaseWidgetRef } from './method';
import { useCallback, useEffect, useRef } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Child1Component {
  props: typeof Child1ComponentProps & RestProps;
  someGetter: Partial<typeof Child1ComponentProps>;
  restAttributes: RestProps;
  forwardedRef: any;
}

export function Child1Component(
  props: typeof Child1ComponentProps & RestProps
) {
  const forwardedRef: MutableRefObject<BaseWidgetRef | null> =
    useRef<BaseWidgetRef>(null);

  const __someGetter = useCallback(function __someGetter(): Partial<
    typeof Child1ComponentProps
  > {
    return {};
  },
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { forwardedRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    console.log(props.forwardedRef.current!.getSize());
  }, []);

  return viewFunction({
    props: { ...props },
    forwardedRef: forwardedRef,
    someGetter: __someGetter(),
    restAttributes: __restAttributes(),
  });
}

export default Child1Component;

Child1Component.defaultProps = Child1ComponentProps;
