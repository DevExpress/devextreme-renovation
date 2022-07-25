export const COMPONENT_INPUT_CLASS = 'c3';
function view(model: Widget) {
  return <div></div>;
}

export type WidgetPropsType = {
  height?: number;
  width?: number;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = {
  height: 10,
  width: 10,
};
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  onClick: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __onClick = useCallback(
    function __onClick(): any {
      const v = props.height;
    },
    [props.height]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, height, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    onClick: __onClick,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetProps;
