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
const view = () => <div></div>;

import * as React from "react";
import { useState, useCallback, useImperativeHandle, forwardRef } from "react";

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
  someObj: any;
  objectFromDestructured: any;
  arrayFromObj: (string | undefined)[];
  arrayFromArr: (string | undefined)[];
  someMethod: { stateField: string; propField: string };
  someMethod2: () => any;
  someMethod3: { stateField: string; propField: string };
  emptyMethod: any;
  restAttributes: RestProps;
}

const Widget = forwardRef<WidgetRef, typeof WidgetProps & RestProps>(
  function widget(props: typeof WidgetProps & RestProps, ref) {
    const [__state_someState, __state_setSomeState] = useState<string>("");

    const __someObj = useCallback(
      function __someObj(): any {
        return { stateField: __state_someState, propField: props.someProp };
      },
      [__state_someState, props.someProp]
    );
    const __emptyMethod = useCallback(function __emptyMethod(): any {
      return "";
    }, []);
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
    const __objectFromDestructured = useCallback(
      function __objectFromDestructured(): any {
        const { propField, stateField } = __someObj();
        return { stateField, propField };
      },
      [__someObj().propField, __someObj().stateField]
    );
    const __arrayFromObj = useCallback(
      function __arrayFromObj(): (string | undefined)[] {
        const { propField, stateField } = __someObj();
        return [stateField, propField];
      },
      [__someObj().propField, __someObj().stateField]
    );
    const __someMethod2 = useCallback(
      function __someMethod2(): any {
        const state = __someObj().stateField;
        const prop = __someObj().propField;
      },
      [__someObj()]
    );
    const __someMethod3 = useCallback(
      function __someMethod3(): { stateField: string; propField: string } {
        const something = __someObj();
        return something;
      },
      [__someObj()]
    );
    const __arrayFromArr = useCallback(
      function __arrayFromArr(): (string | undefined)[] {
        const [stateField, propField] = __arrayFromObj();
        return [stateField, propField];
      },
      [__arrayFromObj()]
    );
    const __someMethod = useCallback(
      function __someMethod(): { stateField: string; propField: string } {
        const { propField, stateField } = __objectFromDestructured();
        return { stateField, propField };
      },
      [
        __objectFromDestructured().propField,
        __objectFromDestructured().stateField,
      ]
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
