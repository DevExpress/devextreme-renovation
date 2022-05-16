import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: Widget) {
  return <span></span>;
}

interface WidgetInputType {
  height?: number;
  selected?: boolean;
  defaultSelected?: boolean;
  selectedChange?: (selected: boolean) => void;
}

const WidgetInput = {
  height: 10,
  defaultSelected: false,
  selectedChange: () => {},
} as Partial<WidgetInputType>;
import { useState, useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  getHeight: () => number;
  getProps: () => any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetInput>>
  >(WidgetInput, inProps);

  const [__state_selected, __state_setSelected] = useState<boolean>(() =>
    props.selected !== undefined ? props.selected : props.defaultSelected!
  );

  const __getHeight = useCallback(
    function __getHeight(): number {
      const { height } = props;
      const { height: _height } = props;
      return height + _height;
    },
    [props.height]
  );
  const __getProps = useCallback(
    function __getProps(): any {
      return {
        ...props,
        selected:
          props.selected !== undefined ? props.selected : __state_selected,
      };
    },
    [props, __state_selected]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultSelected,
        height,
        selected,
        selectedChange,
        ...restProps
      } = {
        ...props,
        selected:
          props.selected !== undefined ? props.selected : __state_selected,
      };
      return restProps as RestProps;
    },
    [props, __state_selected]
  );

  return view({
    props: {
      ...props,
      selected:
        props.selected !== undefined ? props.selected : __state_selected,
    },
    getHeight: __getHeight,
    getProps: __getProps,
    restAttributes: __restAttributes(),
  });
}
