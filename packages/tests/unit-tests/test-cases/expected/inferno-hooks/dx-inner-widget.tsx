function view(model: InnerWidget) {
  return <div style={normalizeStyles({ width: 100, height: 100 })}></div>;
}

export type InnerWidgetPropsType = {
  selected?: boolean;
  value: number;
  onSelect?: (e: any) => any;
  defaultValue: number;
  valueChange?: (value: number) => void;
};
export const InnerWidgetProps: InnerWidgetPropsType = {
  defaultValue: 14,
  valueChange: () => {},
} as any as InnerWidgetPropsType;
import {
  useState,
  useCallback,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface InnerWidget {
  props: typeof InnerWidgetProps & RestProps;
  restAttributes: RestProps;
}

export function InnerWidget(props: typeof InnerWidgetProps & RestProps) {
  const [__state_value, __state_setValue] = useState<number>(() =>
    props.value !== undefined ? props.value : props.defaultValue!
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultValue,
        onSelect,
        selected,
        value,
        valueChange,
        ...restProps
      } = {
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
    restAttributes: __restAttributes(),
  });
}

InnerWidget.defaultProps = InnerWidgetProps;

function HooksInnerWidget(props: typeof InnerWidgetProps & RestProps) {
  return (
    <HookComponent renderFn={InnerWidget} renderProps={props}></HookComponent>
  );
}
export default HooksInnerWidget;
