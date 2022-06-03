import { Fragment } from 'inferno';
import InnerWidget from './dx-inner-widget';
function view({ attributes, props, restAttributes }: Widget) {
  return (
    <Fragment>
      <InnerWidget {...(props as any)} {...restAttributes} />

      <div {...(attributes as any)} />
    </Fragment>
  );
}

export type WidgetInputType = {
  visible?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  valueChange?: (value?: boolean) => void;
};
export const WidgetInput: WidgetInputType = {
  valueChange: () => {},
};
import {
  useState,
  useCallback,
  HookContainer,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  counter: number;
  notUsedValue: number;
  attributes: any;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof WidgetInput & RestProps) {
  const [__state_value, __state_setValue] = useState<boolean | undefined>(() =>
    props.value !== undefined ? props.value : props.defaultValue
  );
  const [__state_counter, __state_setCounter] = useState<number>(1);
  const [__state_notUsedValue, __state_setNotUsedValue] = useState<number>(1);

  const __attributes = useCallback(
    function __attributes(): any {
      return { visible: props.visible, value: __state_counter };
    },
    [props.visible, __state_counter]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { defaultValue, value, valueChange, visible, ...restProps } = {
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
    counter: __state_counter,
    notUsedValue: __state_notUsedValue,
    attributes: __attributes(),
    restAttributes: __restAttributes(),
  });
}

HooksWidget.defaultProps = WidgetInput;

function HooksWidget(props: typeof WidgetInput & RestProps) {
  return <HookContainer renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
