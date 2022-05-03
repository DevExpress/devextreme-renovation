import { MutableRefObject } from 'react';
function view(model: RefProps) {
  return <div>{'Ref Props'}</div>;
}

export type PropsType = {
  parentRef: MutableRefObject<HTMLDivElement | null>;
};
const Props: PropsType = {} as any as PropsType;
import { useCallback, useEffect } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface RefProps {
  props: typeof Props & RestProps;
  restAttributes: RestProps;
}

export default function RefProps(props: typeof Props & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { parentRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    const parentRef = props.parentRef;
    if (parentRef.current) {
      parentRef.current.style.backgroundColor = '#aaaaff';
      parentRef.current.innerHTML += 'childText';
    }
  }, []);

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

RefProps.defaultProps = Props;
