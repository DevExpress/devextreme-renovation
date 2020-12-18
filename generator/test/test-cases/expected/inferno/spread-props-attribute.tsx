import InnerWidget from "./dx-inner-widget";
function view({ props, restAttributes }: Widget) {
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
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
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
    value?: boolean;
  };
  refs: any;

  constructor(props: typeof WidgetInput & RestProps) {
    super({
      ...WidgetInput,
      ...props,
    });
    this.state = {
      value:
        this.props.value !== undefined
          ? this.props.value
          : this.props.defaultValue,
    };
  }

  get value(): boolean | undefined {
    return this.props.value !== undefined ? this.props.value : this.state.value;
  }
  set value(value: boolean | undefined) {
    this.setState({ value: value });
    this.props.valueChange!(value);
  }

  get restAttributes(): RestProps {
    const { defaultValue, value, valueChange, visible, ...restProps } = {
      ...this.props,
      value: this.value,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, value: this.value },
      restAttributes: this.restAttributes,
    } as Widget);
  }
}
