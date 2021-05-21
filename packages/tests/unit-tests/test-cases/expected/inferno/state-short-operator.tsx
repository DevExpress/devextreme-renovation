import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {
  propState: number;
  defaultPropState: number;
  propStateChange?: (propState: number) => void;
};
const WidgetInput: WidgetInputType = {
  defaultPropState: 1,
  propStateChange: () => {},
} as any as WidgetInputType;
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: { innerState: number; propState: number };

  refs: any;

  constructor(props: any) {
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

  innerState!: number;

  updateState(): any {
    this.setState((state: any) => ({
      ...state,
      innerState: state.innerState + 1,
    }));
    this.setState((state: any) => ({
      ...state,
      innerState: state.innerState + 1,
    }));
    this.setState((state: any) => ({
      ...state,
      innerState: state.innerState + 1,
    }));
    this.setState((state: any) => ({
      ...state,
      innerState: state.innerState + 1,
    }));
    this.setState((state: any) => {
      this.props.propStateChange!(
        (this.props.propState !== undefined
          ? this.props.propState
          : state.propState) + 1
      );
      return {
        ...state,
        propState:
          (this.props.propState !== undefined
            ? this.props.propState
            : state.propState) + 1,
      };
    });
    this.setState((state: any) => {
      this.props.propStateChange!(
        (this.props.propState !== undefined
          ? this.props.propState
          : state.propState) + 1
      );
      return {
        ...state,
        propState:
          (this.props.propState !== undefined
            ? this.props.propState
            : state.propState) + 1,
      };
    });
    this.setState((state: any) => {
      this.props.propStateChange!(
        (this.props.propState !== undefined
          ? this.props.propState
          : state.propState) + 1
      );
      return {
        ...state,
        propState:
          (this.props.propState !== undefined
            ? this.props.propState
            : state.propState) + 1,
      };
    });
    this.setState((state: any) => {
      this.props.propStateChange!(
        (this.props.propState !== undefined
          ? this.props.propState
          : state.propState) + 1
      );
      return {
        ...state,
        propState:
          (this.props.propState !== undefined
            ? this.props.propState
            : state.propState) + 1,
      };
    });
  }
  get restAttributes(): RestProps {
    const { defaultPropState, propState, propStateChange, ...restProps } = {
      ...this.props,
      propState:
        this.props.propState !== undefined
          ? this.props.propState
          : this.state.propState,
    } as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        propState:
          this.props.propState !== undefined
            ? this.props.propState
            : this.state.propState,
      },
      innerState: this.state.innerState,
      updateState: this.updateState,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};
