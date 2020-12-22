function view(model: InnerWidget) {
  return <div style={{ width: 100, height: 100 }}></div>;
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
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class InnerWidget extends InfernoComponent<
  typeof InnerWidgetProps & RestProps
> {
  state: {
    value: number;
  };
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

  get value(): number {
    return this.props.value !== undefined ? this.props.value : this.state.value;
  }
  set value(value: number) {
    this.setState({ value: value });
    this.props.valueChange!(value);
  }

  get restAttributes(): RestProps {
    const {
      defaultValue,
      onSelect,
      selected,
      value,
      valueChange,
      ...restProps
    } = { ...this.props, value: this.value };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, value: this.value },
      restAttributes: this.restAttributes,
    } as InnerWidget);
  }
}

InnerWidget.defaultProps = {
  ...InnerWidgetProps,
};
