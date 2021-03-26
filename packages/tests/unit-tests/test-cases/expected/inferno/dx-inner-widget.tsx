import {
  BaseInfernoComponent,
  InfernoComponent,
  normalizeStyles
} from "@devextreme/vdom";
function view(model: InnerWidget) {
  return <div style={normalizeStyles({ width: 100, height: 100 })}></div>;
}

export declare type InnerWidgetPropsType = {
  selected?: boolean;
  value: number;
  onSelect?: (e: any) => any;
  defaultValue: number;
  valueChange?: (value: number) => void;
};
export const InnerWidgetProps: InnerWidgetPropsType = ({
  defaultValue: 14,
  valueChange: () => {},
} as any) as InnerWidgetPropsType;
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class InnerWidget extends BaseInfernoComponent<
  typeof InnerWidgetProps & RestProps
> {
  state: {
    value: number;
  };
  _currentState: {
    value: number;
  } | null = null;

  refs: any;

  constructor(props: typeof InnerWidgetProps & RestProps) {
    super(props);
    this.state = {
      value:
        this.props.value !== undefined
          ? this.props.value
          : this.props.defaultValue,
    };
  }

  get __state_value(): number {
    const state = this._currentState || this.state;
    return this.props.value !== undefined ? this.props.value : state.value;
  }
  set_value(value: () => number): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this.props.valueChange!(newValue);
      this._currentState = null;
      return { value: newValue };
    });
  }

  get restAttributes(): RestProps {
    const {
      defaultValue,
      onSelect,
      selected,
      value,
      valueChange,
      ...restProps
    } = { ...this.props, value: this.__state_value };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, value: this.__state_value },
      restAttributes: this.restAttributes,
    } as InnerWidget);
  }
}

InnerWidget.defaultProps = {
  ...InnerWidgetProps,
};
