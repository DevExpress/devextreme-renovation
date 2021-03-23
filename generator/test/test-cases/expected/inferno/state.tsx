import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoComponentWrapper,
} from "../../../../modules/inferno/base_component";
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
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<
  typeof WidgetInput & RestProps
> {
  state: {
    innerData?: string;
    state1?: boolean;
    state2: boolean;
    stateProp?: boolean;
  };
  _currentState: {
    innerData?: string;
    state1?: boolean;
    state2: boolean;
    stateProp?: boolean;
  } | null = null;

  refs: any;

  constructor(props: typeof WidgetInput & RestProps) {
    super(props);
    this.state = {
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
    this.destruct = this.destruct.bind(this);
    this.stateChange = this.stateChange.bind(this);
  }

  get innerData(): string | undefined {
    const state = this._currentState || this.state;
    return state.innerData;
  }
  set_innerData(value: () => string | undefined): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { innerData: newValue };
    });
  }
  get __state_state1(): boolean | undefined {
    const state = this._currentState || this.state;
    return this.props.state1 !== undefined ? this.props.state1 : state.state1;
  }
  set_state1(value: () => boolean | undefined): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this.props.state1Change!(newValue);
      this._currentState = null;
      return { state1: newValue };
    });
  }
  get __state_state2(): boolean {
    const state = this._currentState || this.state;
    return this.props.state2 !== undefined ? this.props.state2 : state.state2;
  }
  set_state2(value: () => boolean): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this.props.state2Change!(newValue);
      this._currentState = null;
      return { state2: newValue };
    });
  }
  get __state_stateProp(): boolean | undefined {
    const state = this._currentState || this.state;
    return this.props.stateProp !== undefined
      ? this.props.stateProp
      : state.stateProp;
  }
  set_stateProp(value: () => boolean | undefined): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this.props.statePropChange!(newValue);
      this._currentState = null;
      return { stateProp: newValue };
    });
  }

  updateState(): any {
    this.set_state1(() => !this.__state_state1);
  }
  updateState2(): any {
    const cur = this.__state_state2;
    this.set_state2(() => (cur !== false ? false : true));
  }
  destruct(): any {
    const s = this.__state_state1;
  }
  stateChange(stateProp?: boolean): any {
    this.set_stateProp(() => stateProp);
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
      state1: this.__state_state1,
      state2: this.__state_state2,
      stateProp: this.__state_stateProp,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        state1: this.__state_state1,
        state2: this.__state_state2,
        stateProp: this.__state_stateProp,
      },
      innerData: this.innerData,
      updateState: this.updateState,
      updateState2: this.updateState2,
      destruct: this.destruct,
      stateChange: this.stateChange,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};
