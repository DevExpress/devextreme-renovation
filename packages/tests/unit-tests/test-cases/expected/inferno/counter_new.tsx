import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";

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
    this.setValue = this.setValue.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  value!: number;

  createEffects() {
    return [createReRenderEffect()];
  }

  setValue(__val__: any): void {
    this.setState((__state_argument: any) => ({ value: __val__ }));
  }
  onClick(): any {
    setValue(value + 1);
  }
  get restAttributes(): RestProps {
    const { id, ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return Counter({
      props: { ...props },
      value: this.state.value,
      setValue: this.setValue,
      onClick: this.onClick,
      restAttributes: this.restAttributes,
    } as Counter);
  }
}

Counter.defaultProps = CounterInput;
