import BaseState from "./model";
function view(model: Widget) {
  return (
    <div>
      {model.props.state1}

      <BaseState baseStatePropChange={model.stateChange}></BaseState>
    </div>
  );
}

export declare type WidgetInputType = {
  state1?: boolean;
  state2: boolean;
  stateProp?: boolean;
  defaultState1: boolean;
  state1Change?: (state1?: boolean) => void;
  defaultState2: boolean;
  state2Change?: (state2: boolean) => void;
  defaultStateProp?: boolean;
  statePropChange?: (stateProp?: boolean) => void;
};
const WidgetInput: WidgetInputType = ({
  defaultState1: false,
  state1Change: () => {},
  defaultState2: false,
  state2Change: () => {},
  statePropChange: () => {},
} as any) as WidgetInputType;
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;

interface Widget {
  props: typeof WidgetInput & RestProps;
  innerData?: string;
  updateState: () => any;
  updateState2: () => any;
  destruct: () => any;
  stateChange: (stateProp?: boolean) => any;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
  const [__state_state1, __state_setState1] = useState<boolean | undefined>(
    () => (props.state1 !== undefined ? props.state1 : props.defaultState1)
  );
  const [__state_state2, __state_setState2] = useState<boolean>(() =>
    props.state2 !== undefined ? props.state2 : props.defaultState2!
  );
  const [__state_stateProp, __state_setStateProp] = useState<
    boolean | undefined
  >(() =>
    props.stateProp !== undefined ? props.stateProp : props.defaultStateProp
  );
  const [__state_innerData, __state_setInnerData] = useState<
    string | undefined
  >(undefined);

  const __updateState = useCallback(
    function __updateState(): any {
      __state_setState1(
        (__state_state1) =>
          !(props.state1 !== undefined ? props.state1 : __state_state1)
      ),
        props.state1Change!(
          !(props.state1 !== undefined ? props.state1 : __state_state1)
        );
    },
    [props.state1Change, props.state1, __state_state1]
  );
  const __updateState2 = useCallback(
    function __updateState2(): any {
      const cur = props.state2 !== undefined ? props.state2 : __state_state2;
      __state_setState2((__state_state2) => (cur !== false ? false : true)),
        props.state2Change!(cur !== false ? false : true);
    },
    [props.state2, __state_state2, props.state2Change]
  );
  const __destruct = useCallback(
    function __destruct(): any {
      const s = props.state1 !== undefined ? props.state1 : __state_state1;
    },
    [props.state1, __state_state1]
  );
  const __stateChange = useCallback(
    function __stateChange(stateProp?: boolean): any {
      __state_setStateProp((__state_stateProp) => stateProp),
        props.statePropChange!(stateProp);
    },
    [props.statePropChange]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultState1,
        defaultState2,
        defaultStateProp,
        state1,
        state1Change,
        state2,
        state2Change,
        stateProp,
        statePropChange,
        ...restProps
      } = {
        ...props,
        state1: props.state1 !== undefined ? props.state1 : __state_state1,
        state2: props.state2 !== undefined ? props.state2 : __state_state2,
        stateProp:
          props.stateProp !== undefined ? props.stateProp : __state_stateProp,
      };
      return restProps;
    },
    [props, __state_state1, __state_state2, __state_stateProp]
  );

  return view({
    props: {
      ...props,
      state1: props.state1 !== undefined ? props.state1 : __state_state1,
      state2: props.state2 !== undefined ? props.state2 : __state_state2,
      stateProp:
        props.stateProp !== undefined ? props.stateProp : __state_stateProp,
    },
    innerData: __state_innerData,
    updateState: __updateState,
    updateState2: __updateState2,
    destruct: __destruct,
    stateChange: __stateChange,
    restAttributes: __restAttributes(),
  });
};

Widget.defaultProps = {
  ...WidgetInput,
};

export default Widget;
