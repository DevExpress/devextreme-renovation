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
    innerState: number;
    propState: number;
  };
  refs: any;
  constructor(props: typeof WidgetInput & RestProps) {
    super({
      ...WidgetInput,
      ...props,
    });
    this.state = {
      innerState: 0,
      propState:
        this.props.propState !== undefined
          ? this.props.propState
          : this.props.defaultPropState,
    };
  }

  get innerState(): number {
    return this.state.innerState;
  }
  set innerState(value: number) {
    this.setState({ innerState: value });
  }
  get propState(): number {
    return this.props.propState !== undefined
      ? this.props.propState
      : this.state.propState;
  }
  set propState(value: number) {
    this.setState({ propState: value });
    this.props.propStateChange!(value);
  }

  updateState(): any {
    this.innerState = this.innerState + 1;
    this.innerState = this.innerState + 1;
    this.innerState = this.innerState + 1;
    this.innerState = this.innerState + 1;
    this.propState = this.propState + 1;
    this.propState = this.propState + 1;
    this.propState = this.propState + 1;
    this.propState = this.propState + 1;
  }
  get restAttributes(): RestProps {
    const { defaultPropState, propState, propStateChange, ...restProps } = {
      ...this.props,
      propState: this.propState,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, propState: this.propState },
      innerState: this.innerState,
      updateState: this.updateState,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}
