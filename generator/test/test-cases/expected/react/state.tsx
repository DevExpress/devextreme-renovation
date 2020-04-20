function view(model: Widget) {
  return <div >{model.props.state1}</div>;
}
declare type WidgetInput = {
  state1?: boolean;
  state2: boolean;
  state3?: boolean;

  defaultState1?: boolean;
  state1Change?: (state1: boolean) => void;
  
  defaultState2?: boolean;
  state2Change?: (state2: boolean) => void;

  defaultState3?: boolean;
  state3Change?: (state3: boolean) => void;
}
const WidgetInput: WidgetInput = {
  state2: false,
  state1Change: () => { },
  state2Change: () => { },
  state3Change: () => { }
};

import React, { useState, useCallback } from 'react';

interface Widget {
  props: WidgetInput;
  updateState: () => any;
  restAttributes: any;
}

export default function Widget(props: WidgetInput) {
  const [__state_state1, __state_setState1] = useState(() => (props.state1 !== undefined ? props.state1 : props.defaultState1) || false);
  const [__state_state2, __state_setState2] = useState(() => (props.state2 !== undefined ? props.state2 : props.defaultState2) || false);
  const [__state_state3, __state_setState3] = useState(() => (props.state3 !== undefined ? props.state3 : props.defaultState3))

  const updateState = useCallback(function updateState() {
    (__state_setState1(!(props.state1 !== undefined ? props.state1 : __state_state1)), props.state1Change!(!(props.state1 !== undefined ? props.state1 : __state_state1)))
  }, [props.state1, __state_state1, props.state1Change]);

  const restAttributes=useCallback(function restAttributes(){
    const { defaultState1, defaultState2, defaultState3, state1, state1Change, state2, state2Change, state3, state3Change, ...restProps } = props;
    return restProps;
  }, [props]);

  return view(({
    props: {
      ...props,
      state1: (props.state1 !== undefined ? props.state1 : __state_state1),
      state2: (props.state2 !== undefined ? props.state2 : __state_state2),
      state3: (props.state3 !== undefined ? props.state3 : __state_state3)
    },
    updateState,
    restAttributes: restAttributes()
  })
  );
}

Widget.defaultProps = {
  ...WidgetInput
}
