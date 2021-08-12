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
    this.setState((__state_argument: any) => ({
      innerState: __state_argument.innerState + 1,
    }));
    this.setState((__state_argument: any) => ({
      innerState: __state_argument.innerState + 1,
    }));
    this.setState((__state_argument: any) => ({
      innerState: __state_argument.innerState + 1,
    }));
    this.setState((__state_argument: any) => ({
      innerState: __state_argument.innerState + 1,
    }));
    {
      let __newValue;
      this.setState((__state_argument: any) => {
        __newValue =
          (this.props.propState !== undefined
            ? this.props.propState
            : __state_argument.propState) + 1;
        return { propState: __newValue };
      });
      this.props.propStateChange!(__newValue);
    }
    {
      let __newValue;
      this.setState((__state_argument: any) => {
        __newValue =
          (this.props.propState !== undefined
            ? this.props.propState
            : __state_argument.propState) + 1;
        return { propState: __newValue };
      });
      this.props.propStateChange!(__newValue);
    }
    {
      let __newValue;
      this.setState((__state_argument: any) => {
        __newValue =
          (this.props.propState !== undefined
            ? this.props.propState
            : __state_argument.propState) + 1;
        return { propState: __newValue };
      });
      this.props.propStateChange!(__newValue);
    }
    {
      let __newValue;
      this.setState((__state_argument: any) => {
        __newValue =
          (this.props.propState !== undefined
            ? this.props.propState
            : __state_argument.propState) + 1;
        return { propState: __newValue };
      });
      this.props.propStateChange!(__newValue);
    }
  }
  get restAttributes(): RestProps {
    if (this.__getterCache["restAttributes"] !== undefined) {
      return this.__getterCache["restAttributes"];
    }
    return (this.__getterCache["restAttributes"] = ((): RestProps => {
      const { defaultPropState, propState, propStateChange, ...restProps } = {
        ...this.props,
        propState:
          this.props.propState !== undefined
            ? this.props.propState
            : this.state.propState,
      } as any;
      return restProps;
    })());
  }
  __getterCache: {
    restAttributes?: RestProps;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props !== nextProps || false) {
      this.__getterCache["restAttributes"] = undefined;
    }
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

Widget.defaultProps = WidgetInput;
