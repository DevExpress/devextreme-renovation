import {
  InterfaceTemplateInput as externalInterface,
  Options as externalType,
} from './types.d';

export type WidgetPropsType = {
  someProp: string;
  type?: string;
  currentDate: Date | number | string;
  defaultCurrentDate: Date | number | string;
  currentDateChange?: (currentDate: Date | number | string) => void;
};
const WidgetProps: WidgetPropsType = {
  someProp: '',
  type: '',
  defaultCurrentDate: Object.freeze(new Date()) as any,
  currentDateChange: () => {},
} as any as WidgetPropsType;
interface internalInterface {
  field1: { a: string };
  field2: number;
  field3: number;
}
type internalType = { a: string };
const view = () => <div></div>;

import {
  useState,
  useCallback,
  useMemo,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  internalInterfaceGetter: internalInterface;
  internalTypeGetter: internalType;
  externalInterfaceGetter: externalInterface;
  externalTypeGetter: externalType;
  someDate: Date;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof WidgetProps & RestProps) {
  const [__state_currentDate, __state_setCurrentDate] = useState<
    Date | number | string
  >(() =>
    props.currentDate !== undefined
      ? props.currentDate
      : props.defaultCurrentDate!
  );

  const __internalInterfaceGetter = useMemo(
    function __internalInterfaceGetter(): internalInterface {
      return { field1: { a: props.someProp }, field2: 2, field3: 3 };
    },
    [props.someProp]
  );
  const __internalTypeGetter = useMemo(
    function __internalTypeGetter(): internalType {
      return { a: '1' };
    },
    []
  );
  const __externalInterfaceGetter = useMemo(
    function __externalInterfaceGetter(): externalInterface {
      return { inputInt: 2 };
    },
    []
  );
  const __externalTypeGetter = useMemo(
    function __externalTypeGetter(): externalType {
      return { value: '' };
    },
    []
  );
  const __someDate = useMemo(
    function __someDate(): Date {
      return new Date(
        props.currentDate !== undefined
          ? props.currentDate
          : __state_currentDate
      );
    },
    [props.currentDate, __state_currentDate]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        currentDate,
        currentDateChange,
        defaultCurrentDate,
        someProp,
        type,
        ...restProps
      } = {
        ...props,
        currentDate:
          props.currentDate !== undefined
            ? props.currentDate
            : __state_currentDate,
      };
      return restProps;
    },
    [props, __state_currentDate]
  );

  return view();
}

HooksWidget.defaultProps = WidgetProps;

function HooksWidget(props: typeof WidgetProps & RestProps) {
  return <HookComponent renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
