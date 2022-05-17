import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import BaseState from './model';
function view(model: Widget) {
  return (
    <div>
      {model.props.state1}

      <BaseState baseStatePropChange={model.stateChange}></BaseState>
    </div>
  );
}

interface WidgetInputType {
  state1?: boolean;
  state2?: boolean;
  stateProp?: boolean;
  defaultState1?: boolean;
  state1Change?: (state1?: boolean) => void;
  defaultState2?: boolean;
  state2Change?: (state2: boolean) => void;
  defaultStateProp?: boolean;
  statePropChange?: (stateProp?: boolean) => void;
}

const WidgetInput = {
  defaultState1: false,
  state1Change: () => {},
  defaultState2: false,
  state2Change: () => {},
  statePropChange: () => {},
} as Partial<WidgetInputType>;
import { useState, useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetInputModel = Required<
  Omit<
    GetPropsType<typeof WidgetInput>,
    'state1' | 'stateProp' | 'defaultStateProp'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof WidgetInput>,
      'state1' | 'stateProp' | 'defaultStateProp'
    >
  >;
interface Widget {
  props: WidgetInputModel & RestProps;
  internalState: number;
  innerData?: string;
  updateState: () => any;
  updateState2: () => any;
  updateState3: (state: boolean) => any;
  updateInnerState: (state: number) => any;
  destruct: () => any;
  stateChange: (stateProp?: boolean) => any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);

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
  const [__state_internalState, __state_setInternalState] = useState<number>(0);
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
  const __updateState3 = useCallback(
    function __updateState3(state: boolean): any {
      __state_setState2((__state_state2) => state), props.state2Change!(state);
    },
    [props.state2Change]
  );
  const __updateInnerState = useCallback(function __updateInnerState(
    state: number
  ): any {
    __state_setInternalState((__state_internalState) => state);
  },
  []);
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
      return restProps as RestProps;
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
    internalState: __state_internalState,
    innerData: __state_innerData,
    updateState: __updateState,
    updateState2: __updateState2,
    updateState3: __updateState3,
    updateInnerState: __updateInnerState,
    destruct: __destruct,
    stateChange: __stateChange,
    restAttributes: __restAttributes(),
  });
}
