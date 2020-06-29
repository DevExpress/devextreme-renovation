function view(model: Widget) {
  return <div></div>;
}
export declare type WidgetInputType = {
  prop?: boolean;
}
const WidgetInput: WidgetInputType = {};

import React, { useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any };
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(function __restAttributes() {
    const { prop, ...restProps } = props
    return restProps;
  }, [props]);

  return view(
    ({
      props: {...props},
      restAttributes: __restAttributes()
    })
  );
}

export default Widget;

Widget.defaultProps = {
  ...WidgetInput
}
