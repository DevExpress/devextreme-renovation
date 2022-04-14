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
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';
import { forwardRef } from 'inferno';

export type WidgetRef = { changeState: (newValue: string) => any };
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
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

const Widget = (ref: any) =>
  function widget(props: typeof WidgetProps & RestProps) {
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
  } as React.FC<
    typeof WidgetProps & RestProps & { ref?: React.Ref<WidgetRef> }
  > & { defaultProps: typeof WidgetProps };

Widget.defaultProps = WidgetProps;

let refs = new Map();
const WidgetFn = (ref: any) => {
  if (!refs.has(ref)) {
    refs.set(ref, Widget(ref));
  }

  return refs.get(ref);
};

function HooksWidget(props: typeof WidgetProps & RestProps, ref: any) {
  return <HookComponent renderFn={WidgetFn(ref)} renderProps={props} />;
}
const HooksWidgetFR = forwardRef(HooksWidget);

export { HooksWidgetFR };

export default HooksWidgetFR;
