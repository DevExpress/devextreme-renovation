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
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
export default class Widget extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  state: {
    innerData?: string;
    state1?: boolean;
    state2: boolean;
    stateProp?: boolean;
  };
  refs: any;
  constructor(props: typeof WidgetInput & RestProps) {
    super({
      ...WidgetInput,
      ...props,
    });
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
  }

  get innerData(): string | undefined {
    return this.state.innerData;
  }
  set innerData(value: string | undefined) {
    this.setState({ innerData: value });
  }
  get state1(): boolean | undefined {
    return this.props.state1 !== undefined
      ? this.props.state1
      : this.state.state1;
  }
  set state1(value: boolean | undefined) {
    this.setState({ state1: value });
    this.props.state1Change!(value);
  }
  get state2(): boolean {
    return this.props.state2 !== undefined
      ? this.props.state2
      : this.state.state2;
  }
  set state2(value: boolean) {
    this.setState({ state2: value });
    this.props.state2Change!(value);
  }
  get stateProp(): boolean | undefined {
    return this.props.stateProp !== undefined
      ? this.props.stateProp
      : this.state.stateProp;
  }
  set stateProp(value: boolean | undefined) {
    this.setState({ stateProp: value });
    this.props.statePropChange!(value);
  }

  updateState(): any {
    this.state1 = !this.state1;
  }
  updateState2(): any {
    const cur = this.state2;
    this.state2 = cur !== false ? false : true;
  }
  destruct(): any {
    const s = this.state1;
  }
  stateChange(stateProp?: boolean): any {
    this.stateProp = stateProp;
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
      state1: this.state1,
      state2: this.state2,
      stateProp: this.stateProp,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        state1: this.state1,
        state2: this.state2,
        stateProp: this.stateProp,
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
