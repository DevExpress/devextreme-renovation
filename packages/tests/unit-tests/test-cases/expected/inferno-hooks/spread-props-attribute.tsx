import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import InnerWidget from './dx-inner-widget';
function view({ attributes, props, restAttributes }: Widget) {
  return (
    <React.Fragment>
      <InnerWidget {...(props as any)} {...restAttributes} />

      <div {...(attributes as any)} />
    </React.Fragment>
  );
}

interface WidgetInputType {
  visible?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  valueChange?: (value?: boolean) => void;
}
export const WidgetInput = {
  valueChange: () => {},
} as Partial<WidgetInputType>;
import {
  useState,
  useCallback,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetInputModel = Required<
  Omit<GetPropsType<typeof WidgetInput>, 'visible' | 'value' | 'defaultValue'>
> &
  Partial<
    Pick<GetPropsType<typeof WidgetInput>, 'visible' | 'value' | 'defaultValue'>
  >;
interface Widget {
  props: WidgetInputModel & RestProps;
  counter: number;
  notUsedValue: number;
  attributes: any;
  restAttributes: RestProps;
}

export function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);

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
      return restProps as RestProps;
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

function HooksWidget(props: typeof WidgetInput & RestProps) {
  return <HookComponent renderFn={Widget} renderProps={props}></HookComponent>;
}
export default HooksWidget;
