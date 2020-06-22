function view(model: Widget) {
  return <span ></span>;
}
export declare type WidgetInputType = {
  height: number;
  selected: boolean;
  defaultSelected?: boolean;
  selectedChange?: (selected: boolean) => void
}
const WidgetInput: WidgetInputType = {
  height: 10,
  selected: false,
  defaultSelected: false,
  selectedChange: () => { }
};


import React, { useState, useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any };
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight:()=>number;
  getProps: () => any;
  restAttributes: RestProps;

}

export default function Widget(props: typeof WidgetInput & RestProps) {

  const [__state_selected, __state_setSelected] = useState(() => props.selected !== undefined ? props.selected : props.defaultSelected!);

  const getHeight = useCallback(function getHeight() {
    const { height } = props;
    const { height: _height } = props;
    return height + _height;
  }, [props.height]);

  const getProps = useCallback(function getProps() {
    return {
      ...props,
      selected: (props.selected !== undefined ? props.selected : __state_selected),
    };
  }, [props]);
  const __restAttributes = useCallback(function __restAttributes() {
    const { defaultSelected, height, selected, selectedChange, ...restProps } = {
      ...props,
      selected: (props.selected !== undefined ? props.selected : __state_selected),
    }
    return restProps;
  }, [props]);

  return view(
    ({
      props: {
        ...props,
        selected: (props.selected !== undefined ? props.selected : __state_selected)
      },
      getHeight,
      getProps,
      restAttributes: __restAttributes()
    })
  );
}

Widget.defaultProps = {
  ...WidgetInput
}