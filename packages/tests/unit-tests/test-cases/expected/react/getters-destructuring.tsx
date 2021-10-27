export declare type WidgetPropsType = {
  someProp: string;
  type?: string;
};
const WidgetProps: WidgetPropsType = {
  someProp: "",
  type: "",
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

import * as React from "react";
import {
  useState,
  useCallback,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";

export type WidgetRef = { changeState: (newValue: string) => any };
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  someState: string;
  someObj: GetterType;
  objectFromDestructured: GetterType;
  someMethod1: () => any;
  someMethodFromDestructured: () => GetterType;
  someMethod2: () => any;
  restAttributes: RestProps;
}

const Widget = forwardRef<WidgetRef, typeof WidgetProps & RestProps>(
  function widget(props: typeof WidgetProps & RestProps, ref) {
    const [__state_someState, __state_setSomeState] = useState<string>("");

    const __someObj = useMemo(
      function __someObj(): GetterType {
        return { stateField: __state_someState, propField: props.someProp };
      },
      [__state_someState, props.someProp]
    );
    const __restAttributes = useCallback(
      function __restAttributes(): RestProps {
        const { someProp, type, ...restProps } = props;
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
    const __objectFromDestructured = useMemo(
      function __objectFromDestructured(): GetterType {
        const { propField, stateField } = __someObj;
        return { stateField, propField };
      },
      [__someObj.propField, __someObj.stateField]
    );
    const __someMethod1 = useCallback(
      function __someMethod1(): any {
        const { propField, stateField: stateField2 } = __someObj;
      },
      [__someObj.propField, __someObj.stateField]
    );
    const __someMethod2 = useCallback(
      function __someMethod2(): any {
        const state = __someObj.stateField;
        const prop = __someObj.propField;
      },
      [__someObj]
    );
    const __someMethodFromDestructured = useCallback(
      function __someMethodFromDestructured(): GetterType {
        const { propField, stateField } = __objectFromDestructured;
        return { stateField, propField };
      },
      [__objectFromDestructured.propField, __objectFromDestructured.stateField]
    );

    useImperativeHandle(ref, () => ({ changeState: __changeState }), [
      __changeState,
    ]);
    return view();
  }
) as React.FC<
  typeof WidgetProps & RestProps & { ref?: React.Ref<WidgetRef> }
> & { defaultProps: typeof WidgetProps };
Widget;

Widget.defaultProps = WidgetProps;
