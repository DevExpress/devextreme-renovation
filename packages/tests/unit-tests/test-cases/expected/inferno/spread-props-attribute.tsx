import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
import InnerWidget from "./dx-inner-widget";
function view({ props, restAttributes }: Widget): any | null {
  return <InnerWidget {...(props as any)} {...restAttributes} />;
}

export declare type WidgetInputType = {
  visible?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  valueChange?: (value?: boolean) => void;
};
export const WidgetInput: WidgetInputType = {
  valueChange: () => {},
};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: {
    value?: boolean;
  };
  _currentState: {
    value?: boolean;
  } | null = null;

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      value:
        this.props.value !== undefined
          ? this.props.value
          : this.props.defaultValue,
    };
  }

  get __state_value(): boolean | undefined {
    const state = this._currentState || this.state;
    return this.props.value !== undefined ? this.props.value : state.value;
  }
  set_value(value: () => boolean | undefined): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this.props.valueChange!(newValue);
      this._currentState = null;
      return { value: newValue };
    });
  }

  get restAttributes(): RestProps {
    const { defaultValue, value, valueChange, visible, ...restProps } = {
      ...this.props,
      value: this.__state_value,
    } as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, value: this.__state_value },
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};
