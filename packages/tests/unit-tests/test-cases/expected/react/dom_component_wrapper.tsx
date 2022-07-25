function view(model: DomComponentWrapper): any {
  return <span></span>;
}

export type DomComponentWrapperPropsType = {};
export const DomComponentWrapperProps: DomComponentWrapperPropsType = {};
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface DomComponentWrapper {
  props: typeof DomComponentWrapperProps & RestProps;
  restAttributes: RestProps;
}

export default function DomComponentWrapper(
  props: typeof DomComponentWrapperProps & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

DomComponentWrapper.defaultProps = DomComponentWrapperProps;
