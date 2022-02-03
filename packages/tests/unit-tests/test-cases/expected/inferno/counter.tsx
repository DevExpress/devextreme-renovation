import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
function view(model: Counter) {
  return (
    <button id={model.props.id} onClick={model.onClick}>
      {model.value}
    </button>
  );
}

export declare type CounterInputType = {
  id?: string;
};
export const CounterInput: CounterInputType = {};
import { createElement as h } from "inferno-compat";
import { createReRenderEffect } from "@devextreme/runtime/inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Counter extends InfernoWrapperComponent<any> {
  state: { value: number };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      value: 1,
    };
    this.onClick = this.onClick.bind(this);
  }

  value!: number;

  createEffects() {
    return [createReRenderEffect()];
  }

  onClick(): any {
    this.setState((__state_argument: any) => ({
      value: __state_argument.value + 1,
    }));
  }
  get restAttributes(): RestProps {
    const { id, ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      value: this.state.value,
      onClick: this.onClick,
      restAttributes: this.restAttributes,
    } as Counter);
  }
}

Counter.defaultProps = CounterInput;
