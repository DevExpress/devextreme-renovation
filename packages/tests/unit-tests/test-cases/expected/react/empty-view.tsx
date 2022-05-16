import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(viewModel: typeof WidgetProps) {
  return <React.Fragment />;
}

interface WidgetPropsType {}
export const WidgetProps = {} as Partial<WidgetPropsType>;
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface WidgetWithProps {
  props: Required<GetPropsType<typeof WidgetProps>> & RestProps;
  restAttributes: RestProps;
}
export function WidgetWithProps(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetProps>>
  >(WidgetProps, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

export default WidgetWithProps;
