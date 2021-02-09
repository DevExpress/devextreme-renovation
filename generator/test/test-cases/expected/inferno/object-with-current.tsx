import { InfernoComponent } from "../../../../modules/inferno/base_component";
function view(model: Widget): any {
  return <span></span>;
}
type EventCallBack<Type> = (e: Type) => void;

export declare type WidgetInputType = {
  someProp?: { current: string };
};
export const WidgetInput: WidgetInputType = {};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  state: {
    someState?: { current: string };
    existsState: { current: string };
  };
  _currentState: {
    someState?: { current: string };
    existsState: { current: string };
  } | null = null;

  refs: any;

  constructor(props: typeof WidgetInput & RestProps) {
    super(props);
    this.state = {
      someState: undefined,
      existsState: { current: "value" },
    };
    this.concatStrings = this.concatStrings.bind(this);
  }

  get someState(): { current: string } | undefined {
    const state = this._currentState || this.state;
    return state.someState;
  }
  set_someState(value: () => { current: string } | undefined): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { someState: newValue };
    });
  }
  get existsState(): { current: string } {
    const state = this._currentState || this.state;
    return state.existsState;
  }
  set_existsState(value: () => { current: string }): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { existsState: newValue };
    });
  }

  concatStrings(): any {
    const fromProps = this.props.someProp?.current || "";
    const fromState = this.someState?.current || "";
    return `${fromProps}${fromState}${this.existsState.current}`;
  }
  get restAttributes(): RestProps {
    const { someProp, ...restProps } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      someState: this.someState,
      existsState: this.existsState,
      concatStrings: this.concatStrings,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};
