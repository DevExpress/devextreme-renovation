import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: InnerWidget) {
  return <div style={normalizeStyles({ width: 100, height: 100 })}></div>;
}

interface InnerWidgetPropsType {
  visible?: boolean;
  selected?: boolean;
  value?: number;
  required?: boolean;
  defaultValue?: number;
  valueChange?: (value: number) => void;
}
export const InnerWidgetProps = {
  visible: true,
  defaultValue: 14,
  valueChange: () => {},
} as Partial<InnerWidgetPropsType>;
import { useState, useCallback } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type InnerWidgetPropsModel = Required<
  Omit<GetPropsType<typeof InnerWidgetProps>, 'selected'>
> &
  Partial<Pick<GetPropsType<typeof InnerWidgetProps>, 'selected'>>;
interface InnerWidget {
  props: InnerWidgetPropsModel & RestProps;
  someGetter: string;
  restAttributes: RestProps;
}
export default function InnerWidget(
  inProps: typeof InnerWidgetProps & RestProps
) {
  const props = combineWithDefaultProps<InnerWidgetPropsModel>(
    InnerWidgetProps,
    inProps
  );

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
