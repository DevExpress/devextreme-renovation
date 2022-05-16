function view(model: InnerWidget) {
  return <div style={normalizeStyles({ width: 100, height: 100 })}></div>;
}

export type InnerWidgetPropsType = {
  visible: boolean;
  selected?: boolean;
  value: number;
  required: boolean;
  defaultValue: number;
  valueChange?: (value: number) => void;
};
export const InnerWidgetProps: InnerWidgetPropsType = {
  visible: true,
  defaultValue: 14,
  valueChange: () => {},
} as any as InnerWidgetPropsType;
import { useState, useCallback } from 'preact/hooks';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface InnerWidget {
  props: typeof InnerWidgetProps & RestProps;
  someGetter: string;
  restAttributes: RestProps;
}

export default function InnerWidget(
  props: typeof InnerWidgetProps & RestProps
) {
  const [__state_value, __state_setValue] = useState<number>(() =>
    props.value !== undefined ? props.value : props.defaultValue!
  );

  const __someGetter = useCallback(
    function __someGetter(): string {
      return (
        (props.value !== undefined ? props.value : __state_value).toString() +
        props.required.toString()
      );
    },
    [props.value, __state_value, props.required]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultValue,
        required,
        selected,
        value,
        valueChange,
        visible,
        ...restProps
      } = {
        ...props,
        value: props.value !== undefined ? props.value : __state_value,
      };
      return restProps as RestProps;
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
