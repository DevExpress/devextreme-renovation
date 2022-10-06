function view(model: InnerWidget) {
  return <div style={normalizeStyles({ width: 100, height: 100 })}></div>;
}

export type InnerWidgetPropsType = {
  selected?: boolean;
  value: number;
  defaultValue: number;
  valueChange?: (value: number) => void;
};
export const InnerWidgetProps: InnerWidgetPropsType = {
  defaultValue: 14,
  valueChange: () => {},
} as any as InnerWidgetPropsType;
import { useState, useCallback } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface InnerWidget {
  props: typeof InnerWidgetProps & RestProps;
  someGetter: typeof InnerWidgetProps;
  restAttributes: RestProps;
}

export default function InnerWidget(
  props: typeof InnerWidgetProps & RestProps
) {
  const [__state_value, __state_setValue] = useState<number>(() =>
    props.value !== undefined ? props.value : props.defaultValue!
  );

  const __someGetter = useCallback(
    function __someGetter(): typeof InnerWidgetProps {
      return {
        ...props,
        value: props.value !== undefined ? props.value : __state_value,
      };
    },
    [props, __state_value]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { defaultValue, selected, value, valueChange, ...restProps } = {
        ...props,
        value: props.value !== undefined ? props.value : __state_value,
      };
      return restProps;
    },
    [props, __state_value]
  );

  return view({
    props: {
      ...props,
      value: props.value !== undefined ? props.value : __state_value,
    },
    someGetter: __someGetter(),
    restAttributes: __restAttributes(),
  });
}

InnerWidget.defaultProps = InnerWidgetProps;
