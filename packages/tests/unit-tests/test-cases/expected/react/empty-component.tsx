import * as React from 'react';
import { useCallback } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  height?: number;
  width?: number;
  restAttributes: RestProps;
}

export default function Widget(
  props: { height?: number; width?: number } & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view1({ ...props, restAttributes: __restAttributes() });
}

function view1(viewModel: Widget) {
  return (
    <div style={normalizeStyles({ height: viewModel.height })}>
      <span></span>

      <span></span>
    </div>
  );
}
