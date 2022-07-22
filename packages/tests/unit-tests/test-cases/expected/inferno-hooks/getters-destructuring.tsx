export type WidgetPropsType = {
  someProp: string;
  type?: string;
  objectProp?: { someField: number };
};
const WidgetProps: WidgetPropsType = {
  someProp: '',
  type: '',
};
interface FirstGetter {
  field1: string;
  field2: number;
  field3: number;
}

interface GetterType {
  stateField: string;
  propField: string;
}
const view = () => <div></div>;

import {
  useState,
  useCallback,
  useMemo,
  useImperativeHandle,
  HookContainer,
  forwardRef,
  RefObject,
} from '@devextreme/runtime/inferno-hooks';

export type WidgetRef = { changeState: (newValue: string) => any };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  someState: string;
  arrayFromObj: (string | undefined)[];
  arrayFromArr: (string | undefined)[];
  someObj: GetterType;
  objectFromDestructured: GetterType;
  someGetter: GetterType | undefined;
  someMethodFromDestructured: () => GetterType;
  restAttributes: RestProps;
}

const ReactWidget = (
  props: typeof WidgetProps & RestProps,
  ref: RefObject<WidgetRef>
) => {
  const [__state_someState, __state_setSomeState] = useState<string>('');

  const __someObj = useMemo(
    function __someObj(): GetterType {
      return { stateField: __state_someState, propField: props.someProp };
    },
    [__state_someState, props.someProp]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { objectProp, someProp, type, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __changeState = useCallback(function __changeState(
    newValue: string
  ): any {
    __state_setSomeState((__state_someState) => newValue);
  },
  []);
  const __arrayFromObj = useMemo(
    function __arrayFromObj(): (string | undefined)[] {
      const { propField, stateField } = __someObj;
      return [stateField, propField];
    },
    [__someObj]
  );
  const __objectFromDestructured = useMemo(
    function __objectFromDestructured(): GetterType {
      const { propField, stateField } = __someObj;
      return { stateField, propField };
    },
    [__someObj]
  );
  const __someGetter = useMemo(
    function __someGetter(): GetterType | undefined {
      const { propField, stateField: stateField2 } = __someObj;
      return { stateField: stateField2, propField };
    },
    [__someObj]
  );
  const __arrayFromArr = useMemo(
    function __arrayFromArr(): (string | undefined)[] {
      const [stateField, propField] = __arrayFromObj;
      return [stateField, propField];
    },
    [__arrayFromObj]
  );
  const __someMethodFromDestructured = useCallback(
    function __someMethodFromDestructured(): GetterType {
      const { propField, stateField } = __objectFromDestructured;
      return { stateField, propField };
    },
    [__objectFromDestructured]
  );

  useImperativeHandle(ref, () => ({ changeState: __changeState }), [
    __changeState,
  ]);
  return view();
};

HooksWidget.defaultProps = WidgetProps;

function HooksWidget(
  props: typeof WidgetProps & RestProps,
  ref: RefObject<WidgetRef>
) {
  return (
    <HookContainer renderFn={ReactWidget} renderProps={props} renderRef={ref} />
  );
}
const Widget = forwardRef(HooksWidget);

export { Widget };

export default Widget;
