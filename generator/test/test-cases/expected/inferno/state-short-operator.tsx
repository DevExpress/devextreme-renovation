import { InfernoComponent } from "../../../../modules/inferno/base_component";
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

export default class Widget extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  state: {
    innerState: number;
    propState: number;
  };
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

Widget.defaultProps = {
  ...WidgetInput,
};
