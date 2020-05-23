import BaseState from "./model";

function view(model: Widget) {
  return (<div>
    {model.props.state1}
    <BaseState baseStatePropChange={model.stateChange}></BaseState>
  </div>);
}
export declare type WidgetInputType = {
  state1?: boolean;
  state2: boolean;
  stateProp?: boolean;

  defaultState1?: boolean;
  state1Change?: (state1: boolean) => void;
  
  defaultState2?: boolean;
  state2Change?: (state2: boolean) => void;

  defaultStateProp?: boolean;
  statePropChange?: (stateProp: boolean) => void;
}
const WidgetInput: WidgetInputType = {
  state2: false,
  defaultState1: false,
  state1Change: () => { },
  defaultState2: false,
  state2Change: () => { },
  statePropChange: () => { }
};

import React, { useState, useCallback } from 'react';

interface Widget {
  props: typeof WidgetInput;
  updateState: () => any;
  updateState2: () => any;
  destruct: () => any;
  stateChange: (stateProp:boolean) => any;
  restAttributes: any;
}

export default function Widget(props: typeof WidgetInput) {
  const [__state_state1, __state_setState1] = useState(() => props.state1 !== undefined ? props.state1 : props.defaultState1);
  const [__state_state2, __state_setState2] = useState(() => props.state2 !== undefined ? props.state2 : props.defaultState2);
  const [__state_stateProp, __state_setStateProp] = useState(() => props.stateProp !== undefined ? props.stateProp : props.defaultStateProp)

  const updateState = useCallback(function updateState() {
    (__state_setState1(!(props.state1 !== undefined ? props.state1 : __state_state1)), props.state1Change!(!(props.state1 !== undefined ? props.state1 : __state_state1)))
  }, [props.state1, __state_state1, props.state1Change]);

  const updateState2 = useCallback(function updateState2() {
    const cur = (props.state2 !== undefined ? props.state2 : __state_state2);
    (__state_setState2(cur !== false ? false : true), props.state2Change!(cur !== false ? false : true));
  }, [props.state2, __state_state2, props.state2Change]);

  const destruct = useCallback(function destruct() {
    const s = (props.state1 !== undefined ? props.state1 : __state_state1)
  }, [props.state1, __state_state1, props.state1Change]);

  const stateChange = useCallback(function stateChange(stateProp: boolean) {
    (__state_setStateProp(stateProp), props.statePropChange!(stateProp))
  }, []);

  const __restAttributes=useCallback(function __restAttributes(){
    const { defaultState1, defaultState2, defaultStateProp, state1, state1Change, state2, state2Change, stateProp, statePropChange, ...restProps } = props;
    return restProps;
  }, [props]);

  return view(({
    props: {
      ...props,
      state1: (props.state1 !== undefined ? props.state1 : __state_state1),
      state2: (props.state2 !== undefined ? props.state2 : __state_state2),
      stateProp: (props.stateProp !== undefined ? props.stateProp : __state_stateProp)
    },
    updateState,
    updateState2,
    destruct,
    stateChange,
    restAttributes: __restAttributes()
  })
  );
}

Widget.defaultProps = {
  ...WidgetInput
}
