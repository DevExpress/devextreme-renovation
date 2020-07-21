function view(model: Widget): JSX.Element {
  return <span></span>;
}

export declare type WidgetInputType = {
  height: number;
  export: object;
  onClick: (a: number) => null;
};
const WidgetInput: WidgetInputType = {
  height: 10,
  export: {},
  onClick: () => null,
};

import React, { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight: () => number;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const getHeight = useCallback(
    function getHeight(): number {
      props.onClick(10);
      const { onClick } = props;
      onClick(11);
      return props.height;
    },
    [props.onClick, props.height]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { export: exportProp, height, onClick, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getHeight,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
