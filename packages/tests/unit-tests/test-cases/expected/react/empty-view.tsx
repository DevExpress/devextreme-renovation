function view(viewModel: typeof WidgetProps) {
  return <React.Fragment />;
}

export type WidgetPropsType = {};
export const WidgetProps: WidgetPropsType = {};
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface WidgetWithProps {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
}

export function WidgetWithProps(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

export default WidgetWithProps;

WidgetWithProps.defaultProps = WidgetProps;
