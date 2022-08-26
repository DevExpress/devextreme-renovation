import {
  BaseInfernoComponent,
} from '@devextreme/runtime/inferno';
import BaseState from './model';
function view(model: Widget) {
  return (
    <div>
      {model.props.state1}

      <BaseState baseStatePropChange={model.stateChange}></BaseState>
    </div>
  );
}

export type WidgetInputType = {
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
const WidgetInput: WidgetInputType = {
  defaultState1: false,
  state1Change: () => {},
  defaultState2: false,
  state2Change: () => {},
  statePropChange: () => {},
} as any as WidgetInputType;
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: {
    internalState: number;
    innerData?: string;
    state1?: boolean;
    state2: boolean;
    stateProp?: boolean;
  };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      internalState: 0,
      innerData: undefined,
      state1:
        this.props.state1 !== undefined
          ? this.props.state1
          : this.props.defaultState1,
      state2:
        this.props.state2 !== undefined
          ? this.props.state2
          : this.props.defaultState2,
      stateProp:
        this.props.stateProp !== undefined
          ? this.props.stateProp
          : this.props.defaultStateProp,
    };
    this.updateState = this.updateState.bind(this);
    this.updateState2 = this.updateState2.bind(this);
    this.updateState3 = this.updateState3.bind(this);
    this.updateInnerState = this.updateInnerState.bind(this);
    this.destruct = this.destruct.bind(this);
    this.stateChange = this.stateChange.bind(this);
  }

  internalState!: number;
  innerData?: string;

  updateState(): any {
    {
      let __newValue;
      this.setState((__state_argument: any) => {
        __newValue = !(this.props.state1 !== undefined
          ? this.props.state1
          : __state_argument.state1);
        return { state1: __newValue };
      });
      this.props.state1Change!(__newValue);
    }
  }
  updateState2(): any {
    const cur =
      this.props.state2 !== undefined ? this.props.state2 : this.state.state2;
    {
      let __newValue;
      this.setState((__state_argument: any) => {
        __newValue = cur !== false ? false : true;
        return { state2: __newValue };
      });
      this.props.state2Change!(__newValue);
    }
  }
  updateState3(state: boolean): any {
    {
      let __newValue;
      this.setState((__state_argument: any) => {
        __newValue = state;
        return { state2: __newValue };
      });
      this.props.state2Change!(__newValue);
    }
  }
  updateInnerState(state: number): any {
    this.setState((__state_argument: any) => ({ internalState: state }));
  }
  destruct(): any {
    const s =
      this.props.state1 !== undefined ? this.props.state1 : this.state.state1;
  }
  stateChange(stateProp?: boolean): any {
    {
      let __newValue;
      this.setState((__state_argument: any) => {
        __newValue = stateProp;
        return { stateProp: __newValue };
      });
      this.props.statePropChange!(__newValue);
    }
  }
  get restAttributes(): RestProps {
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
      ...this.props,
      state1:
        this.props.state1 !== undefined ? this.props.state1 : this.state.state1,
      state2:
        this.props.state2 !== undefined ? this.props.state2 : this.state.state2,
      stateProp:
        this.props.stateProp !== undefined
          ? this.props.stateProp
          : this.state.stateProp,
    } as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        state1:
          this.props.state1 !== undefined
            ? this.props.state1
            : this.state.state1,
        state2:
          this.props.state2 !== undefined
            ? this.props.state2
            : this.state.state2,
        stateProp:
          this.props.stateProp !== undefined
            ? this.props.stateProp
            : this.state.stateProp,
      },
      internalState: this.state.internalState,
      innerData: this.state.innerData,
      updateState: this.updateState,
      updateState2: this.updateState2,
      updateState3: this.updateState3,
      updateInnerState: this.updateInnerState,
      destruct: this.destruct,
      stateChange: this.stateChange,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetInput;
