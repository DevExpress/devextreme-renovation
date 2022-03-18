function view(model: ModelWidget) {
  return <div>{model.props.baseStateProp}</div>;
}

export type ModelWidgetInputType = {
  baseStateProp?: boolean;
  baseStatePropChange?: (stateProp?: boolean) => void;
  modelStateProp?: boolean;
  value?: boolean;
  defaultBaseStateProp?: boolean;
  defaultModelStateProp?: boolean;
  modelStatePropChange?: (modelStateProp?: boolean) => void;
  defaultValue?: boolean;
  valueChange?: (value?: boolean) => void;
};
const ModelWidgetInput: ModelWidgetInputType = {
  modelStatePropChange: () => {},
  valueChange: () => {},
};
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof ModelWidgetInput
>;
export default class ModelWidget extends InfernoComponent<
  typeof ModelWidgetInput & RestProps
> {
  state: {
    baseStateProp?: boolean;
    modelStateProp?: boolean;
    value?: boolean;
  };
  refs: any;
  constructor(props: typeof ModelWidgetInput & RestProps) {
    super({
      ...ModelWidgetInput,
      ...props,
    });
    this.state = {
      baseStateProp:
        this.props.baseStateProp !== undefined
          ? this.props.baseStateProp
          : this.props.defaultBaseStateProp,
      modelStateProp:
        this.props.modelStateProp !== undefined
          ? this.props.modelStateProp
          : this.props.defaultModelStateProp,
      value:
        this.props.value !== undefined
          ? this.props.value
          : this.props.defaultValue,
    };
  }

  get baseStateProp(): boolean | undefined {
    return this.props.baseStateProp !== undefined
      ? this.props.baseStateProp
      : this.state.baseStateProp;
  }
  set baseStateProp(value: boolean | undefined) {
    this.setState({ baseStateProp: value });
    this.props.baseStatePropChange?.(value);
  }
  get modelStateProp(): boolean | undefined {
    return this.props.modelStateProp !== undefined
      ? this.props.modelStateProp
      : this.state.modelStateProp;
  }
  set modelStateProp(value: boolean | undefined) {
    this.setState({ modelStateProp: value });
    this.props.modelStatePropChange!(value);
  }
  get value(): boolean | undefined {
    return this.props.value !== undefined ? this.props.value : this.state.value;
  }
  set value(value: boolean | undefined) {
    this.setState({ value: value });
    this.props.valueChange!(value);
  }

  get restAttributes(): RestProps {
    const {
      baseStateProp,
      baseStatePropChange,
      defaultBaseStateProp,
      defaultModelStateProp,
      defaultValue,
      modelStateProp,
      modelStatePropChange,
      value,
      valueChange,
      ...restProps
    } = {
      ...this.props,
      baseStateProp: this.baseStateProp,
      modelStateProp: this.modelStateProp,
      value: this.value,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        baseStateProp: this.baseStateProp,
        modelStateProp: this.modelStateProp,
        value: this.value,
      },
      restAttributes: this.restAttributes,
    } as ModelWidget);
  }
}
