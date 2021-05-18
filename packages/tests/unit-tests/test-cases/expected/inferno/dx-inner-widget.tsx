import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
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
export const InnerWidgetProps: InnerWidgetPropsType = {
  defaultValue: 14,
  valueChange: () => {},
} as any as InnerWidgetPropsType;
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class InnerWidget extends BaseInfernoComponent<any> {
  state: { value: number };

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

  get restAttributes(): RestProps {
    const {
      defaultValue,
      onSelect,
      selected,
      value,
      valueChange,
      ...restProps
    } = {
      ...this.props,
      value:
        this.props.value !== undefined ? this.props.value : this.state.value,
    } as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        value:
          this.props.value !== undefined ? this.props.value : this.state.value,
      },
      restAttributes: this.restAttributes,
    } as InnerWidget);
  }
}

InnerWidget.defaultProps = {
  ...InnerWidgetProps,
};
