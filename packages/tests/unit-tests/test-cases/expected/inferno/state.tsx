import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
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
const WidgetInput: WidgetInputType = {
  defaultState1: false,
  state1Change: () => {},
  defaultState2: false,
  state2Change: () => {},
  statePropChange: () => {},
} as any as WidgetInputType;
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: {
    innerData?: string;
    state1?: boolean;
    state2: boolean;
    stateProp?: boolean;
  };

  refs: any;

  constructor(props: any) {
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

  innerData?: string;
  state1?: boolean;
  state2!: boolean;
  stateProp?: boolean;

  updateState(): any {
    this.setState((state: any) => {
      this.props.state1Change!(
        !(this.props.state1 !== undefined ? this.props.state1 : state.state1)
      );
      return {
        ...state,
        state1: !(this.props.state1 !== undefined
          ? this.props.state1
          : state.state1),
      };
    });
  }
  updateState2(): any {
    const cur =
      this.props.state2 !== undefined ? this.props.state2 : this.state.state2;
    this.setState((state: any) => {
      this.props.state2Change!(cur !== false ? false : true);
      return { ...state, state2: cur !== false ? false : true };
    });
  }
  destruct(): any {
    const s =
      this.props.state1 !== undefined ? this.props.state1 : this.state.state1;
  }
  stateChange(stateProp?: boolean): any {
    this.setState((state: any) => {
      this.props.statePropChange!(stateProp);
      return { ...state, stateProp: stateProp };
    });
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
      innerData: this.state.innerData,
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
