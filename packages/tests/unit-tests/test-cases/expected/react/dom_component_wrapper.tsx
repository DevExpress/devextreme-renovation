import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: DomComponentWrapper): any {
  return <span></span>;
}

interface DomComponentWrapperPropsType {}
export const DomComponentWrapperProps =
  {} as Partial<DomComponentWrapperPropsType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface DomComponentWrapper {
  props: Required<GetPropsType<typeof DomComponentWrapperProps>> & RestProps;
  restAttributes: RestProps;
}
export default function DomComponentWrapper(
  inProps: typeof DomComponentWrapperProps & RestProps
) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof DomComponentWrapperProps>>
  >(DomComponentWrapperProps, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}
