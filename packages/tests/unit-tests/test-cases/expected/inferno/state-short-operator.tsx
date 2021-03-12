import {
  BaseInfernoComponent,
  InfernoComponent,
} from "@devextreme-generator/inferno-common";
function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {
  propState: number;
  defaultPropState: number;
  propStateChange?: (propState: number) => void;
};
const WidgetInput: WidgetInputType = ({
  defaultPropState: 1,
  propStateChange: () => {},
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
    innerState: number;
    propState: number;
  };
  _currentState: {
    innerState: number;
    propState: number;
  } | null = null;

  refs: any;

  constructor(props: typeof WidgetInput & RestProps) {
    super(props);
    this.state = {
      innerState: 0,
      propState:
        this.props.propState !== undefined
          ? this.props.propState
          : this.props.defaultPropState,
    };
    this.updateState = this.updateState.bind(this);
  }

  get innerState(): number {
    const state = this._currentState || this.state;
    return state.innerState;
  }
  set_innerState(value: () => number): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { innerState: newValue };
    });
  }
  get __state_propState(): number {
    const state = this._currentState || this.state;
    return this.props.propState !== undefined
      ? this.props.propState
      : state.propState;
  }
  set_propState(value: () => number): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this.props.propStateChange!(newValue);
      this._currentState = null;
      return { propState: newValue };
    });
  }

  updateState(): any {
    this.set_innerState(() => this.innerState + 1);
    this.set_innerState(() => this.innerState + 1);
    this.set_innerState(() => this.innerState + 1);
    this.set_innerState(() => this.innerState + 1);
    this.set_propState(() => this.__state_propState + 1);
    this.set_propState(() => this.__state_propState + 1);
    this.set_propState(() => this.__state_propState + 1);
    this.set_propState(() => this.__state_propState + 1);
  }
  get restAttributes(): RestProps {
    const { defaultPropState, propState, propStateChange, ...restProps } = {
      ...this.props,
      propState: this.__state_propState,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, propState: this.__state_propState },
      innerState: this.innerState,
      updateState: this.updateState,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};
